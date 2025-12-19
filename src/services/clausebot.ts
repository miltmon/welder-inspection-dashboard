/**
 * ClauseBot CODEX Integration Service
 * 
 * Production: Calls Netlify CODEX function
 * Development: Falls back to mock for local testing
 * 
 * P5 Enhancement: Robust retry/backoff, 8s timeout, fallback query handling, telemetry hooks
 */

export interface ClauseSearchResult {
  score: number;
  text: string;
  metadata: {
    NLM_ID?: string;
    Code_Reference_Primary?: string;
    SME_Reviewer_Initials?: string;
    question?: string;
    clause_reference?: string;
    primary_keyword?: string;
    question_id?: string;
    match_score?: number;
    excerpt?: string;
    response_hash?: string;
    [key: string]: any;
  };
}

export interface CodexResponse {
  query: string;
  results: ClauseSearchResult[];
  hits?: ClauseSearchResult[]; // Alternative field name
  count: number;
  timestamp?: string;
  reason?: string;
}

type CodexResult = {
  count: number;
  query: string;
  hits?: any[];
  results?: any[];
  reason?: string;
};

const CODEX_ENDPOINT = '/.netlify/functions/codex-query';
const TELEMETRY_URL = import.meta.env.VITE_TELEMETRY_URL || import.meta.env.REACT_APP_TELEMETRY_URL || ''; // optional

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

function relaxQuery(q: string): string {
  // Simple heuristic: remove clause numbers, parentheses, extra punctuation
  // e.g., "preheat clause 6.5" -> "preheat"
  return q.replace(/clause\s*\d+(\.\d+)?/gi, '').replace(/[()]/g, '').trim();
}

