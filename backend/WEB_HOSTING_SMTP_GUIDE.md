# Using Your Web Hosting SMTP for Email Notifications

This guide shows you how to find and configure SMTP settings from your web hosting provider.

---

## 📋 Benefits of Using Your Own Hosting

✅ **Unlimited emails** (usually no daily limits)
✅ **Free** (included with hosting)
✅ **Better deliverability** (emails from your domain)
✅ **Professional** (uses your domain name)
✅ **No third-party setup** required

---

## 🔍 Finding Your SMTP Settings

### Method 1: cPanel (Most Common)

If your hosting uses cPanel:

1. **Log into cPanel**
   - Usually at: `yourdomain.com/cpanel` or `yourdomain.com:2083`

2. **Create Email Account**
   - Go to: **Email Accounts** section
   - Click **Create**
   - Email: `noreply@yourdomain.com`
   - Password: Create strong password
   - Click **Create**

3. **Get SMTP Settings**
   - Find your email in the list
   - Click **Connect Devices**
   - Look for **Mail Client Manual Settings**

   You'll see something like:
   ```
   Incoming Server (IMAP): mail.yourdomain.com
   Outgoing Server (SMTP): mail.yourdomain.com
   Username: noreply@yourdomain.com
   Port: 465 (SSL) or 587 (TLS)
   ```

4. **Update .env**
   ```env
   SMTP_HOST=mail.yourdomain.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=noreply@yourdomain.com
   SMTP_PASSWORD=your_password_here
   EMAIL_FROM="ThuLoBazaar <noreply@yourdomain.com>"
   ```

---

### Method 2: Plesk Control Panel

1. **Log into Plesk**
   - Usually at: `yourdomain.com:8443`

2. **Create Email**
   - Mail → Email Addresses
   - Click **Create Email Address**
   - Email: `noreply@yourdomain.com`
   - Set password

3. **SMTP Settings**
   ```
   SMTP Host: smtp.yourdomain.com (or mail.yourdomain.com)
   Port: 465 (SSL) or 587 (TLS)
   Username: noreply@yourdomain.com
   ```

---

### Method 3: Contact Your Hosting Support

If you can't find the settings, contact your hosting provider and ask:

> "Hi, I need the SMTP server settings to send emails from my application.
> What are the SMTP host, port, and authentication details for my domain?"

They'll usually reply with something like:
```
SMTP Server: mail.yourdomain.com
SMTP Port: 465 (SSL) or 587 (TLS/STARTTLS)
Username: your-email@yourdomain.com
Authentication: Required
```

---

## 🏢 Common Hosting Providers

### Bluehost
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_password
```

### HostGator
```env
SMTP_HOST=gator4xxx.hostgator.com  # Check your cPanel
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_password
```

### GoDaddy
```env
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_password
```

### SiteGround
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_password
```

### Namecheap
```env
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_password
```

---

## 🔧 Port Options Explained

Your hosting provider usually supports multiple ports:

| Port | Type | SMTP_SECURE | Use Case |
|------|------|-------------|----------|
| **465** | SSL | `true` | Recommended - Most secure |
| **587** | TLS/STARTTLS | `false` | Alternative - Widely supported |
| 25 | Plain | `false` | Avoid - Often blocked |

**Recommendation:** Use **port 465 with SSL** for best security.

---

## 📝 Complete .env Configuration

Replace these values with your actual hosting details:

```env
# Email Configuration - Web Hosting SMTP
EMAIL_SERVICE=smtp

# Your hosting SMTP settings
SMTP_HOST=mail.yourdomain.com          # Replace with your domain
SMTP_PORT=465                           # 465 (SSL) or 587 (TLS)
SMTP_SECURE=true                        # true for 465, false for 587
SMTP_USER=noreply@yourdomain.com       # Your email address
SMTP_PASSWORD=your_email_password      # Email account password

# Sender information
EMAIL_FROM="ThuLoBazaar <noreply@yourdomain.com>"

# Your production domain
FRONTEND_URL=https://yourdomain.com
```

---

## ✅ Setup Checklist

- [ ] Email account created in hosting control panel
- [ ] Strong password set for email
- [ ] SMTP host found (usually `mail.yourdomain.com`)
- [ ] Port identified (465 or 587)
- [ ] `.env` file updated with real values
- [ ] Backend server restarted
- [ ] Test email sent successfully

---

## 🧪 Testing Your Configuration

### Step 1: Test SMTP Connection

Create a test file:

