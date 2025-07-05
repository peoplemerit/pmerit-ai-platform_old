#!/bin/bash

# PMERIT Frontend Consistency Checker
# This script checks for common issues preventing GitHub Pages deployment

echo "🔍 PMERIT Frontend Consistency Checker"
echo "======================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ ERROR: index.html not found. Are you in the frontend directory?${NC}"
    echo "Run this script from: ~/gabriel-backend/frontend-local"
    exit 1
fi

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"
echo ""

# 1. Check Git repository status
echo -e "${BLUE}1. 🔧 Git Repository Status${NC}"
echo "================================"
git status --porcelain
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Git repository is accessible${NC}"
else
    echo -e "${RED}❌ Git repository issue${NC}"
fi

# Check if we're on main branch
BRANCH=$(git branch --show-current)
echo "Current branch: $BRANCH"
if [ "$BRANCH" = "main" ]; then
    echo -e "${GREEN}✅ On main branch${NC}"
else
    echo -e "${YELLOW}⚠️  Not on main branch${NC}"
fi
echo ""

# 2. Check essential files exist
echo -e "${BLUE}2. 📁 Essential Files Check${NC}"
echo "================================"
files=("index.html" "CNAME" "assets/css/main.css" "assets/css/chat.css" "assets/css/responsive.css" "assets/js/main.js" "assets/js/api.js" "assets/js/chat.js")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done
echo ""

# 3. Check CNAME file content
echo -e "${BLUE}3. 🌐 CNAME Configuration${NC}"
echo "================================"
if [ -f "CNAME" ]; then
    CNAME_CONTENT=$(cat CNAME)
    echo "CNAME contains: $CNAME_CONTENT"
    if [ "$CNAME_CONTENT" = "pmerit.com" ]; then
        echo -e "${GREEN}✅ CNAME correctly configured${NC}"
    else
        echo -e "${YELLOW}⚠️  CNAME contains unexpected content${NC}"
    fi
else
    echo -e "${RED}❌ CNAME file missing${NC}"
fi
echo ""

# 4. Check index.html for critical elements
echo -e "${BLUE}4. 🏠 Index.html Analysis${NC}"
echo "================================"

# Check for logo without X
if grep -q '✖.*PMERIT\|PMERIT.*✖' index.html; then
    echo -e "${RED}❌ Found ✖ symbol in PMERIT logo${NC}"
else
    echo -e "${GREEN}✅ No ✖ symbol found in logo${NC}"
fi

# Check for proper script tags
if grep -q 'assets/js/api.js' index.html; then
    echo -e "${GREEN}✅ api.js script tag found${NC}"
else
    echo -e "${RED}❌ api.js script tag missing${NC}"
fi

if grep -q 'assets/js/main.js' index.html; then
    echo -e "${GREEN}✅ main.js script tag found${NC}"
else
    echo -e "${RED}❌ main.js script tag missing${NC}"
fi

if grep -q 'assets/js/chat.js' index.html; then
    echo -e "${GREEN}✅ chat.js script tag found${NC}"
else
    echo -e "${RED}❌ chat.js script tag missing${NC}"
fi

# Check for CSS links
if grep -q 'assets/css/main.css' index.html; then
    echo -e "${GREEN}✅ main.css link found${NC}"
else
    echo -e "${RED}❌ main.css link missing${NC}"
fi
echo ""

# 5. Check JavaScript files for common issues
echo -e "${BLUE}5. 📜 JavaScript Files Analysis${NC}"
echo "================================"

# Check api.js for Gabriel AI configuration
if [ -f "assets/js/api.js" ]; then
    if grep -q 'gabriel-ai-backend.peoplemerit.workers.dev' assets/js/api.js; then
        echo -e "${GREEN}✅ Gabriel AI backend URL found in api.js${NC}"
    else
        echo -e "${RED}❌ Gabriel AI backend URL missing in api.js${NC}"
    fi
    
    if grep -q 'API_CONFIG' assets/js/api.js; then
        echo -e "${GREEN}✅ API_CONFIG found in api.js${NC}"
    else
        echo -e "${RED}❌ API_CONFIG missing in api.js${NC}"
    fi
else
    echo -e "${RED}❌ api.js file missing${NC}"
fi

# Check main.js for essential functions
if [ -f "assets/js/main.js" ]; then
    if grep -q 'updateConnectionStatus' assets/js/main.js; then
        echo -e "${GREEN}✅ updateConnectionStatus function found${NC}"
    else
        echo -e "${RED}❌ updateConnectionStatus function missing${NC}"
    fi
    
    if grep -q 'addMessageToChat' assets/js/main.js; then
        echo -e "${GREEN}✅ addMessageToChat function found${NC}"
    else
        echo -e "${RED}❌ addMessageToChat function missing${NC}"
    fi
