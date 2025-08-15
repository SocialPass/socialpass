# 🚀 **MINIMAL Railway Demo Setup** for SocialPass

**Get SocialPass running in under 5 minutes with just 4 environment variables!**

## 🎯 **Quick Demo Deployment**

### 1. Create Railway Project
1. Visit [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Choose your SocialPass repository
4. Railway will automatically detect Django

### 2. Add PostgreSQL Database
1. Click **"+ New Service"** → **"Database"** → **"PostgreSQL"**
2. Railway automatically connects it to your app

### 3. **MINIMAL Environment Variables**
In your app service → **Variables** tab, add **ONLY these 4 variables**:

```bash
DJANGO_SETTINGS_MODULE=config.settings.railway
DJANGO_SECRET_KEY=demo-secret-key-change-later
DJANGO_DEBUG=False
DATABASE_URL=${{ Postgres.DATABASE_URL }}
```

### 4. Deploy! 🚀
That's it! Your basic SocialPass demo will be live at `https://your-app.up.railway.app`

---

## ✅ **What Works with Minimal Setup:**

- ✅ **User signup/signin** (email + password, NO email verification required!)
- ✅ **Complete event management** (create, edit, manage events)
- ✅ **Free ticket sales** (paid tickets need Stripe)
- ✅ **QR code ticket generation** (PNG format)
- ✅ **Google Wallet tickets** (no Apple Wallet without dependencies)
- ✅ **Event scanner** (QR code check-in)
- ✅ **Admin dashboard** (full organizer features)
- ✅ **Team collaboration** (invite team members)
- ✅ **Database-backed user accounts** (all user data persisted)

## ⚠️ **Demo Limitations:**

- 📁 **File uploads**: Local storage (lost on restart) - add AWS S3 for persistence
- 💳 **Paid tickets**: Only free tickets work - add Stripe for payments
- 📧 **Emails**: Print to logs only - add email service for real notifications
- 🔐 **Google login**: Email/password only - add Google OAuth for social login

---

## 🎮 **Demo Usage:**

1. **Access your app**: `https://your-app.up.railway.app`

2. **Test signup/signin**: 
   - Click "Sign Up" to create a new account with any email + password
   - No email verification required - instant account creation!
   - Login with your credentials to access the dashboard

3. **Create admin user** (optional): Railway → App → Deployments → Latest → View Logs → Command:
   ```bash
   python manage.py createsuperuser
   ```

4. **Admin access**: `/admin/` (use superuser credentials for advanced admin features)

5. **Create your first event**: Navigate to dashboard and start creating events, selling tickets!

---

## 🚀 **Upgrade to Full Production:**

When ready for production, add these optional variables:

```bash
# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=your-bucket

# Payments (Stripe)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Email (any provider)
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email
EMAIL_HOST_PASSWORD=your-password

# Security (production)
DJANGO_SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

---

## 🆘 **Demo Troubleshooting:**

- **Can't connect?** Check PostgreSQL service is connected in Railway dashboard
- **Database errors?** Ensure `DATABASE_URL=${{ Postgres.DATABASE_URL }}` is set exactly
- **Need admin access?** Create superuser via Railway command line (see Demo Usage above)

**Demo deployment complete! 🎉**
