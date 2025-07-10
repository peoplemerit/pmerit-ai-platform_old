#!/bin/bash
# scripts/ai_emergency.sh - Emergency AI Bot Controls

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}🚨 PMERIT AI BOT EMERGENCY CONTROLS${NC}"
echo "=============================================="

# Function to rollback all AI changes
rollback_all() {
    echo -e "${YELLOW}🔄 Rolling back ALL AI changes...${NC}"
    
    if [ ! -f "ai_safety.json" ]; then
        echo -e "${RED}❌ No AI safety log found${NC}"
        exit 1
    fi
    
    # Get list of all modified files from log
    python3 -c "
import json
with open('ai_safety.json', 'r') as f:
    log = json.load(f)
    
files = set()
for entry in log:
    files.add(entry['filepath'])
    
for filepath in files:
    print(filepath)
" > /tmp/ai_modified_files.txt
    
    # Rollback each file
    while IFS= read -r filepath; do
        echo "Rolling back: $filepath"
        python3 scripts/safe_ai_edit.py rollback "$filepath"
    done < /tmp/ai_modified_files.txt
    
    rm /tmp/ai_modified_files.txt
    echo -e "${GREEN}✅ All AI changes rolled back${NC}"
}

# Function to disable AI bot
disable_bot() {
    echo -e "${YELLOW}🔒 Disabling AI Bot...${NC}"
    
    # Rename workflow to disable it
    if [ -f ".github/workflows/ai-edit.yml" ]; then
        mv ".github/workflows/ai-edit.yml" ".github/workflows/ai-edit.yml.disabled"
        echo -e "${GREEN}✅ AI workflow disabled${NC}"
    fi
    
    # Create disable flag
    echo "$(date): AI Bot disabled by emergency control" > .ai_bot_disabled
    echo -e "${GREEN}✅ AI Bot disable flag created${NC}"
}

# Function to enable AI bot
enable_bot() {
    echo -e "${YELLOW}🔓 Enabling AI Bot...${NC}"
    
    # Restore workflow
    if [ -f ".github/workflows/ai-edit.yml.disabled" ]; then
        mv ".github/workflows/ai-edit.yml.disabled" ".github/workflows/ai-edit.yml"
        echo -e "${GREEN}✅ AI workflow enabled${NC}"
    fi
    
    # Remove disable flag
    if [ -f ".ai_bot_disabled" ]; then
        rm ".ai_bot_disabled"
        echo -e "${GREEN}✅ AI Bot disable flag removed${NC}"
    fi
}

# Function to show AI activity log
show_log() {
    echo -e "${YELLOW}📊 AI Bot Activity Log:${NC}"
    
    if [ ! -f "ai_safety.json" ]; then
        echo -e "${RED}❌ No AI safety log found${NC}"
        return
    fi
    
    python3 -c "
import json
from datetime import datetime

with open('ai_safety.json', 'r') as f:
    log = json.load(f)

print(f'Total AI operations: {len(log)}')
print('-' * 50)

for entry in log[-10:]:  # Show last 10 operations
    timestamp = entry['timestamp']
    filepath = entry['filepath']
    improvement_type = entry['improvement_type']
    print(f'{timestamp}: {filepath} ({improvement_type})')
"
}

# Function to check AI bot status
check_status() {
    echo -e "${YELLOW}🔍 AI Bot Status Check:${NC}"
    
    # Check if disabled
    if [ -f ".ai_bot_disabled" ]; then
        echo -e "${RED}❌ AI Bot is DISABLED${NC}"
        cat .ai_bot_disabled
    else
        echo -e "${GREEN}✅ AI Bot is ENABLED${NC}"
    fi
    
    # Check workflow file
    if [ -f ".github/workflows/ai-edit.yml" ]; then
        echo -e "${GREEN}✅ AI workflow file exists${NC}"
    else
        echo -e "${RED}❌ AI workflow file missing${NC}"
    fi
    
    # Check for backups
    if [ -d "ai_backups" ]; then
        backup_count=$(ls ai_backups/ | wc -l)
        echo -e "${GREEN}✅ ${backup_count} backup files available${NC}"
    else
        echo -e "${YELLOW}⚠️ No backup directory found${NC}"
    fi
}

# Function to create manual backup
create_backup() {
    echo -e "${YELLOW}💾 Creating manual backup...${NC}"
    
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_dir="manual_backup_$timestamp"
    
    mkdir -p "$backup_dir"
    
    # Backup critical files
    cp -r js/ "$backup_dir/" 2>/dev/null || true
    cp -r css/ "$backup_dir/" 2>/dev/null || true
    cp index.html "$backup_dir/" 2>/dev/null || true
    cp package.json "$backup_dir/" 2>/dev/null || true
    
    echo -e "${GREEN}✅ Manual backup created: $backup_dir${NC}"
}

# Main menu
case "${1:-menu}" in
    "rollback")
        rollback_all
        ;;
    "disable")
        disable_bot
        ;;
    "enable")
        enable_bot
        ;;
    "log")
        show_log
        ;;
    "status")
        check_status
        ;;
    "backup")
        create_backup
        ;;
    "menu"|*)
        echo "Choose an emergency action:"
        echo ""
        echo "1. rollback  - Rollback ALL AI changes"
        echo "2. disable   - Disable AI Bot completely"
        echo "3. enable    - Re-enable AI Bot"
        echo "4. log       - Show AI activity log"
        echo "5. status    - Check AI Bot status"
        echo "6. backup    - Create manual backup"
        echo ""
        echo "Usage: ./scripts/ai_emergency.sh [action]"
        echo "Example: ./scripts/ai_emergency.sh rollback"
        ;;
esac