```javascript
// /backend/test-email.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function testEmail() {
  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'your-personal-email@gmail.com', // Replace with your email
      subject: 'ThuLoBazaar Email Test',
      text: 'If you receive this, your SMTP is working correctly!',
      html: '<h1>Success!</h1><p>Your ThuLoBazaar email system is working.</p>',
    });

    console.log('✅ Test email sent!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEmail();
```

Run the test:
```bash
cd /Users/elw/Documents/Web/thulobazaar/backend
node test-email.js
```

### Step 2: Test Through Application

1. Go to user management page
2. Suspend a test user
3. Check if email is received

---

## 🚨 Troubleshooting

### Error: "Connection timeout"
**Cause:** SMTP host or port is wrong
**Fix:**
- Double-check SMTP host in cPanel
- Try port 587 instead of 465
- Contact hosting support

### Error: "Authentication failed"
**Cause:** Wrong username or password
**Fix:**
- Username must be full email: `noreply@yourdomain.com`
- Reset password in hosting control panel
- Check for typos in .env file

### Error: "Certificate error" / "SSL error"
**Cause:** Wrong SMTP_SECURE setting
**Fix:**
```env
# For port 465
SMTP_SECURE=true

# For port 587
SMTP_SECURE=false
```

### Error: "Sender address rejected"
**Cause:** EMAIL_FROM doesn't match authenticated email
**Fix:**
```env
# SMTP_USER and EMAIL_FROM must match
SMTP_USER=noreply@yourdomain.com
EMAIL_FROM="ThuLoBazaar <noreply@yourdomain.com>"
```

### Emails going to spam
**Causes:**
- No SPF/DKIM records
- New domain (low reputation)
- Shared hosting IP issues

**Fixes:**
1. Add SPF record in DNS:
   ```
   v=spf1 mx a ~all
   ```

2. Enable DKIM in cPanel (Email Deliverability section)

3. Send emails consistently (builds reputation)

4. Ask recipients to mark as "Not Spam"

---

## 🔒 Security Best Practices

### 1. Use Strong Password
```bash
# Generate strong password
openssl rand -base64 24
```

### 2. Limit Email Access
- Only create email for sending (noreply@)
- Don't use admin email accounts
- Disable IMAP/POP3 if not needed

### 3. Monitor Sending
- Check email logs in cPanel
- Watch for unusual activity
- Set up email quotas if available

### 4. Protect .env File
```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore
chmod 600 .env  # Only owner can read/write
```

---

## 📊 Email Limits

Most hosting providers don't have daily limits, but they do have:

- **Hourly limits:** ~100-500 emails/hour
- **Total limits:** Usually unlimited for legitimate use
- **Rate limiting:** To prevent spam

**If you hit limits:**
- Spread sending over time
- Implement email queue (Redis/Bull)
- Consider dedicated email service for high volume

---

## 💡 Pro Tips

### 1. Create Multiple Email Accounts
```
noreply@yourdomain.com    - Automated emails
support@yourdomain.com    - Customer support replies
alerts@yourdomain.com     - System alerts
```

### 2. Set Up Email Forwarding
Forward `noreply@` to your main inbox to monitor bounces

### 3. Use Email Aliases
Create aliases in cPanel to send from multiple addresses with one account

### 4. Enable Email Logs
Most hosting panels have email tracking - enable it to monitor delivery

---

## 🎯 Recommended Email Addresses

For a marketplace like ThuLoBazaar:

- `noreply@thulobazaar.com` - System notifications (suspensions, etc.)
- `support@thulobazaar.com` - Customer support
- `verify@thulobazaar.com` - Email verifications
- `admin@thulobazaar.com` - Admin notifications
- `security@thulobazaar.com` - Security alerts

---

## 📞 Getting Help from Hosting Provider

If stuck, contact your hosting support with this message:

> Subject: SMTP Configuration for Application Email Sending
>
> Hi,
>
> I'm building an application that needs to send automated emails (user notifications, account alerts, etc.) from my domain thulobazaar.com.
>
> Could you please provide:
> 1. SMTP server hostname
> 2. SMTP port (preferably SSL/TLS)
> 3. Authentication method required
> 4. Any SPF/DKIM setup needed
> 5. Daily/hourly sending limits
>
> The emails will be sent from: noreply@thulobazaar.com
>
> Thank you!

---

## ✨ Next Steps

1. ✅ Create email account in your hosting
2. ✅ Get SMTP settings from cPanel/Plesk
3. ✅ Update `.env` with real values
4. ✅ Test connection with test-email.js
5. ✅ Restart backend server
6. ✅ Send test suspension email
7. ✅ Configure SPF/DKIM for better deliverability
8. ✅ Monitor first emails for spam placement

---

**Need Help?** Check your hosting provider's documentation or contact their support. Most hosting companies have excellent email setup guides!
