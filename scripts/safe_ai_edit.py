# scripts/safe_ai_edit.py - Enhanced Safety Version
import os
import sys
import json
import hashlib
import subprocess
from datetime import datetime
from openai import OpenAI

class SafeAIBot:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.backup_dir = "ai_backups"
        self.safety_log = "ai_safety.json"
        self.max_file_size = 50000  # 50KB limit
        self.critical_files = ["package.json", "CNAME", "README.md"]
        
    def create_backup(self, filepath):
        """Create timestamped backup before any changes"""
        os.makedirs(self.backup_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{filepath.replace('/', '_')}_{timestamp}.backup"
        backup_path = os.path.join(self.backup_dir, backup_name)
        
        try:
            with open(filepath, 'r') as original:
                with open(backup_path, 'w') as backup:
                    content = original.read()
                    backup.write(content)
            
            print(f"🔒 Backup created: {backup_path}")
            return backup_path, content
        except Exception as e:
            print(f"❌ Backup failed: {e}")
            return None, None
    
    def validate_file_safety(self, filepath, content):
        """Pre-flight safety checks"""
        safety_issues = []
        
        # Check file size
        if len(content) > self.max_file_size:
            safety_issues.append(f"File too large: {len(content)} bytes")
        
        # Check for critical files
        if os.path.basename(filepath) in self.critical_files:
            safety_issues.append("Critical system file - extra caution required")
        
        # Check for suspicious patterns
        dangerous_patterns = [
            'rm -rf', 'sudo', 'exec(', 'eval(',
            'document.write', 'innerHTML =', 'localStorage.clear',
            'window.location =', 'fetch(\'http'
        ]
        
        for pattern in dangerous_patterns:
            if pattern in content.lower():
                safety_issues.append(f"Potentially dangerous pattern: {pattern}")
        
        return safety_issues
    
    def syntax_check(self, filepath, content):
        """Check if the generated code has valid syntax"""
        if not filepath.endswith('.js'):
            return True, "Non-JS file, skipping syntax check"
        
        try:
            # Write to temp file and check syntax
            temp_file = f"/tmp/syntax_check_{os.getpid()}.js"
            with open(temp_file, 'w') as f:
                f.write(content)
            
            # Use node to check syntax
            result = subprocess.run(
                ['node', '-c', temp_file], 
                capture_output=True, 
                text=True,
                timeout=10
            )
            
            os.remove(temp_file)
            
            if result.returncode == 0:
                return True, "Syntax valid"
            else:
                return False, f"Syntax error: {result.stderr}"
                
        except subprocess.TimeoutExpired:
            return False, "Syntax check timed out"
        except Exception as e:
            return False, f"Syntax check failed: {e}"
    
    def ai_improve_with_safety(self, filepath, improvement_type="general"):
        """AI improvement with comprehensive safety measures"""
        
        print(f"🛡️ Safe AI Bot: Processing {filepath}")
        
        # Step 1: Create backup
        backup_path, original_content = self.create_backup(filepath)
        if not backup_path:
            return False, "Backup creation failed"
        
        # Step 2: Pre-flight safety validation
        safety_issues = self.validate_file_safety(filepath, original_content)
        if safety_issues:
            print("⚠️ Safety warnings detected:")
            for issue in safety_issues:
                print(f"  - {issue}")
            
            # Continue but log warnings
        
        # Step 3: Generate file hash for change tracking
        original_hash = hashlib.md5(original_content.encode()).hexdigest()
        
        # Step 4: AI Processing with safety prompts
        safety_prompt = f"""
CRITICAL SAFETY INSTRUCTIONS:
1. NEVER remove existing functionality
2. NEVER add external API calls without explicit backend integration comments
3. NEVER modify core authentication logic without preserving security
4. NEVER add code that could cause data loss
5. PRESERVE all existing event listeners and handlers
6. ADD comprehensive error handling for all new code
7. ENSURE backward compatibility with existing HTML structure

MISSION CONTEXT: This is the PMERIT educational platform serving underserved communities. Breaking changes could impact users globally.

IMPROVEMENT TYPE: {improvement_type}

Original Code:
{original_content}

Return improved code that follows ALL safety guidelines above.
"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": safety_prompt}],
                temperature=0.1,  # Lower temperature for more conservative changes
                max_tokens=4000
            )
            
            improved_content = response.choices[0].message.content.strip()
            
            # Remove code fences if present
            if improved_content.startswith("```"):
                lines = improved_content.split('\n')
                improved_content = '\n'.join(lines[1:-1])
            
        except Exception as e:
            return False, f"AI processing failed: {e}"
        
        # Step 5: Post-generation safety checks
        new_safety_issues = self.validate_file_safety(filepath, improved_content)
        if new_safety_issues:
            print("❌ Generated code failed safety checks:")
            for issue in new_safety_issues:
                print(f"  - {issue}")
            return False, "Generated code failed safety validation"
        
        # Step 6: Syntax validation
        syntax_valid, syntax_message = self.syntax_check(filepath, improved_content)
        if not syntax_valid:
            print(f"❌ Generated code has syntax errors: {syntax_message}")
            return False, f"Syntax validation failed: {syntax_message}"
        
        # Step 7: Change impact analysis
        new_hash = hashlib.md5(improved_content.encode()).hexdigest()
        if original_hash == new_hash:
            print("ℹ️ No changes needed - code already optimal")
            return True, "No changes required"
        
        # Calculate change percentage
        change_ratio = len(set(original_content.split()) - set(improved_content.split())) / len(original_content.split())
        if change_ratio > 0.5:  # More than 50% change
            print(f"⚠️ Large change detected: {change_ratio:.1%} of content modified")
            # Could add additional approval step here
        
        # Step 8: Write improved code
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(improved_content)
            
            # Step 9: Log the operation
            self.log_operation(filepath, improvement_type, original_hash, new_hash, backup_path)
            
            print(f"✅ {filepath} successfully improved")
            return True, "Success"
            
        except Exception as e:
            # Restore from backup on failure
            self.restore_from_backup(filepath, backup_path)
            return False, f"Write failed, restored from backup: {e}"
    
    def log_operation(self, filepath, improvement_type, original_hash, new_hash, backup_path):
        """Log all AI operations for audit trail"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "filepath": filepath,
            "improvement_type": improvement_type,
            "original_hash": original_hash,
            "new_hash": new_hash,
            "backup_path": backup_path,
            "ai_model": "gpt-4",
            "safety_checks_passed": True
        }
        
        # Read existing log
        log_data = []
        if os.path.exists(self.safety_log):
            with open(self.safety_log, 'r') as f:
                log_data = json.load(f)
        
        # Append new entry
        log_data.append(log_entry)
        
        # Write updated log
        with open(self.safety_log, 'w') as f:
            json.dump(log_data, f, indent=2)
    
    def restore_from_backup(self, filepath, backup_path):
        """Restore file from backup"""
        try:
            with open(backup_path, 'r') as backup:
                with open(filepath, 'w') as original:
                    original.write(backup.read())
            print(f"🔄 Restored {filepath} from backup")
            return True
        except Exception as e:
            print(f"❌ Restore failed: {e}")
            return False
    
    def rollback_last_change(self, filepath):
        """Emergency rollback function"""
        # Read log to find last change
        if not os.path.exists(self.safety_log):
            print("❌ No safety log found")
            return False
        
        with open(self.safety_log, 'r') as f:
            log_data = json.load(f)
        
        # Find last change for this file
        for entry in reversed(log_data):
            if entry['filepath'] == filepath:
                backup_path = entry['backup_path']
                if os.path.exists(backup_path):
                    return self.restore_from_backup(filepath, backup_path)
        
        print(f"❌ No backup found for {filepath}")
        return False

