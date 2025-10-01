# 🔄 Thulobazaar Backup System

## 🎯 Overview
Automated daily backup system that backs up both code and database, then pushes to GitHub.

## 📁 Files Created
- `backup_script.sh` - Main backup script
- `backup.log` - Backup execution logs
- `backups/` - Local compressed archives directory
- `backend/thulobazaar_backup.sql` - Latest database backup
- `backend/thulobazaar_backup_YYYY-MM-DD_HH-MM-SS.sql` - Timestamped backups

## ⏰ Schedule
**Daily at 2:00 AM** - Automatic backup via cron job

## 🎯 What Gets Backed Up
✅ **Database** - Complete PostgreSQL dump with all data
✅ **Code** - All source files (frontend + backend)
✅ **Configuration** - .env files, package.json, etc.
✅ **Assets** - Static files and images
✅ **Git History** - Committed to GitHub repository

## 🚀 Manual Backup
To run a backup manually:
```bash
cd /Users/elw/Documents/Web/thulobazaar
./backup_script.sh
```

## 📋 Cron Job Management

### View current cron jobs:
```bash
crontab -l
```

### Edit cron jobs:
```bash
crontab -e
```

### Remove all cron jobs:
```bash
crontab -r
```

## 🕐 Schedule Options
Current: `0 2 * * *` (Every day at 2:00 AM)

Other useful schedules:
- `0 1 * * *` - Daily at 1:00 AM
- `0 3 * * *` - Daily at 3:00 AM
- `0 2 * * 0` - Weekly on Sunday at 2:00 AM
- `0 2 1 * *` - Monthly on 1st at 2:00 AM
- `0 */6 * * *` - Every 6 hours
- `0 2 * * 1-5` - Weekdays only at 2:00 AM

## 📊 Monitoring Backups

### View backup logs:
```bash
tail -f /Users/elw/Documents/Web/thulobazaar/backup.log
```

### Check last 10 backups:
```bash
ls -la /Users/elw/Documents/Web/thulobazaar/backend/thulobazaar_backup_*.sql | head -10
```

### Check backup archives:
```bash
ls -la /Users/elw/Documents/Web/thulobazaar/backups/
```

### Check GitHub commits:
```bash
cd /Users/elw/Documents/Web/thulobazaar
git log --oneline -10
```

## 🔧 Backup Script Features
- 🎯 **Smart**: Only commits if there are changes
- 🧹 **Clean**: Removes old backups automatically (7 days for SQL, 14 days for archives)
- 📊 **Detailed**: Colorful logs with timestamps
- 🔒 **Safe**: Error handling and validation
- 📦 **Complete**: Creates both SQL dumps and compressed archives

## 🆘 Troubleshooting

### If backup fails:
1. Check permissions: `ls -la backup_script.sh`
2. Check database connection: `psql -h localhost -U elw -d thulobazaar -c "SELECT 1;"`
3. Check git status: `cd /Users/elw/Documents/Web/thulobazaar && git status`
4. Check GitHub access: `git push origin main`

### Common issues:
- **Git push fails**: Check internet connection and GitHub credentials
- **Database backup fails**: Ensure PostgreSQL is running
- **Permission denied**: Run `chmod +x backup_script.sh`

## 🔄 Restore Database
To restore from backup:
```bash
# Stop your application first
# Then restore:
psql -h localhost -U elw -d thulobazaar < backend/thulobazaar_backup.sql
```

## 📈 Benefits
✅ **Never lose data** - Daily automated backups
✅ **Version controlled** - All changes tracked in Git
✅ **Cloud storage** - Backed up to GitHub
✅ **Multiple formats** - SQL dumps + compressed archives
✅ **Automatic cleanup** - Old backups removed automatically
✅ **Easy monitoring** - Detailed logs and status reports

---

**🎉 Your Thulobazaar project is now fully protected with automated daily backups!**

Last updated: $(date)