else
    echo -e "${RED}❌ main.js file missing${NC}"
fi

# Check chat.js
if [ -f "assets/js/chat.js" ]; then
    echo -e "${GREEN}✅ chat.js exists${NC}"
    if grep -q 'ChatSystem' assets/js/chat.js; then
        echo -e "${GREEN}✅ ChatSystem object found${NC}"
    else
        echo -e "${YELLOW}⚠️  ChatSystem object not found${NC}"
    fi
else
    echo -e "${RED}❌ chat.js missing${NC}"
fi
echo ""

# 6. Check for syntax errors in JavaScript files
echo -e "${BLUE}6. 🔧 JavaScript Syntax Check${NC}"
echo "================================"
for js_file in assets/js/*.js; do
    if [ -f "$js_file" ]; then
        # Basic syntax check using node if available
        if command -v node >/dev/null 2>&1; then
            node -c "$js_file" 2>/dev/null
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ $js_file syntax OK${NC}"
            else
                echo -e "${RED}❌ $js_file has syntax errors${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  Node.js not available for syntax checking${NC}"
            break
        fi
    fi
done
echo ""

# 7. Check git remote configuration
echo -e "${BLUE}7. 🔗 Git Remote Configuration${NC}"
echo "================================"
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
echo "Remote URL: $REMOTE_URL"

if [[ "$REMOTE_URL" == *"peoplemerit/github.io"* ]]; then
    echo -e "${GREEN}✅ Correct repository URL${NC}"
else
    echo -e "${YELLOW}⚠️  Check repository URL${NC}"
fi

# Check if there are unpushed commits
UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null | wc -l)
if [ "$UNPUSHED" -eq 0 ]; then
    echo -e "${GREEN}✅ All commits pushed to remote${NC}"
else
    echo -e "${YELLOW}⚠️  $UNPUSHED unpushed commits${NC}"
fi
echo ""

# 8. File size checks
echo -e "${BLUE}8. 📏 File Size Analysis${NC}"
echo "================================"
TOTAL_SIZE=$(du -sh . | cut -f1)
echo "Total directory size: $TOTAL_SIZE"

# Check for overly large files
find . -name "*.js" -o -name "*.css" -o -name "*.html" | while read file; do
    size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
    if [ "$size" -gt 1048576 ]; then  # 1MB
        echo -e "${YELLOW}⚠️  Large file: $file ($size bytes)${NC}"
    fi
done
echo ""

# 9. Check for common problematic patterns
echo -e "${BLUE}9. 🚨 Common Issues Check${NC}"
echo "================================"

# Check for localhost references
if grep -r "localhost" . --exclude-dir=.git >/dev/null 2>&1; then
    echo -e "${RED}❌ Found localhost references (should use production URLs)${NC}"
    grep -r "localhost" . --exclude-dir=.git | head -3
else
    echo -e "${GREEN}✅ No localhost references found${NC}"
fi

# Check for console.log statements (optional cleanup)
LOG_COUNT=$(grep -r "console\.log" assets/ 2>/dev/null | wc -l)
if [ "$LOG_COUNT" -gt 10 ]; then
    echo -e "${YELLOW}⚠️  Many console.log statements found ($LOG_COUNT) - consider cleanup for production${NC}"
else
    echo -e "${GREEN}✅ Reasonable number of console.log statements${NC}"
fi

# Check for TODO/FIXME comments
TODO_COUNT=$(grep -r "TODO\|FIXME" . --exclude-dir=.git 2>/dev/null | wc -l)
if [ "$TODO_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $TODO_COUNT TODO/FIXME comments found${NC}"
else
    echo -e "${GREEN}✅ No TODO/FIXME comments${NC}"
fi
echo ""

# 10. Summary and recommendations
echo -e "${BLUE}10. 📋 Summary & Recommendations${NC}"
echo "================================"

# Count issues
ERRORS=$(grep -c "❌" /tmp/check_output 2>/dev/null || echo "0")
WARNINGS=$(grep -c "⚠️" /tmp/check_output 2>/dev/null || echo "0")

echo "Summary:"
echo "- Critical errors: Check output above for ❌ items"
echo "- Warnings: Check output above for ⚠️ items"
echo ""

echo "Next steps:"
echo "1. Fix any ❌ critical errors first"
echo "2. Address ⚠️ warnings if needed"
echo "3. Test deployment with: git add . && git commit -m 'Fix issues' && git push origin main"
echo "4. Check GitHub Pages deployment status"
echo ""

echo -e "${GREEN}🎯 Frontend consistency check complete!${NC}"
