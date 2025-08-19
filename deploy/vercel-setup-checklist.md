# Vercel Configuration Checklist

## Current Git Settings (Keep These)
✅ **Connected Git Repository**: lamarcreates/SCOUT-MONOREPO
✅ **Pull Request Comments**: Enabled (good for team)
✅ **Commit Comments**: Enabled
✅ **deployment_status Events**: Enabled
✅ **Git LFS**: Disabled (you don't need it)
✅ **Ignored Build Step**: Automatic (perfect)

## IMPORTANT: Check These Settings

### 1. Go to "Build and Deployment" Tab
**Critical settings to verify/update:**

- **Root Directory**: `.` (should be the root, not a subdirectory)
- **Framework Preset**: `Next.js`
- **Build Command**: `nx build frontend`
- **Output Directory**: `dist/apps/frontend/.next`
- **Install Command**: `npm install`
- **Node.js Version**: `20.x`

### 2. Go to "Environment Variables" Tab
Add these if your app needs them:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```
(Leave blank for now if you don't have the backend deployed yet)

### 3. Go to "Domains" Tab
- Your app should be at: `v0-scout.vercel.app`
- You can add custom domain later

## Quick Verification

After saving any changes, trigger a new deployment:

1. Make a small change locally:
```bash
echo "# Scout Monorepo" > README.md
git add README.md
git commit -m "docs: update README"
git push
```

2. Check Vercel dashboard - it should auto-deploy

## If Build Fails

Common fixes:
1. Ensure Root Directory is `.` (not `/apps/frontend`)
2. Check build command is `nx build frontend`
3. Verify Node.js version is 20.x

## Team Collaboration Features (Already Good)

Your settings are perfect for team work:
- ✅ PR comments show preview URLs
- ✅ Commit comments show deployment status
- ✅ Every PR gets its own preview deployment

## Optional: Deploy Hooks

You might want to add a deploy hook later for:
- Triggering builds from your backend
- Scheduled rebuilds
- Webhook from other services

But not needed now.

---

**Next Step**: Go to "Build and Deployment" tab to verify the build settings!