def main():
    """Main function with safety measures"""
    bot = SafeAIBot()
    
    # Get command line arguments
    improvement_type = sys.argv[1] if len(sys.argv) > 1 else "general"
    
    # Emergency rollback mode
    if improvement_type == "rollback":
        if len(sys.argv) < 3:
            print("Usage: python safe_ai_edit.py rollback <filepath>")
            return
        
        filepath = sys.argv[2]
        success = bot.rollback_last_change(filepath)
        print("✅ Rollback successful" if success else "❌ Rollback failed")
        return
    
    # Files to improve (with safety restrictions)
    safe_files = [
        "js/auth.js",
        "js/main.js", 
        "js/chat.js",
        "js/components.js"
    ]
    
    print(f"🛡️ PMERIT Safe AI Bot Starting - Mode: {improvement_type}")
    print("Safety measures: Backup, Syntax check, Change validation")
    print("=" * 60)
    
    results = {}
    
    for filepath in safe_files:
        if os.path.exists(filepath):
            success, message = bot.ai_improve_with_safety(filepath, improvement_type)
            results[filepath] = "✅ SUCCESS" if success else f"❌ FAILED: {message}"
        else:
            results[filepath] = "⚠️ FILE NOT FOUND"
    
    # Print results summary
    print("\n" + "=" * 60)
    print("🎯 SAFE AI BOT RESULTS:")
    for filepath, status in results.items():
        print(f"  {filepath}: {status}")
    
    print(f"\n📁 Backups stored in: {bot.backup_dir}/")
    print(f"📊 Safety log: {bot.safety_log}")

if __name__ == "__main__":
    main()
