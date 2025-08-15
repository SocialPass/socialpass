# 🚀 Railway Deployment Guide for SocialPass

This guide will help you deploy SocialPass to Railway with PostgreSQL database.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your SocialPass code to GitHub
3. **AWS S3 Bucket**: For media file storage (images, etc.)

## 🎯 Quick Deployment Steps

### 1. Create Railway Project

1. Visit [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your SocialPass repository
5. Railway will automatically detect it's a Django project

### 2. Add PostgreSQL Database

1. In your Railway project dashboard
2. Click **"+ New Service"**
3. Select **"Database"** → **"PostgreSQL"**
4. Railway will automatically connect it to your app

### 3. Configure Environment Variables

Go to your app service → **Variables** tab and add these:

```bash
# Required Variables
DJANGO_SETTINGS_MODULE=config.settings.railway
DJANGO_SECRET_KEY=your-super-secret-key-here
DJANGO_DEBUG=False

# AWS S3 (for media files)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=your-s3-bucket-name
AWS_S3_REGION_NAME=us-east-1

# Stripe (for payments)
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Google OAuth (optional)
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_SECRET=your-google-client-secret

# Rollbar (optional - error tracking)
ROLLBAR_ACCESS_TOKEN=your-rollbar-token
ROLLBAR_ENV_NAME=production
```

### 4. Deploy!

1. Railway will automatically deploy when you push to your main branch
2. Monitor the build logs in the Railway dashboard
3. Your app will be available at `https://your-app-name.up.railway.app`

## 📋 Post-Deployment Setup

### Create Django Superuser

1. Go to your Railway project
2. Open the app service
3. Go to **"Deployments"** → Click on latest deployment
4. Click **"View Logs"** and then **"Command"**
5. Run: `python manage.py createsuperuser`

### Configure Custom Domain (Optional)

1. In Railway project → **Settings**
2. Go to **"Domains"**
3. Add your custom domain
4. Update DNS records as shown
5. Add your domain to `RAILWAY_PUBLIC_DOMAIN` environment variable

## 🔧 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DJANGO_SETTINGS_MODULE` | Django settings module | Yes | `config.settings.railway` |
| `DJANGO_SECRET_KEY` | Django secret key | Yes | Generate at [djecrety.ir](https://djecrety.ir/) |
| `DATABASE_URL` | PostgreSQL URL | Auto | Provided by Railway |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key | Yes | From AWS Console |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key | Yes | From AWS Console |
| `AWS_STORAGE_BUCKET_NAME` | S3 bucket name | Yes | `your-socialpass-media` |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key | Yes | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes | `sk_test_...` |

## 🎮 Features Available After Deployment

✅ **Full SocialPass Platform**
- Event creation and management
- Ticket sales (paid, free, token-gated)
- QR code ticket scanning
- Apple/Google Wallet integration
- Stripe payment processing
- Email notifications
- Admin dashboard

✅ **Automatic Scaling**
- Railway handles traffic spikes
- Database connection pooling
- Static file serving via WhiteNoise

✅ **Built-in Monitoring**
- Application logs
- Performance metrics
- Error tracking (with Rollbar)

## 🆘 Troubleshooting

### Common Issues

1. **Build Fails**: Check that all requirements are in `config/requirements/production.txt`
2. **Database Connection**: Ensure PostgreSQL service is running in Railway
3. **Static Files**: Run `python manage.py collectstatic` if needed
4. **Environment Variables**: Double-check all required variables are set

### Useful Commands

```bash
# View logs
railway logs

# Run Django commands
railway run python manage.py migrate
railway run python manage.py createsuperuser
railway run python manage.py collectstatic

# Connect to database
railway connect
```

## 🎉 Success!

Your SocialPass platform is now running on Railway! 

**Next Steps:**
1. Set up your AWS S3 bucket for media files
2. Configure Stripe for payments
3. Set up Google OAuth for social login
4. Create your first event!

**URLs:**
- App: `https://your-app-name.up.railway.app`
- Admin: `https://your-app-name.up.railway.app/admin/`
- Dashboard: `https://your-app-name.up.railway.app/dashboard/`
