# Email Notification Setup Guide

This guide will help you configure email notifications for user suspensions/unsuspensions in ThuLoBazaar.

## 📋 Overview

When you suspend or unsuspend a user through the Editor Dashboard, the system automatically sends them a professional email notification containing:

**Suspension Email:**
- Reason for suspension
- Duration (or "permanent")
- What restrictions apply
- How to appeal
- Contact information

**Unsuspension Email:**
- Welcome back message
- Restored features
- Login link
- Community guidelines reminder

---

## 🚀 Production Setup (Recommended: SendGrid)

### Why SendGrid?
- ✅ Free tier: 100 emails/day (enough for most startups)
- ✅ Excellent deliverability
- ✅ Easy setup
- ✅ No credit card required for free tier

### Step-by-Step Setup

#### 1. Create SendGrid Account
```
1. Visit: https://signup.sendgrid.com/
2. Sign up with your email
3. Verify your email address
4. Complete the onboarding (skip integrations for now)
```

#### 2. Create API Key
```
1. Dashboard → Settings → API Keys
2. Click "Create API Key"
3. Name: "ThuLoBazaar Production"
4. Permissions: Choose "Restricted Access"
   - Enable: "Mail Send" (Full Access)
5. Click "Create & View"
6. COPY THE KEY NOW (you can't see it again!)
```

#### 3. Verify Sender Identity
```
1. Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Fill in:
   - From Name: ThuLoBazaar
   - From Email: noreply@yourdomain.com
   - Reply To: support@yourdomain.com
   - Company: ThuLoBazaar
   - Address: Your business address
4. Click verification link in your email inbox
```

**Important:** Use your actual domain email. If you don't have a domain yet, you can use your personal email for testing.

#### 4. Update .env File
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_actual_api_key_here
EMAIL_FROM="ThuLoBazaar <noreply@yourdomain.com>"
FRONTEND_URL=https://yourdomain.com
```

#### 5. Restart Backend Server
```bash
cd /Users/elw/Documents/Web/thulobazaar/backend
npm run dev
```

---

## 🧪 Testing Setup (Gmail)

For quick testing during development, you can use Gmail:

### Step 1: Enable App Passwords
```
1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" if not already enabled
3. Go to: https://myaccount.google.com/apppasswords
4. Select:
   - App: Mail
   - Device: Other (name it "ThuLoBazaar")
5. Click "Generate"
6. Copy the 16-character password (no spaces)
```

### Step 2: Update .env
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # 16-character app password
EMAIL_FROM="ThuLoBazaar <your.email@gmail.com>"
FRONTEND_URL=http://localhost:3333
```

**Note:** Gmail has sending limits (500 emails/day). Only use for testing!

---

## 🔧 Alternative SMTP Providers

### Amazon SES (Best for Scale)
```env
EMAIL_SERVICE=smtp
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_aws_access_key_id
SMTP_PASSWORD=your_aws_secret_access_key
```

**Cost:** $0.10 per 1,000 emails (very cheap!)
**Setup:** Requires AWS account and domain verification

