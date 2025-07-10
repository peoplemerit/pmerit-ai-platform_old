#!/bin/bash
BACKUP_DIR="emergency_backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
  --exclude=emergency_backups \
  --exclude=.git \
  .
echo "✅ Backup created: backup_$TIMESTAMP.tar.gz"
