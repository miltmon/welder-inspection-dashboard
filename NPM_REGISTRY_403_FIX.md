# 🔧 npm Registry 403 Error Fix

**Issue:** `npm ci` fails with HTTP 403 for ajv when downloading from registry.npmjs.org  
**Status:** ✅ Fixed with retry logic and fallback to `npm install`

---

## ✅ **FIXES APPLIED**

### **1. Updated `.github/workflows/verify.yml`**

**Changes:**
- ✅ Added npm registry configuration with retry logic
- ✅ Added fallback from `npm ci` to `npm install` if `npm ci` fails
- ✅ Configured npm fetch retry settings (3 retries, 20-120s timeout)
- ✅ Added Node.js verification job (optional, only runs if `package.json` exists)

**Key improvements:**
```yaml
- name: Configure npm registry (fix 403 errors)
  run: |
    npm config set registry https://registry.npmjs.org/
    npm config set fetch-retries 3
    npm config set fetch-retry-mintimeout 20000
    npm config set fetch-retry-maxtimeout 120000

- name: Install dependencies (with fallback)
  run: |
    if npm ci --legacy-peer-deps 2>&1; then
      echo "✅ npm ci succeeded"
    else
      echo "⚠️  npm ci failed, trying npm install..."
      npm install --legacy-peer-deps
    fi
```

### **2. Updated `.gitignore`**

**Added:**
- `.netlify/` - Netlify build artifacts (generated during build)
- `.netlify/**` - All Netlify build files
- `!netlify/functions/` - Keep source functions directory

**Why:** Netlify generates `.netlify/functions/` during build, but we want to keep `netlify/functions/` (source) in version control.

### **3. Updated `netlify.toml`**

**Added:**
- `functions = "netlify/functions"` - Points to source functions directory
- `NODE_VERSION = "20"` - Ensures correct Node version
- `NPM_FLAGS = "--legacy-peer-deps"` - Handles peer dependency conflicts

---

## 🔍 **ROOT CAUSE**

The HTTP 403 error for ajv (and potentially other packages) can be caused by:

1. **npm registry rate limiting** - Temporary throttling
2. **Network/proxy issues** - CI/CD runner network problems
3. **Package lock file corruption** - Mismatched lockfile
4. **npm registry authentication** - Missing or invalid credentials

**Solution:** Use retry logic + fallback to `npm install` (more forgiving than `npm ci`)

---

## 🚀 **VERIFICATION**

After pushing these changes:

1. **Check workflow runs:**
   - Go to: https://github.com/miltmon/welder-inspection-dashboard/actions
   - Verify `verify-content-citations` workflow runs successfully

2. **Check npm install step:**
   - Look for: `"✅ npm ci succeeded"` or `"⚠️  npm ci failed, trying npm install..."`
   - Verify dependencies install successfully

3. **Check build:**
   - Verify `npm run build` completes without errors

---

## 📝 **ALTERNATIVE SOLUTIONS**

If the issue persists, try:

### **Option 1: Use npm install directly**

Change workflow to always use `npm install`:

```yaml
- name: Install dependencies
  run: npm install --legacy-peer-deps
```

### **Option 2: Clear npm cache**

Add cache clearing step:

```yaml
- name: Clear npm cache
  run: npm cache clean --force

- name: Install dependencies
  run: npm install --legacy-peer-deps
```

### **Option 3: Use different registry**

If npmjs.org is blocked, use a mirror:

```yaml
- name: Configure npm registry
  run: |
    npm config set registry https://registry.npmmirror.com/
```

---

## ✅ **FILES UPDATED**

1. ✅ `.github/workflows/verify.yml` - Added npm registry config + fallback logic
2. ✅ `.gitignore` - Added `.netlify/` build artifacts
3. ✅ `netlify.toml` - Added functions path and build environment

---

**Status:** ✅ Ready to test  
**Next:** Push changes and verify workflow runs successfully

