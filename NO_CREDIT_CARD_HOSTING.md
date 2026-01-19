# 🆓 100% Free Backend Hosting (No Credit Card Required)

## ⭐ Best Options Without Credit Card

### 1. **Railway** ⭐ RECOMMENDED (No Credit Card!)

**Why Choose Railway:**
- ✅ **NO CREDIT CARD REQUIRED** for $5 free credit
- ✅ $5 free credit per month (enough for small apps)
- ✅ No cold starts
- ✅ Easy deployment from GitHub
- ✅ Built-in environment variables
- ✅ Automatic HTTPS

**Free Tier:**
- $5 credit per month (~500 execution hours)
- 512MB RAM
- 1GB storage
- No credit card needed to start

**Deployment Steps:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login with GitHub
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up

# Add environment variables via Railway dashboard
```

**Or Deploy via GitHub (Easier):**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (no credit card!)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory: `backend`
6. Add environment variables in dashboard
7. Deploy!

**Environment Variables to Add:**
```
PORT=5001
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
FRONTEND_URL=your_vercel_url
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password
NODE_ENV=production
```

---

### 2. **Fly.io** (No Credit Card!)

**Why Choose Fly.io:**
- ✅ **NO CREDIT CARD REQUIRED** for free tier
- ✅ 3 shared VMs (256MB RAM each)
- ✅ No cold starts
- ✅ Edge deployment (fast globally)
- ✅ 3GB persistent storage
- ✅ 160GB outbound transfer

**Free Tier:**
- 3 shared-cpu-1x VMs (256MB RAM)
- 3GB persistent storage
- 160GB outbound data transfer per month

**Deployment Steps:**

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Or on Mac with Homebrew
brew install flyctl

# Login (GitHub or email, no credit card)
flyctl auth signup

# Navigate to backend
cd backend

# Launch app (creates fly.toml)
flyctl launch

# Follow prompts:
# - App name: sportsconnect-api
# - Region: Choose closest to you
# - Database: No (we're using MongoDB Atlas)
# - Deploy now: No

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

**Your API will be available at:** `https://your-app-name.fly.dev`

---

### 3. **Cyclic.sh** (No Credit Card!)

**Why Choose Cyclic:**
- ✅ **NO CREDIT CARD REQUIRED**
- ✅ Unlimited apps on free tier
- ✅ No cold starts
- ✅ 10,000 API calls per month
- ✅ Built-in database (DynamoDB)
- ✅ Deploy directly from GitHub

**Free Tier:**
- 10,000 API requests per month
- 1GB storage
- 100GB bandwidth
- Unlimited apps

**Deployment Steps:**

