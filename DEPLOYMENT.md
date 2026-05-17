# 🚀 Deployment Guide — Exclusive E-Commerce App

Deploy your app **FREE** so anyone in the world can visit it.
Total time: ~20 minutes.

---

## Architecture

```
Frontend  →  Vercel       (free, auto-deploys from GitHub)
Backend   →  Render       (free, Node.js hosting)
Database  →  MongoDB Atlas (free, 512MB cloud DB)
```

---

## Step 1 — MongoDB Atlas (Database)

1. Go to https://cloud.mongodb.com → Sign up free
2. Create a **free M0 cluster** (choose any region)
3. Under **Security → Database Access** → Add a user with password
4. Under **Security → Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Click **Connect** → **Drivers** → copy your URI:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/exclusive
   ```
6. Save this — you'll need it in Step 2

---

## Step 2 — Deploy Backend to Render

1. Push your project to GitHub first (see main README)
2. Go to https://render.com → Sign up with GitHub
3. Click **New** → **Web Service**
4. Connect your GitHub repo → select the `exclusive` repo
5. Configure:
   - **Name**: `exclusive-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Add Environment Variables:
   ```
   MONGO_URI     = mongodb+srv://... (from Step 1)
   JWT_SECRET    = any_long_random_string_here_make_it_long
   CLIENT_URL    = https://your-app.vercel.app (add after Step 3)
   PORT          = 10000
   ```
7. Click **Create Web Service**
8. Wait ~3 minutes → copy your backend URL:
   ```
   https://exclusive-backend-xxxx.onrender.com
   ```

9. **Seed the database** — open Render's Shell tab and run:
   ```bash
   node seed.js
   ```

---

## Step 3 — Deploy Frontend to Vercel

1. Go to https://vercel.com → Sign up with GitHub
2. Click **Add New Project** → Import your repo
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://exclusive-backend-xxxx.onrender.com/api
   ```
   (Use your Render URL from Step 2)
5. Click **Deploy**
6. Your app is live at: `https://exclusive-yourname.vercel.app` 🎉

---

## Step 4 — Update Backend CORS

Go back to Render → your backend → Environment:
```
CLIENT_URL = https://exclusive-yourname.vercel.app
```
Click **Save Changes** → it redeploys automatically.

---

## Step 5 — Test Everything

Visit your live URL and test:
- [ ] Homepage loads with products
- [ ] Sign up / Login works
- [ ] Add to cart & checkout
- [ ] Admin panel at `/admin` (login with admin@exclusive.com / admin123)

---

## Troubleshooting

**Products not showing?**
→ Run `node seed.js` in Render Shell

**CORS error?**
→ Make sure CLIENT_URL in Render matches your exact Vercel URL

**Backend sleeping?** (Render free tier sleeps after 15 min)
→ First request takes ~30 seconds to wake up — this is normal on free tier
→ Upgrade to Render Starter ($7/mo) to keep it always on

---

## Your Live URLs

After deployment, fill these in:

| Service | URL |
|---------|-----|
| Frontend | `https://________________.vercel.app` |
| Backend  | `https://________________.onrender.com` |
| Admin    | `https://________________.vercel.app/admin` |
