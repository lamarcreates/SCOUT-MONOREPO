# GitHub Actions Setup Guide

## What We Just Created

GitHub Actions will now automatically deploy your MotorScout app whenever:
- **You push to main branch** → Deploys to production
- **Someone opens a PR** → Creates a preview deployment
- **All team members can deploy** by pushing code!

## How It Works

```
Developer pushes code → GitHub Actions runs → Deploys to your Vercel account
```

### The Workflow Has 3 Jobs:

1. **Test Job** (Always runs)
   - Installs dependencies
   - Builds all NX projects
   - Runs tests (if any exist)

2. **Deploy Preview** (For pull requests)
   - Creates a preview URL for testing
   - Comments the URL on the PR
   - Each PR gets its own preview

3. **Deploy Production** (For main branch)
   - Deploys to v0-scout production
   - Uses your Vercel account
   - Automatic, no manual steps

## Setup Instructions

### Step 1: Get Your Vercel Tokens

1. **Get Vercel Token:**
   ```bash
   # In your terminal, run:
   npx vercel whoami
   # If not logged in:
   npx vercel login
   
   # Then create a token at:
   # https://vercel.com/account/tokens
   # Create new token → Name it "GitHub Actions"
   ```

2. **Get Project and Org IDs:**
   ```bash
   # In scout-workspace directory:
   cat .vercel/project.json
   ```
   You'll see:
   ```json
   {
     "projectId": "prj_xxxxx",  // This is VERCEL_PROJECT_ID
     "orgId": "team_xxxxx"      // This is VERCEL_ORG_ID
   }
   ```

### Step 2: Add Secrets to GitHub

Go to your GitHub repository:
1. Click **Settings** tab
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these 3 secrets:

| Secret Name | Value | Where to Get It |
|------------|-------|-----------------|
| `VERCEL_TOKEN` | `xxx...` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `team_ZuiLHat9lG7VxNmfJbyWPKr4` | Already provided |
| `VERCEL_PROJECT_ID` | `prj_JWSulHV96TNFiUhgfRqCUHI4aBjT` | Already provided |

### Step 3: Commit and Push

```bash
git add .
git commit -m "Add GitHub Actions for automatic Vercel deployments"
git push origin main
```

### Step 4: Watch It Deploy!

1. Go to your repo's **Actions** tab
2. You'll see the workflow running
3. Click on it to watch the progress
4. When done, your site is deployed!

## For Your Team

### How Team Members Deploy:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/lamarcreates/SCOUT-MONOREPO.git
   cd SCOUT-MONOREPO
   ```

2. **Make changes and push:**
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin main
   ```

3. **Automatic deployment happens!**
   - No Vercel access needed
   - No API keys needed locally
   - Just push code!

### For Pull Requests:

1. **Create a branch:**
   ```bash
   git checkout -b feature/new-chat-ui
   ```

2. **Push and open PR:**
   ```bash
   git push origin feature/new-chat-ui
   # Open PR on GitHub
   ```

3. **Get preview URL:**
   - GitHub Actions comments the preview URL on your PR
   - Test your changes before merging

## Monitoring Deployments

### See deployment status:
- **GitHub Actions tab**: Shows all runs
- **Vercel Dashboard**: Shows all deployments
- **PR Comments**: Shows preview URLs

### If deployment fails:
1. Click on the failed job in GitHub Actions
2. Read the error logs
3. Common issues:
   - Missing secrets → Add them in GitHub settings
   - Build errors → Fix locally first with `npm run build`
   - Vercel issues → Check Vercel dashboard

## Benefits for Your Team

✅ **No Vercel Team Account needed** - Save $80/month
✅ **All 4 developers can deploy** - Just push to GitHub
✅ **Automatic preview deployments** - Test before merging
✅ **Zero configuration for team** - Secrets stay secure
✅ **Full deployment history** - In GitHub Actions tab

## Next Steps

1. Add the 3 secrets to GitHub (only need VERCEL_TOKEN, ORG_ID, and PROJECT_ID)
2. Push this commit to trigger first deployment
3. Share repo with your team
4. They can start deploying immediately!

## Future Enhancements

When you're ready, uncomment the `deploy-backend` job in `.github/workflows/deploy.yml` to also deploy your backend to AWS EC2 automatically.