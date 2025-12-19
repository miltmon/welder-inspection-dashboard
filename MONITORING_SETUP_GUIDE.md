# Monitoring Setup Guide: codex-query Function

**Goal:** Get alerted quickly if `codex-query` starts failing or slows down.

---

## 🎯 **Monitoring Strategy**

1. **Netlify Built-in Alerts** (Basic - Quick Setup)
2. **Sentry Integration** (Recommended - Structured Errors)
3. **Logflare / Papertrail** (Optional - Advanced Log Analysis)

---

## 1️⃣ **Netlify Built-in Alerts** (Basic)

### **Step 1: Enable Function Failure Alerts**

1. Go to **Netlify Dashboard** → **Team Settings** → **Notifications**
2. Enable:
   - ✅ **Function failures** → Email/Slack
   - ✅ **Deploy failures** → Email/Slack
   - ✅ **Build failures** → Email/Slack

### **Step 2: Function-Specific Metrics**

1. Go to **Netlify Dashboard** → **weldtrack-inspector** → **Logs & metrics** → **Functions**
2. Select **codex-query** function
3. Monitor:
   - **Error rate** (should be < 1%)
   - **Average latency** (should be < 1000ms)
   - **Invocation count** (track usage)

### **Step 3: Set Up Slack Webhook** (Optional)

1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. In Netlify **Notifications**, add Slack webhook URL
3. Test by triggering a function error

**Alert Thresholds:**
- Error rate: `>= 1%` over 5 minutes → alert
- Avg latency: `> 1000ms` over 5 minutes → alert
- Function timeout: `> 10 seconds` → immediate alert

---

## 2️⃣ **Sentry Integration** (Recommended)

### **Step 1: Install Sentry SDK**

Add to `netlify/functions/codex-query.js`:

```javascript
// At top of file
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Add to Netlify env
  environment: process.env.CONTEXT || 'development',
  tracesSampleRate: 0.1, // 10% of transactions
});

exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
  // Existing handler code
  try {
    // ... function logic ...
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        function: 'codex-query',
        httpMethod: event.httpMethod,
      },
      extra: {
        query: event.body ? JSON.parse(event.body).q : 'unknown',
        userAgent: event.headers['user-agent'],
      },
    });
    throw error;
  }
});
```

### **Step 2: Add Sentry DSN to Netlify**

1. Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables**
2. Add:
   - `SENTRY_DSN` = `https://your-sentry-dsn@sentry.io/project-id`

### **Step 3: Create Sentry Alert Rules**

1. Go to **Sentry Dashboard** → **Alerts** → **Create Alert Rule**
2. Conditions:
   - **When:** `event.type == error` AND `tags.function == codex-query`
   - **Then:** Send to Slack/PagerDuty
3. Additional rules:
   - **Latency:** `transaction.duration > 1000ms` → alert
   - **Error rate:** `count() > 10` in 5 minutes → alert

**Sample Alert Text:**
```
[ALERT] codex-query function — Error detected
Service: codex-query (weldtrack-inspector)
Error: CODEX function failed: 504 Gateway Timeout
Query: "preheat clause 6.5"
View in Sentry: [link]
```

---

## 3️⃣ **Logflare / Papertrail** (Optional)

### **Logflare Setup**

1. Create Logflare account: https://logflare.app
2. Forward Netlify logs to Logflare:
   - Netlify → **Integrations** → **Logflare**
   - Connect account
3. Create searches/queries:
   - `ClauseBot API fetch completed in` → Track latency
   - `ClauseBot API response: { total_hits: 0 }` → Track empty results
   - `Authentication failed` / `401` → Track auth errors
   - `ClauseBot API request timed out` → Track timeouts

### **Papertrail Setup**

1. Create Papertrail account: https://www.papertrail.com
2. Forward Netlify logs:
   - Netlify → **Integrations** → **Papertrail**
   - Add syslog endpoint
3. Create saved searches:
   - `codex-query ERROR` → Alert on errors
   - `codex-query timeout` → Alert on timeouts
   - `codex-query 504` → Alert on gateway timeouts

