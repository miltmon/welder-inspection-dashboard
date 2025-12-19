#!/bin/bash
# CODEX Serverless Function Smoke Test
# Tests the CODEX query endpoint and validates response format

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROD_URL="${1:-https://weldtrack-inspector.netlify.app}"
ENDPOINT="${PROD_URL}/.netlify/functions/codex-query"
TEST_QUERY="${2:-preheat clause 6.5}"

echo "=========================================="
echo "CODEX Serverless Function Smoke Test"
echo "=========================================="
echo ""
echo "Endpoint: ${ENDPOINT}"
echo "Query: ${TEST_QUERY}"
echo ""

# Test 1: Basic connectivity
echo -e "${YELLOW}Test 1: Basic connectivity${NC}"
HTTP_CODE=$(curl -s -o /tmp/codex_response.json -w "%{http_code}" \
  -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d "{\"q\":\"${TEST_QUERY}\"}")

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✓ HTTP 200 OK${NC}"
else
  echo -e "${RED}✗ HTTP ${HTTP_CODE}${NC}"
  echo "Response:"
  cat /tmp/codex_response.json
  exit 1
fi

# Test 2: JSON response format
echo ""
echo -e "${YELLOW}Test 2: JSON response format${NC}"
if command -v jq &> /dev/null; then
  if jq empty /tmp/codex_response.json 2>/dev/null; then
    echo -e "${GREEN}✓ Valid JSON${NC}"
  else
    echo -e "${RED}✗ Invalid JSON${NC}"
    cat /tmp/codex_response.json
    exit 1
  fi
else
  echo -e "${YELLOW}⚠ jq not installed, skipping JSON validation${NC}"
fi

# Test 3: Required metadata fields
echo ""
echo -e "${YELLOW}Test 3: Required metadata fields${NC}"
if command -v jq &> /dev/null; then
  HAS_NLM_ID=$(jq -r '.results[0].metadata.NLM_ID // empty' /tmp/codex_response.json)
  HAS_CODE_REF=$(jq -r '.results[0].metadata.Code_Reference_Primary // empty' /tmp/codex_response.json)
  
  if [ -n "$HAS_NLM_ID" ]; then
    echo -e "${GREEN}✓ NLM_ID present: ${HAS_NLM_ID}${NC}"
  else
    echo -e "${RED}✗ NLM_ID missing${NC}"
  fi
  
  if [ -n "$HAS_CODE_REF" ]; then
    echo -e "${GREEN}✓ Code_Reference_Primary present: ${HAS_CODE_REF}${NC}"
  else
    echo -e "${RED}✗ Code_Reference_Primary missing${NC}"
  fi
else
  echo -e "${YELLOW}⚠ jq not installed, skipping metadata validation${NC}"
fi

# Test 4: Response structure
echo ""
echo -e "${YELLOW}Test 4: Response structure${NC}"
if command -v jq &> /dev/null; then
  HAS_RESULTS=$(jq -r '.results | length' /tmp/codex_response.json)
  HAS_QUERY=$(jq -r '.query // empty' /tmp/codex_response.json)
  
  if [ "$HAS_RESULTS" -gt 0 ]; then
    echo -e "${GREEN}✓ Results array present (${HAS_RESULTS} results)${NC}"
  else
    echo -e "${RED}✗ No results returned${NC}"
  fi
  
  if [ -n "$HAS_QUERY" ]; then
    echo -e "${GREEN}✓ Query field present${NC}"
  else
    echo -e "${YELLOW}⚠ Query field missing (non-critical)${NC}"
  fi
fi

# Display full response
echo ""
echo "=========================================="
echo "Full Response:"
echo "=========================================="
if command -v jq &> /dev/null; then
  jq . /tmp/codex_response.json
else
  cat /tmp/codex_response.json
fi

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo "✓ All tests completed"
echo ""
echo "If you see errors above, check:"
echo "1. Environment variables set in Netlify (VITE_CLAUSEBOT_KEY, VITE_CLAUSEBOT_ENDPOINT)"
echo "2. Serverless function deployed correctly"
echo "3. Function logs in Netlify dashboard"
echo ""