### Mailgun
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASSWORD=your_mailgun_smtp_password
```

**Free tier:** 5,000 emails/month
**Website:** https://www.mailgun.com/

### SMTP2GO
```env
EMAIL_SERVICE=smtp
SMTP_HOST=mail.smtp2go.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp2go_username
SMTP_PASSWORD=your_smtp2go_password
```

**Free tier:** 1,000 emails/month
**Website:** https://www.smtp2go.com/

---

## 🧪 Testing Email Notifications

### 1. Development Mode (Console Logging)
Leave `EMAIL_SERVICE` empty to test without sending real emails:

```env
EMAIL_SERVICE=
```

When you suspend a user, check your backend terminal:
```
=== EMAIL WOULD BE SENT ===
To: user@example.com
Subject: Account Suspension Notification - ThuLoBazaar
Preview: [full HTML email content]
===========================
```

### 2. Test Suspension Flow
1. Go to: http://localhost:3333/en/editor/user-management
2. Find a test user
3. Click "Suspend"
4. Enter reason: "Testing email notifications"
5. Set duration: 7 days
6. Click "Suspend User"
7. Check:
   - Backend console (development mode)
   - User's email inbox (production mode)

### 3. Test Unsuspension Flow
1. Find the suspended user
2. Click "Unsuspend"
3. Confirm
4. Check email inbox for "Account Restored" email

---

## 🛠️ Troubleshooting

### Emails Not Sending

**1. Check SMTP Credentials**
```bash
# Test connection manually
node -e "
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: 'YOUR_API_KEY'
  }
});
transport.verify((err, success) => {
  if (err) console.error('❌ Error:', err);
  else console.log('✅ Server is ready to send emails');
});
"
```

**2. Check Backend Logs**
```bash
tail -f /tmp/backend.log
```

Look for:
- "Failed to send suspension email"
- SMTP authentication errors
- Network connection errors

**3. Verify Sender Email**
Make sure `EMAIL_FROM` matches your verified sender in SendGrid

**4. Check Spam Folder**
First emails often go to spam. Mark as "Not Spam" to train filters.

### Common Errors

**Error: Invalid login credentials**
- Double-check API key in .env
- Make sure no extra spaces
- Verify SMTP_USER is set to "apikey" (literally)

**Error: Unverified sender**
- Complete sender verification in SendGrid
- Wait 5-10 minutes after verification

**Error: Daily sending limit exceeded**
- You've hit SendGrid's 100/day limit
- Upgrade plan or wait 24 hours

---

## 📊 Monitoring Email Delivery

### SendGrid Dashboard
1. Login to SendGrid
2. Go to Activity Feed
3. Filter by:
   - Date range
   - Email address
   - Status (Delivered, Bounced, Spam)

### Check Delivery Status
```sql
-- Add email logs to database (future enhancement)
SELECT * FROM email_logs
WHERE user_id = 123
ORDER BY created_at DESC;
```

---

## 🔒 Security Best Practices

1. **Never commit .env to git**
   ```bash
   # .env is already in .gitignore
   ```

2. **Use environment variables in production**
   ```bash
   # On server
   export SMTP_PASSWORD="your_key"
   ```

3. **Rotate API keys regularly**
   - Every 90 days
   - After team member leaves
   - If key is exposed

4. **Use restricted access API keys**
   - Only grant "Mail Send" permission
   - Never use full access keys

5. **Monitor sending patterns**
   - Set up alerts for unusual activity
   - Watch for sudden spikes

---

## 📈 Scaling Considerations

### Current Limits
- **SendGrid Free:** 100 emails/day
- **Gmail:** 500 emails/day

### When to Upgrade
- **100+ users/day suspended:** Upgrade SendGrid ($14.95/month = 40k emails)
- **1000+ users/day:** Consider Amazon SES ($0.10/1000 emails)

### Email Queue (Future Enhancement)
For high volume, consider adding:
```javascript
// Using Bull queue with Redis
const emailQueue = new Bull('email-notifications');
emailQueue.add({ userId, type: 'suspension' });
```

---

## 📝 Email Templates

Email templates are located in:
```
/backend/services/emailService.js
```

### Customization
To customize email design:
1. Edit HTML templates in `sendSuspensionEmail()` or `sendUnsuspensionEmail()`
2. Update styling in `<style>` tag
3. Modify text content
4. Test thoroughly!

### Template Variables
Available variables:
- `${full_name}` - User's full name
- `${reason}` - Suspension reason
- `${suspendedUntil}` - End date (if temporary)
- `${isPermanent}` - Boolean flag

---

## ✅ Production Checklist

Before going live:

- [ ] SendGrid account created
- [ ] API key generated and saved securely
- [ ] Sender email verified
- [ ] .env updated with production values
- [ ] Test suspension email received successfully
- [ ] Test unsuspension email received successfully
- [ ] Emails not going to spam
- [ ] `FRONTEND_URL` points to production domain
- [ ] Backend server restarted with new config
- [ ] Monitoring/alerts set up in SendGrid

---

## 🆘 Support

If you need help:
1. Check SendGrid documentation: https://docs.sendgrid.com/
2. Review backend logs: `tail -f /tmp/backend.log`
3. Test SMTP connection manually (see Troubleshooting section)
4. Contact SendGrid support (free tier has limited support)

---

**Last Updated:** $(date '+%Y-%m-%d')
**Version:** 1.0.0