async function sendTelemetry(payload: Record<string, any>): Promise<void> {
  if (!TELEMETRY_URL) return;
  try {
    await fetch(TELEMETRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // don't block main flow on telemetry failure
    console.warn('telemetry failed', e);
  }
}

/**
 * Query CODEX function with production-ready error handling and timeout
 * 
 * Features:
 * - 8s timeout (matches Netlify function timeout)
 * - Exponential backoff retry (3 attempts)
 * - Fallback query when no hits (relax specificity)
 * - Proper error handling for 4xx vs 5xx
 * - Telemetry hooks for monitoring
 * 
 * @param q - Search query string
 * @param top_k - Number of results to return (default: 3)
 * @param opts - Optional retry/timeout configuration
 * @returns Result object with ok flag, data, or error
 */
export async function queryCodex(
  q: string,
  top_k: number = 3,
  opts?: { retries?: number; timeoutMs?: number }
): Promise<{ ok: boolean; data?: CodexResult; error?: string }> {
  const retries = opts?.retries ?? 3;
  const timeoutMs = opts?.timeoutMs ?? 8000;

  let attempt = 0;
  const trace_id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const payload: { q: string; top_k: number } = { q, top_k };

  while (attempt < retries) {
    attempt += 1;
    const backoffMs = 200 * Math.pow(2, attempt - 1); // 200, 400, 800...
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const start = Date.now();
    try {
      const res = await fetch(CODEX_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // front-end won't have CLAUSEBOT_API_KEY, Netlify function should handle auth
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);
      const ms = Date.now() - start;

      // Telemetry: call (best-effort)
      sendTelemetry({
        trace_id,
        attempt,
        status: res.status,
        latency_ms: ms,
        query: q,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = `codex HTTP ${res.status}: ${text}`;
        if (attempt < retries) {
          console.warn(`codex attempt ${attempt} failed, retrying`, err);
          await sleep(backoffMs);
          continue;
        }
        return { ok: false, error: err };
      }

      const json = await res.json().catch(() => null);
      if (!json) {
        const err = 'Invalid JSON from codex';
        if (attempt < retries) {
          await sleep(backoffMs);
          continue;
        }
        return { ok: false, error: err };
      }

      // Normalize response: handle both 'hits' and 'results' fields
      const hits = json.hits || json.results || [];
      const count = json.count ?? hits.length;

      // expected shape: { count, query, hits } or { count, query, results }
      if (count === 0 || hits.length === 0) {
        // fallback logic: only attempt fallback once (on final attempt or after first fail)
        if (attempt < retries) {
          // relax query and retry faster
          const relaxed = relaxQuery(q);
          if (relaxed && relaxed !== q) {
            payload.q = relaxed;
            console.info(`codex fallback: relaxing query from "${q}" -> "${relaxed}"`);
            await sleep(backoffMs);
            continue;
          }
        }

        // return structured empty response to UI for fallback message
        return { 
          ok: true, 
          data: { 
            count: 0, 
            query: payload.q, 
            hits: [], 
            results: [],
            reason: 'no_hits' 
          } 
        };
      }

      // successful result - normalize to consistent format
      return { 
        ok: true, 
        data: { 
          count, 
          query: json.query || payload.q, 
          hits,
          results: hits // Support both field names
        } 
      };
    } catch (err: any) {
      clearTimeout(timer);
      const isAbort = err?.name === 'AbortError' || err?.message?.includes('aborted');
      const label = isAbort ? 'timeout' : err?.message || 'network';
      // telemetry on exception
      sendTelemetry({ trace_id, attempt, error: label, query: q });
      if (attempt < retries) {
        await sleep(200 * Math.pow(2, attempt - 1));
        continue;
      }
      return { ok: false, error: `codex ${label}` };
    }
  }

  return { ok: false, error: 'exhausted_retries' };
}

/**
 * Mock clause lookup (Development fallback)
 * 
 * @param query - Search query string
 * @returns Mock clause results
 */
function mockClauseLookup(query: string): CodexResponse {
  return {
    query,
    results: [
      {
        score: 0.92,
        text: `Mock clause result for "${query}". In production, this would be retrieved from ClauseBot API via CODEX function.`,
        metadata: {
          NLM_ID: "mock://dev",
          Code_Reference_Primary: "AWS D1.1:2020 Clause 6.5 (Mock)",
          SME_Reviewer_Initials: "DEV",
        },
      },
      {
        score: 0.87,
        text: `Additional mock result for development testing.`,
        metadata: {
          NLM_ID: "mock://dev-2",
          Code_Reference_Primary: "AWS D1.1:2020 Clause 6.5.1 (Mock)",
          SME_Reviewer_Initials: "DEV",
        },
      },
    ],
    count: 2,
  };
}

/**
 * Clause lookup with automatic fallback
 * 
 * Production: Uses CODEX function
 * Development: Falls back to mock
 * 
 * @param query - Search query string
 * @param top_k - Number of results (default: 3)
 * @returns Clause search results
 */
export async function clauseLookup(
  query: string,
  top_k: number = 3
): Promise<CodexResponse> {
  // Use production CODEX in production builds
  if (import.meta.env.PROD) {
    try {
      const result = await queryCodex(query, top_k);
      if (result.ok && result.data) {
        // Convert to CodexResponse format
        const hits = result.data.hits || result.data.results || [];
        return {
          query: result.data.query || query,
          results: hits.map((hit: any) => ({
            score: hit.match_score || hit.score || 0,
            text: hit.excerpt || hit.text || '',
            metadata: {
              NLM_ID: hit.question_id || hit.metadata?.NLM_ID,
              Code_Reference_Primary: hit.clause_reference || hit.metadata?.Code_Reference_Primary,
              clause_reference: hit.clause_reference,
              question_id: hit.question_id,
              match_score: hit.match_score,
              excerpt: hit.excerpt,
              response_hash: hit.response_hash,
              ...hit.metadata,
            },
          })),
          count: result.data.count,
          timestamp: new Date().toISOString(),
        };
      }
      // If query failed but we got empty results, return empty response
      if (result.ok && result.data?.reason === 'no_hits') {
        return {
          query: result.data.query || query,
          results: [],
          count: 0,
          timestamp: new Date().toISOString(),
        };
      }
      // Error case - fall back to mock
      console.error('CODEX function failed, falling back to mock:', result.error);
      return mockClauseLookup(query);
    } catch (error) {
      console.error('CODEX function failed, falling back to mock:', error);
      return mockClauseLookup(query);
    }
  }

  // Development: use mock
  return mockClauseLookup(query);
}

/**
 * Get user-friendly message for empty results
 * 
 * @param query - The search query that returned no results
 * @returns Helpful message suggesting broader search terms
 */
export function getEmptyResultsMessage(query: string): string {
  // Check if query is overly specific (contains clause numbers, etc.)
  const hasClauseNumber = /\b(clause|section|table)\s+\d+[.\d]*/i.test(query);
  const hasSpecificRef = /\b\d+\.\d+\.\d+/i.test(query); // e.g., "6.5.1"
  
  if (hasClauseNumber || hasSpecificRef) {
    return `No exact clause match found for "${query}". Try a broader search term like "preheat" or "preheat temperature" for better results.`;
  }
  
  return `No results found for "${query}". Try different keywords or check spelling.`;
}
