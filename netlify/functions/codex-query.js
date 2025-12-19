// CODEX Query Serverless Function for Netlify
// Proxies queries to ClauseBot API and returns formatted results

// helper: mask secrets (show first/last chars only)
function maskEnv(v) {
  if (!v) return 'MISSING';
  if (v.length <= 8) return '****';
  return `${v.slice(0,4)}...${v.slice(-4)}`;
}

exports.handler = async (event, context) => {
  // DEBUG: masked env visibility (remove after debug)
  console.log('codex-query invoked at', new Date().toISOString());
  console.log('ENV CLAUSEBOT_KEY =', maskEnv(process.env.CLAUSEBOT_KEY));
  console.log('ENV CLAUSEBOT_ENDPOINT =', process.env.CLAUSEBOT_ENDPOINT || 'MISSING');
  console.log('ENV VITE_CLAUSEBOT_KEY =', maskEnv(process.env.VITE_CLAUSEBOT_KEY));
  console.log('ENV VITE_CLAUSEBOT_ENDPOINT =', process.env.VITE_CLAUSEBOT_ENDPOINT || 'MISSING');
  // show minimal payload info (no PII)
  let payload = {};
  try { payload = event.body ? JSON.parse(event.body) : {}; } catch(e) { payload = { raw: event.body }; }
  console.log('incoming payload preview:', { q: payload.q, top_k: payload.top_k });

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const query = body.q || body.query || '';
    const topK = body.top_k || body.topK || 3;

    if (!query || query.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Query parameter "q" is required' })
      };
    }

    // Get environment variables
    // Default to /v1/clauses/search endpoint (GET with term as path param)
    const clausebotEndpoint = process.env.CLAUSEBOT_ENDPOINT || process.env.VITE_CLAUSEBOT_ENDPOINT || 'https://clausebot-api.onrender.com/v1/clauses/search';

    // Build URL: /v1/clauses/search/{term}?limit={number}
    // Example: https://clausebot-api.onrender.com/v1/clauses/search/preheat?limit=3
    const searchTerm = encodeURIComponent(query.trim());
    const url = `${clausebotEndpoint}/${searchTerm}?limit=${topK}`;
    
    // Log the URL being called for debugging
    console.log('Calling ClauseBot API:', url);
    // Determine API key for Authorization header
    const apiKey = process.env.CLAUSEBOT_API_KEY || process.env.CLAUSEBOT_KEY || process.env.VITE_CLAUSEBOT_KEY;
    if (!apiKey) {
      console.error('Missing ClauseBot API key: set CLAUSEBOT_API_KEY (or CLAUSEBOT_KEY/VITE_CLAUSEBOT_KEY)');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing ClauseBot API key. Set CLAUSEBOT_API_KEY in Netlify env.', hint: 'netlify env:set CLAUSEBOT_API_KEY <value>' })
      };
    }

    // Call ClauseBot API (GET method with Authorization header) with timeout
    const controller = new AbortController();
    const timeoutMs = 8000; // 8s timeout to avoid Netlify 504s
    const startedAt = Date.now();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    let apiResponse;
    try {
      apiResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal
      });
    } catch (e) {
      if (e.name === 'AbortError') {
        const elapsed = Date.now() - startedAt;
        console.error('ClauseBot API request timed out after', elapsed, 'ms');
        return {
          statusCode: 504,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            error: 'Upstream timeout contacting ClauseBot API',
            timeout_ms: timeoutMs,
            url
          })
        };
      }
      throw e;
    } finally {
      clearTimeout(timeoutId);
      console.log('ClauseBot API fetch completed in', (Date.now() - startedAt), 'ms');
    }

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('ClauseBot API error:', apiResponse.status, errorText);
      return {
        statusCode: apiResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'ClauseBot API request failed',
          status: apiResponse.status,
          details: errorText.substring(0, 200) // Limit error message length
        })
      };
    }

    const apiData = await apiResponse.json();

    // Structured logging of upstream response
    const hitCount = apiData.hits?.length || 0;
    const totalHits = apiData.total_hits || 0;
    console.log('ClauseBot API response:', {
      search_term: apiData.search_term,
      total_hits: totalHits,
      hits_received: hitCount
    });
    
    if (hitCount > 0 && apiData.hits[0]) {
      const firstHit = apiData.hits[0];
      console.log('First hit details:', {
        question_id: firstHit.question_id,
        clause_reference: firstHit.clause_reference,
        match_score: firstHit.match_score,
        primary_keyword: firstHit.primary_keyword
      });
    } else {
      console.log('No hits received from ClauseBot API');
    }

    // Transform response to expected format
    // ClauseBot API returns: { search_term, total_hits, hits: [{ question_id, clause_reference, question, explanation, primary_keyword, match_score }] }
    const results = (apiData.hits || []).map((hit, index) => ({
      score: hit.match_score || (1 - index * 0.1),
      text: hit.explanation || hit.question || '',
      metadata: {
        NLM_ID: hit.question_id || `nlm://doc${index}#chunk${index}`,
        Code_Reference_Primary: hit.clause_reference || 'AWS D1.1',
        SME_Reviewer_Initials: 'MAJ',
        question: hit.question,
        clause_reference: hit.clause_reference,
        primary_keyword: hit.primary_keyword
      }
    }));

    console.log('Transformed results:', {
      count: results.length,
      query: query.trim()
    });

    // Return formatted response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        query: query.trim(),
        results: results,
        count: results.length,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        hint: 'Check function logs in Netlify dashboard'
      })
    };
  }
};

