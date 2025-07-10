#!/bin/bash
echo "🛡️ PRODUCTION-GRADE SAFETY SYSTEM"
echo "Creating safety measures for frontend directory..."

# Create safety directories
mkdir -p scripts emergency_backups .github/workflows

# Create backup script
cat > scripts/auto_backup.sh << 'BACKUP_EOF'
#!/bin/bash
BACKUP_DIR="emergency_backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
  --exclude=emergency_backups \
  --exclude=.git \
  .
echo "✅ Backup created: backup_$TIMESTAMP.tar.gz"
BACKUP_EOF

chmod +x scripts/auto_backup.sh
echo "✅ Safety system deployed in frontend-local directory!"