---

## 📊 **Key Metrics to Monitor**

### **Performance Metrics**
- **Average latency:** Should be < 500ms (currently ~144-287ms)
- **P95 latency:** Should be < 1000ms
- **P99 latency:** Should be < 2000ms
- **Timeout rate:** Should be < 0.1%

### **Reliability Metrics**
- **Error rate:** Should be < 1%
- **Success rate:** Should be > 99%
- **4xx errors:** Should be < 0.5% (client errors)
- **5xx errors:** Should be < 0.5% (server errors)

### **Business Metrics**
- **Empty result rate:** Track queries returning 0 results
- **Query volume:** Track daily/weekly usage
- **Popular queries:** Identify most common searches

---

## 🚨 **Alert Thresholds**

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error rate | > 1% (5 min) | Alert team |
| Avg latency | > 1000ms (5 min) | Alert team |
| Timeout rate | > 0.5% (5 min) | Alert team |
| 5xx errors | > 5 (5 min) | Alert team |
| Function timeout | > 10s | Immediate alert |
| Upstream API down | 3 consecutive failures | Page on-call |

---

## 📝 **Sample Alert Messages**

### **Error Rate Alert**
```
[ALERT] codex-query function — Error rate >1% (last 5m)
Service: codex-query (weldtrack-inspector)
Error rate: 2.3% (5 errors / 217 requests)
Recent errors:
- Dec 18 12:54:29: CODEX function failed: 504 Gateway Timeout
- Dec 18 12:54:35: CODEX function failed: 500 Internal Server Error
View logs: https://app.netlify.com/projects/weldtrack-inspector/logs/functions
```

### **Latency Alert**
```
[ALERT] codex-query function — High latency detected
Service: codex-query (weldtrack-inspector)
Average latency: 1,247ms (threshold: 1000ms)
P95 latency: 2,100ms
Recent slow requests:
- Dec 18 12:54:29: ClauseBot API fetch completed in 1,247 ms
- Dec 18 12:54:35: ClauseBot API fetch completed in 1,189 ms
View logs: https://app.netlify.com/projects/weldtrack-inspector/logs/functions
```

### **Timeout Alert**
```
[CRITICAL] codex-query function — Timeout detected
Service: codex-query (weldtrack-inspector)
Timeout: ClauseBot API request timed out after 8000 ms
Query: "preheat clause 6.5"
Action: Check upstream API status
View logs: https://app.netlify.com/projects/weldtrack-inspector/logs/functions
```

---

## 🔧 **Implementation Checklist**

### **Netlify Built-in** (Quick Setup)
- [ ] Enable function failure alerts in Netlify
- [ ] Set up Slack webhook (optional)
- [ ] Monitor error rate and latency in dashboard
- [ ] Set up weekly reports

### **Sentry** (Recommended)
- [ ] Install `@sentry/node` package
- [ ] Add Sentry.init() to function
- [ ] Add SENTRY_DSN to Netlify env
- [ ] Create alert rules in Sentry
- [ ] Test error capture

### **Logflare / Papertrail** (Optional)
- [ ] Create Logflare/Papertrail account
- [ ] Connect Netlify integration
- [ ] Set up saved searches
- [ ] Create alert rules
- [ ] Test log forwarding

---

## 📚 **Resources**

- **Netlify Functions Monitoring:** https://docs.netlify.com/functions/monitoring/
- **Sentry Netlify Integration:** https://docs.sentry.io/platforms/javascript/guides/serverless/guides/netlify/
- **Logflare Netlify Integration:** https://docs.logflare.app/guides/netlify
- **Function Logs:** https://app.netlify.com/projects/weldtrack-inspector/logs-and-metrics/functions/codex-query

---

## 🎯 **Next Steps**

1. **Start with Netlify built-in alerts** (5 minutes)
2. **Add Sentry for structured error tracking** (30 minutes)
3. **Set up Logflare for advanced log analysis** (optional, 1 hour)

---

**Last Updated:** 2025-12-18  
**Status:** Ready for Implementation

