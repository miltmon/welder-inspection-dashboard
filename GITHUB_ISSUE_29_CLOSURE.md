## Issue #29 — RESOLVED ✅

**Summary**
The Netlify `codex-query` function is now fully operational and successfully querying the ClauseBot API. Key fixes were deployed and verified in production.

**What was fixed**
- `CLAUSEBOT_API_KEY` added to Netlify env for production
- Consolidated functions to `netlify/functions/` and removed stale `.netlify/functions` cache
- Upstream calls use Bearer token authentication
- Enhanced logging: incoming payload, API URL, timing, response summary, transformed results
- Redeployed via Netlify Dashboard (Clear cache & deploy)

**Evidence (production logs)**

```
Dec 18, 12:54:29 PM: Calling ClauseBot API: https://clausebot-api.onrender.com/v1/clauses/search/preheat?limit=3
Dec 18, 12:54:29 PM: ClauseBot API fetch completed in 144 ms
Dec 18, 12:54:29 PM: ClauseBot API response: { search_term: 'preheat', total_hits: 1, hits_received: 1 }
Dec 18, 12:54:29 PM: First hit details: { question_id: 'CWI-2025-001', clause_reference: '4.2.3, Table 4.1', match_score: 1, primary_keyword: 'preheat_temperature' }
Dec 18, 12:54:29 PM: Transformed results: { count: 1, query: 'preheat' }
```

**Verification**
- ✅ `preheat` query returns valid result in ~144–287ms
- ✅ `preheat clause 6.5` returns empty (expected - phrase too specific for current SSOT content)
- ✅ 200 OK responses with correct JSON for tested inputs
- ✅ Complete metadata: `NLM_ID`, `Code_Reference_Primary`, `clause_reference`, `question`

**Test Results**

**Test 1: "preheat"**
```json
{
  "query": "preheat",
  "results": [
    {
      "score": 1,
      "text": "AWS D1.1:2025 Table 4.1 specifies 300°F (149°C) minimum preheat...",
      "metadata": {
        "NLM_ID": "CWI-2025-001",
        "Code_Reference_Primary": "4.2.3, Table 4.1",
        "clause_reference": "4.2.3, Table 4.1",
        "primary_keyword": "preheat_temperature"
      }
    }
  ],
  "count": 1
}
```

**Test 2: "preheat clause 6.5"**
```json
{
  "query": "preheat clause 6.5",
  "results": [],
  "count": 0
}
```
(Expected - query too specific for current SSOT index)

**Deployment Details**
- **Production URL:** https://weldtrack-inspector.netlify.app
- **Function Endpoint:** https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query
- **Deploy ID:** `6944695eb04a4087f7cc097e`
- **Logs:** https://app.netlify.com/projects/weldtrack-inspector/logs-and-metrics/functions/codex-query

**Next steps (optional)**
- Swap UI mock `queryCodex()` to production endpoint
- Add client-side fallback for overly-specific clause queries
- Add monitoring/alerts for function errors and latency

Closing this issue as **Resolved**.

