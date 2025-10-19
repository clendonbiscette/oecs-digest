# Vercel Deployment Guide - OECS Education Dashboard

This guide will walk you through deploying the OECS Education Dashboard to Vercel.

## Prerequisites

- ✅ GitHub repository set up at https://github.com/clendonbiscette/oecs-digest
- ✅ Supabase project created and configured
- A Vercel account (free tier works - sign up at https://vercel.com)

## Step 1: Sign Up/Log In to Vercel

1. Go to https://vercel.com
2. Click **Sign Up** (or **Log In** if you have an account)
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account

## Step 2: Import Your Project

1. On the Vercel dashboard, click **Add New...** → **Project**
2. Find and select the **oecs-digest** repository
3. Click **Import**

## Step 3: Configure Project Settings

Vercel will auto-detect that this is a Next.js project. Configure the following:

### Framework Preset
- **Framework:** Next.js (auto-detected) ✅
- **Root Directory:** `./` (leave as default)
- **Build Command:** `next build` (auto-filled)
- **Output Directory:** `.next` (auto-filled)

### Environment Variables

Click **Environment Variables** and add the following:

| Name | Value | Where to get it |
|------|-------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJxxx...` | Supabase → Project Settings → API → anon/public key |
| `OPENAI_API_KEY` | `sk-xxx...` | OpenAI → API Keys (optional, for AI chat) |

**Important Notes:**
- Make sure to use `NEXT_PUBLIC_` prefix for client-side variables
- Click **Add** after each variable
- All variables should be added to **Production**, **Preview**, and **Development** environments

## Step 4: Deploy!

1. Click **Deploy**
2. Wait 2-3 minutes for the build to complete
3. You'll see a success screen with your deployment URL

## Step 5: Verify Deployment

1. Click **Visit** to open your deployed site
2. Test the following:
   - ✅ Home page loads
   - ✅ Dashboard page loads
   - ✅ Login page works (`/auth/login`)
   - ✅ Can sign up (`/auth/signup`)
   - ✅ Can log in and access data entry (`/data-entry`)

## Step 6: Configure Custom Domain (Optional)

1. In your Vercel project, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `digest.oecs.org`)
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

## Step 7: Update Supabase Site URL

Important for authentication to work correctly:

1. Go to your Supabase project
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to **Site URL**: `https://your-project.vercel.app`
4. Add the URL to **Redirect URLs** as well

## Environment Variables Reference

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: OpenAI for AI Chat
OPENAI_API_KEY=sk-proj-xxxxx
```

### How to Get Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project
3. Click **Settings** (gear icon) in sidebar
4. Click **API**
5. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

No manual deployment needed after initial setup!

## Troubleshooting

### Build Fails

**Error: Module not found**
- Check that all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: Environment variable not found**
- Verify all required environment variables are set in Vercel
- Check spelling and prefix (`NEXT_PUBLIC_`)

### Authentication Not Working

**Redirect loops or "Invalid redirect URL"**
1. Check Supabase **Site URL** matches your Vercel URL
2. Add Vercel URL to **Redirect URLs** in Supabase Auth settings
3. Include both:
   - `https://your-project.vercel.app`
   - `https://your-project.vercel.app/**` (with wildcard)

### Database Connection Issues

**Cannot connect to Supabase**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check Supabase project is not paused (free tier pauses after inactivity)

### Pages Not Loading

**404 errors**
- Ensure all pages are in the `app/` directory
- Check middleware.ts isn't blocking routes
- Verify build succeeded without errors

## Performance Optimization

### Enable Analytics (Optional)

1. In Vercel project settings
2. Go to **Analytics**
3. Click **Enable**
4. Monitor page load times and visitor stats

### Enable Speed Insights (Optional)

1. In Vercel project settings
2. Go to **Speed Insights**
3. Click **Enable**
4. Get real user performance metrics

## Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Supabase Site URL updated
- [ ] Test signup flow works
- [ ] Test login flow works
- [ ] Test data entry form saves correctly
- [ ] Verify RLS policies working (users can't see other countries' data)
- [ ] Check mobile responsiveness
- [ ] Test AI chat functionality (if OpenAI key added)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (Vercel provides free)

## Monitoring

### View Deployment Logs

1. Go to your Vercel project
2. Click **Deployments**
3. Click on any deployment
4. View **Build Logs** and **Function Logs**

### Error Tracking

Vercel automatically captures:
- Build errors
- Runtime errors
- Function timeouts

Check the **Logs** tab in your project dashboard.

## Updating the Deployment

### Method 1: Push to GitHub (Recommended)

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel auto-deploys in ~2 minutes.

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Method 3: Manual Deploy

1. Go to Vercel dashboard
2. Click **Deployments**
3. Click **Redeploy** on any deployment

## Rollback

If something breaks:

1. Go to **Deployments**
2. Find a working previous deployment
3. Click **⋯** → **Promote to Production**

## Team Access (Optional)

To add team members:

1. Go to **Settings** → **Team**
2. Click **Invite Member**
3. Enter email and assign role

## Cost Estimation

**Vercel Free Tier (Hobby):**
- 100 GB bandwidth/month
- 6,000 build minutes/month
- Unlimited projects
- **Cost: $0**

**Vercel Pro Tier:**
- 1 TB bandwidth/month
- Unlimited build minutes
- Analytics included
- **Cost: $20/month**

For OECS project, **Free tier should be sufficient** for development and moderate production use.

## Security Best Practices

1. **Never commit `.env.local`** (already in .gitignore ✅)
2. **Rotate API keys** if exposed
3. **Use Supabase RLS** for data security (already configured ✅)
4. **Enable 2FA** on Vercel and GitHub accounts
5. **Review access logs** regularly

## Next Steps After Deployment

1. Share the URL with stakeholders
2. Create test accounts for each OECS country
3. Begin user acceptance testing (UAT)
4. Collect feedback
5. Build remaining data entry forms
6. Add production data

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Deployment Issues**: Check build logs in Vercel dashboard

---

**Deployment Time**: ~5 minutes (initial setup)

**Subsequent Deployments**: Automatic on every git push (~2 minutes)

🎉 **Your OECS Education Dashboard is now live!**
