# PR: Wire WPS UI to Production CODEX Endpoint

**Type:** Feature  
**Priority:** High  
**Status:** Ready for Review

---

## 📋 **Summary**

Replace mock `clauseLookup` implementation in WPSGenerator with production CODEX function call. Includes feature flagging for safe rollout, development fallback, retry logic, and user-friendly empty result messages.

---

## 🎯 **Changes**

### **Files Created:**

1. **`src/services/clausebot.ts`** (NEW)
   - Production `queryCodex()` function
   - Development mock fallback
   - Error handling and retry logic (3 attempts with exponential backoff)
   - Empty results message helper

### **Files Modified:**

2. **`src/lib/clauseLookup.ts`**
   - Add integration point for CODEX service
   - Keep existing mock as fallback

3. **`src/components/WPSGenerator.tsx`**
   - Update clause suggestion handler to use CODEX
   - Add empty results handling

---

## 📝 **Commit Message**

```
chore(api): switch codex UI to production ClauseBot endpoint + auth, improve fallback handling

- Add production queryCodex() service calling Netlify codex-query function
- Implement retry logic with exponential backoff (3 attempts)
- Add user-friendly empty results messages for overly-specific queries
- Maintain development mock fallback for local testing
- Update WPSGenerator to use CODEX service with graceful error handling
```

---

## 🔧 **Code Changes**

### **1. New File: `src/services/clausebot.ts`**

See full implementation in `src/services/clausebot.ts`:

- `queryCodex(q, top_k)` - Production CODEX function call
- `clauseLookup(query, top_k)` - Auto-fallback wrapper
- `getEmptyResultsMessage(query)` - User-friendly empty result messages
- Retry logic: 3 attempts with exponential backoff (500ms, 1000ms, 2000ms)
- Error handling: Distinguishes 4xx (no retry) vs 5xx (retry)

### **2. Update: `src/lib/clauseLookup.ts`**

Add CODEX integration option:

```typescript
import { clauseLookup as codexLookup, getEmptyResultsMessage } from '../services/clausebot';

/**
 * Smart clause suggestion engine with CODEX integration
 * Falls back to local mock if CODEX unavailable
 */
export async function suggestClauseAsync(
  fieldName: string,
  fieldValue: string,
  context?: { pNumber?: string; fNumber?: string; process?: string }
): Promise<ClauseRef[]> {
  // Build query from field context
  const query = `${fieldName} ${fieldValue} ${context?.process || ''}`.trim();
  
  try {
    const codexResponse = await codexLookup(query, 3);
    
    if (codexResponse.results.length === 0) {
      // Fall back to local mock
      return suggestClause(fieldName, fieldValue, context);
    }
    
    // Transform CODEX results to ClauseRef format
    return codexResponse.results.map((result, idx) => ({
      code: result.metadata.Code_Reference_Primary?.split(',')[0] || 'AWS D1.1',
      clause: result.metadata.clause_reference || result.metadata.Code_Reference_Primary || '',
      id: result.metadata.NLM_ID || `codex-${idx}`,
      text: result.text,
      confidence: result.score,
    }));
  } catch (error) {
    console.warn('CODEX lookup failed, using local mock:', error);
    return suggestClause(fieldName, fieldValue, context);
  }
}

// Keep existing synchronous suggestClause for backward compatibility
export function suggestClause(...) { /* existing implementation */ }
```

### **3. Update: `src/components/WPSGenerator.tsx`**

Update clause suggestions to use CODEX:

```typescript
import { suggestClauseAsync } from '../lib/clauseLookup';
import { getEmptyResultsMessage } from '../services/clausebot';

// In component:
const [clauseSuggestions, setClauseSuggestions] = useState<Record<string, ClauseRef>>({});
const [clauseSearchError, setClauseSearchError] = useState<string | null>(null);

// Update clause suggestions with CODEX
useEffect(() => {
  const updateSuggestions = async () => {
    try {
      setClauseSearchError(null);
      
      const suggestions: Record<string, ClauseRef> = {};
      
      // Use async CODEX lookup
      const [baseMetalSuggestion] = await suggestClauseAsync('base_metal', baseMetal, { pNumber: pNo, process });
      suggestions.baseMetal = baseMetalSuggestion;
      
      const [fillerMetalSuggestion] = await suggestClauseAsync('filler_metal', fillerMetal, { fNumber: fNo, process });
      suggestions.fillerMetal = fillerMetalSuggestion;
      
      // ... repeat for other fields
      
      setClauseSuggestions(suggestions);
    } catch (error) {
      console.error('Clause lookup failed:', error);
      setClauseSearchError('Unable to fetch clause suggestions. Using local fallback.');
      // Fall back to synchronous local lookup
      setClauseSuggestions(/* existing useMemo logic */);
    }
  };
  
  updateSuggestions();
}, [baseMetal, pNo, fillerMetal, fNo, process, thickness, position, preheat, pwht]);
```

---

## 🧪 **How to Test**

1. **Deploy branch to Netlify preview**
   ```bash
   git checkout -b feature/codex-ui-integration
   git add .
   git commit -m "chore(api): switch codex UI to production ClauseBot endpoint + auth, improve fallback handling"
   git push origin feature/codex-ui-integration
   ```

2. **Test queries in WPS Generator:**
   - Enter "preheat" in preheat field → expect 1 hit with valid metadata
   - Enter "preheat clause 6.5" → expect empty result and UX fallback message
   - Enter "GTAW" in process field → expect process-related clause suggestions
   - Test with network throttling → verify retry logic works

3. **Verify logs on Netlify functions:**
   - Check function logs show `Calling ClauseBot API` log line
   - Verify timing metrics appear in logs
   - Confirm no 401/403 authentication errors

4. **Run smoke tests:**
   ```powershell
   .\test-codex-function.ps1
   ```

---

## ✅ **QA Checklist**

- [ ] Netlify preview functions succeed (200 OK)
- [ ] Auth header present for upstream fetch (check Netlify logs)
- [ ] UI displays results and metadata correctly
- [ ] Fallback behavior appears for empty responses
- [ ] Retry logic works on transient failures
- [ ] No sensitive keys pushed to repo
- [ ] Development mode uses mock (no network calls)
- [ ] Production mode uses CODEX endpoint
- [ ] Error messages are user-friendly

---

## 📊 **Expected Behavior**

### **Production (Netlify)**
- Calls `/.netlify/functions/codex-query` (relative path)
- Retries on 5xx errors (3 attempts with backoff)
- Falls back to mock if CODEX completely fails
- Shows helpful message for empty results

### **Development (Local)**
- Uses mock data (no network calls)
- Fast, predictable results for testing

### **Empty Results Handling**
- Detects overly-specific queries (e.g., "preheat clause 6.5")
- Suggests broader search terms
- Falls back to local mock suggestions

---

## 🔗 **Related**

- Issue #29: Netlify `codex-query` Function Deployment ✅ RESOLVED
- Netlify Function: https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query
- Function Logs: https://app.netlify.com/projects/weldtrack-inspector/logs-and-metrics/functions/codex-query

---

## 📝 **Notes**

- Environment variable `CLAUSEBOT_API_KEY` must be set in Netlify (already configured)
- Function endpoint is automatically determined based on `import.meta.env.PROD`
- Retry logic only applies to 5xx errors (server errors), not 4xx (client errors)
- Empty results message helps users understand why no matches were found

---

**Ready for Review** ✅

