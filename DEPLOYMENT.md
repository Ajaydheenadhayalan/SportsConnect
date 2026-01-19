# 🚀 SportsConnect - Production Deployment Guide

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Production Build](#production-build)
- [Deployment Options](#deployment-options)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment](#post-deployment)

---

## 🎯 Project Overview

**SportsConnect** is a full-stack sports social networking platform built with:
- **Frontend**: React 19 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT + Email OTP

---

## ✅ Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Email service credentials (Gmail or SMTP)
- Git installed

---

## 💻 Local Development

### 1. Clone and Install

```bash
cd /path/to/project
npm install
cd backend && npm install && cd ..
```

### 2. Configure Environment Variables

**Root `.env`:**
```env
VITE_API_URL=http://localhost:5001/api
```

**Backend `.env`:**
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
FRONTEND_URL=http://localhost:5173

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

### 3. Run Development Server

```bash
npm run dev:all
```

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

---

## 🏗️ Production Build

### Build Frontend

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Test Production Build Locally

```bash
npm run preview
```

---

## 🌐 Deployment Options

> **⚠️ Important:** Some platforms like Render now require credit card verification. See [NO_CREDIT_CARD_HOSTING.md](./NO_CREDIT_CARD_HOSTING.md) for alternatives that don't require a credit card.

### Option 1: Vercel (Frontend) + Railway (Backend) - **RECOMMENDED (No Credit Card!)**

#### **Frontend on Vercel**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel Dashboard:**
   - `VITE_API_URL` = Your backend API URL (e.g., `https://your-app.up.railway.app/api`)

#### **Backend on Railway (No Credit Card Required!)**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login with GitHub:**
   ```bash
   railway login
   ```

3. **Navigate to backend and deploy:**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Add Environment Variables in Railway Dashboard:**
   ```
   PORT=5001
   MONGODB_URI=<your_mongodb_atlas_uri>
   JWT_SECRET=<your_secret_key>
   FRONTEND_URL=<your_vercel_frontend_url>
   EMAIL_USER=<your_email>
   EMAIL_PASSWORD=<your_app_password>
   NODE_ENV=production
   ```

5. **Get your Railway URL** and update `VITE_API_URL` in Vercel

**Railway Free Tier:**
- $5 credit per month (~500 execution hours)
- No credit card required
- No cold starts

---

### Option 2: Vercel (Frontend) + Fly.io (Backend) - **No Credit Card!**

#### **Frontend on Vercel**

Same as Option 1 above.

#### **Backend on Fly.io**

1. **Install Fly CLI:**
   ```bash
   # Mac
   brew install flyctl
   
   # Linux/WSL
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up (no credit card):**
   ```bash
   flyctl auth signup
   ```

3. **Deploy:**
   ```bash
   cd backend
   flyctl launch
   # Follow prompts, choose region, skip database
   
   # Set environment variables
   flyctl secrets set MONGODB_URI="your_mongodb_uri"
   flyctl secrets set JWT_SECRET="your_secret_key"
   flyctl secrets set FRONTEND_URL="your_vercel_url"
   flyctl secrets set EMAIL_USER="your_email"
   flyctl secrets set EMAIL_PASSWORD="your_app_password"
   flyctl secrets set NODE_ENV="production"
   
   # Deploy
   flyctl deploy
   ```

**Fly.io Free Tier:**
- 3 shared VMs (256MB RAM each)
- 3GB storage
- 160GB outbound transfer
- No credit card required

---

### Option 3: Vercel (Frontend) + Cyclic (Backend) - **No Credit Card!**

#### **Frontend on Vercel**

Same as Option 1 above.

#### **Backend on Cyclic**

1. Go to [cyclic.sh](https://cyclic.sh)
2. Sign up with GitHub (no credit card!)
3. Click "Deploy"
4. Select your GitHub repository
5. Choose `backend` as root directory
6. Add environment variables in dashboard
7. Deploy!

**Cyclic Free Tier:**
- 10,000 API requests per month
- Unlimited apps
- No credit card required
- No cold starts

---

### More Options

See [NO_CREDIT_CARD_HOSTING.md](./NO_CREDIT_CARD_HOSTING.md) for additional platforms:
- Glitch
- Koyeb
- And more!



---

## 🔐 Environment Configuration

### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Go to **Database Access** → Create database user
4. Go to **Network Access** → Add IP (use `0.0.0.0/0` for all IPs)
5. Get connection string from **Connect** → **Connect your application**
6. Replace `<password>` with your database user password

### Email Service Setup (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate an App Password
4. Use this password in `EMAIL_PASSWORD` environment variable

---

## ✨ Post-Deployment

### 1. Verify Deployment

**Check Backend Health:**
```bash
curl https://your-backend-url.com/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "SportsConnect API is running",
  "database": "connected"
}
```

### 2. Test Core Features

- ✅ User Registration (Email OTP)
- ✅ User Login
- ✅ Profile Creation
- ✅ Location Picker
- ✅ Admin Dashboard Access

### 3. Monitor Logs

**Render/Railway:**
- Check logs in dashboard for errors

**Vercel/Netlify:**
- Check function logs for API errors

---

## � Troubleshooting

### Issue: CORS Errors

**Solution:** Ensure `FRONTEND_URL` in backend `.env` matches your deployed frontend URL

### Issue: Database Connection Failed

**Solution:** 
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has correct permissions

### Issue: Email OTP Not Sending

**Solution:**
- Verify Gmail App Password is correct
- Check email service logs in backend
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set

### Issue: Build Fails

**Solution:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (must be 18+)
- Verify all dependencies are in `package.json`

---

## � Performance Optimization

### Frontend
- ✅ Code splitting enabled (Vite default)
- ✅ Asset optimization
- ✅ Lazy loading for routes

### Backend
- ✅ MongoDB connection pooling
- ✅ JWT token caching
- ✅ Error handling middleware

---

## 🔒 Security Checklist

- ✅ Environment variables secured
- ✅ JWT secret is strong (32+ characters)
- ✅ CORS configured properly
- ✅ MongoDB Atlas network access restricted
- ✅ Passwords hashed with bcrypt
- ✅ Input validation on all endpoints

---

## � Admin Access

**Admin Login URL:** `https://your-domain.com/admin/login`

**Default Admin Credentials:**
- Create admin user via MongoDB Atlas or backend API

---

## 🎉 Success!

Your SportsConnect application is now live! 

**Frontend:** https://your-frontend-url.com  
**Backend API:** https://your-backend-url.com  
**Admin Panel:** https://your-frontend-url.com/admin/login

---

## 📞 Support

For issues or questions:
- Check backend logs for API errors
- Verify environment variables are set correctly
- Ensure MongoDB connection is active
- Test API endpoints using Postman or curl

---

**Built with ❤️ for the sports community**