1. Go to [cyclic.sh](https://cyclic.sh)
2. Sign up with GitHub (no credit card!)
3. Click "Deploy"
4. Select your GitHub repository
5. Choose `backend` as root directory
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `NODE_ENV=production`
7. Click "Connect and Deploy"

**Your API will be available at:** `https://your-app-name.cyclic.app`

---

### 4. **Glitch** (No Credit Card!)

**Why Choose Glitch:**
- ✅ **NO CREDIT CARD REQUIRED**
- ✅ Instant deployment
- ✅ Live code editor in browser
- ✅ Community support
- ✅ Great for learning

**Free Tier:**
- 1000 project hours per month
- 512MB RAM
- 200MB disk space
- Sleeps after 5 minutes of inactivity (cold starts)

**Deployment Steps:**

1. Go to [glitch.com](https://glitch.com)
2. Sign up with GitHub
3. Click "New Project" → "Import from GitHub"
4. Paste your repository URL
5. Click on `.env` file and add:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   FRONTEND_URL=your_vercel_url
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_app_password
   NODE_ENV=production
   PORT=3000
   ```
6. Your app auto-deploys!

**Your API will be available at:** `https://your-project-name.glitch.me`

**Note:** Glitch has cold starts after 5 minutes of inactivity.

---

### 5. **Koyeb** (No Credit Card!)

**Why Choose Koyeb:**
- ✅ **NO CREDIT CARD REQUIRED**
- ✅ 2 free services
- ✅ Global edge deployment
- ✅ Auto-scaling
- ✅ No cold starts

**Free Tier:**
- 2 web services
- 512MB RAM per service
- 2GB storage
- Shared CPU

**Deployment Steps:**

1. Go to [koyeb.com](https://koyeb.com)
2. Sign up with GitHub
3. Click "Create App"
4. Select "GitHub" as source
5. Choose your repository
6. Configure:
   - **Builder:** Buildpack
   - **Build command:** `cd backend && npm install`
   - **Run command:** `cd backend && npm start`
7. Add environment variables
8. Deploy!

**Your API will be available at:** `https://your-app-name-your-org.koyeb.app`

---

## 📊 Comparison: No Credit Card Backends

| Platform | Free Tier | Cold Starts | RAM | Storage | Requests/Month | Credit Card |
|----------|-----------|-------------|-----|---------|----------------|-------------|
| **Railway** ⭐ | $5 credit | ❌ No | 512MB | 1GB | ~500 hours | ❌ No |
| **Fly.io** | 3 VMs | ❌ No | 256MB | 3GB | 160GB transfer | ❌ No |
| **Cyclic** | Unlimited apps | ❌ No | 512MB | 1GB | 10,000 | ❌ No |
| **Glitch** | 1000 hrs | ⚠️ Yes (5 min) | 512MB | 200MB | Unlimited | ❌ No |
| **Koyeb** | 2 services | ❌ No | 512MB | 2GB | Unlimited | ❌ No |

---

## 🏆 Recommended Stack (100% Free, No Credit Card)

### Option A: Best Performance
- **Frontend:** Vercel (no credit card)
- **Backend:** Railway (no credit card)
- **Database:** MongoDB Atlas (no credit card)
- **Total Cost:** $0/month

### Option B: Most Generous Free Tier
- **Frontend:** Cloudflare Pages (no credit card)
- **Backend:** Fly.io (no credit card)
- **Database:** MongoDB Atlas (no credit card)
- **Total Cost:** $0/month

### Option C: Simplest Setup
- **Frontend:** Vercel (no credit card)
- **Backend:** Cyclic (no credit card)
- **Database:** MongoDB Atlas (no credit card)
- **Total Cost:** $0/month

---

## 🚀 Quick Start: Railway Deployment (Recommended)

### Step 1: Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login with GitHub (no credit card needed!)
railway login

# Navigate to backend folder
cd backend

# Initialize Railway project
railway init

# Deploy
railway up
```

### Step 2: Add Environment Variables

Go to Railway dashboard → Your project → Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportsconnect
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
FRONTEND_URL=https://your-app.vercel.app
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
NODE_ENV=production
PORT=5001
```

### Step 3: Get Your Backend URL

Railway will provide a URL like: `https://your-app.up.railway.app`

### Step 4: Deploy Frontend to Vercel

```bash
# Update .env with Railway backend URL
echo "VITE_API_URL=https://your-app.up.railway.app/api" > .env

# Deploy to Vercel
vercel --prod
```

### Step 5: Update FRONTEND_URL in Railway

Go back to Railway and update `FRONTEND_URL` with your Vercel URL.

---

## 💡 Pro Tips

1. **Railway Credit Management:**
   - $5 credit = ~500 hours of runtime
   - For 24/7 uptime, you'll use ~720 hours/month
   - Consider using Railway for development, upgrade later for production

2. **Fly.io Optimization:**
   - Use 1 VM for backend (saves resources)
   - Scale to 3 VMs when traffic increases
   - Excellent for global deployment

3. **Cyclic Limitations:**
   - 10,000 requests/month = ~333 requests/day
   - Good for small projects and testing
   - Upgrade if you need more requests

4. **Avoid Cold Starts:**
   - Railway, Fly.io, Cyclic, Koyeb have no cold starts
   - Glitch has cold starts after 5 minutes
   - Use a free uptime monitor to ping your app

---

## 🔧 Troubleshooting

### Railway: "Out of Credit"
- Free $5 credit renews monthly
- Check usage in dashboard
- Consider upgrading to $5/month for more credit

### Fly.io: "Not enough resources"
- Free tier includes 3 VMs
- Use only 1 VM for backend
- Scale down if needed: `flyctl scale count 1`

### Cyclic: "Request limit exceeded"
- Free tier = 10,000 requests/month
- Monitor usage in dashboard
- Upgrade to Pro ($5/month) for unlimited requests

---

## 📞 Support Links

- **Railway:** [docs.railway.app](https://docs.railway.app)
- **Fly.io:** [fly.io/docs](https://fly.io/docs)
- **Cyclic:** [docs.cyclic.sh](https://docs.cyclic.sh)
- **Glitch:** [glitch.com/help](https://glitch.com/help)
- **Koyeb:** [koyeb.com/docs](https://koyeb.com/docs)

---

**Last Updated:** January 2026  
**Recommended:** Railway (Best balance of features and no credit card requirement)
