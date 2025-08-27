# Claude Code Instructions for MotorScout Project

## Git Commit Guidelines

**IMPORTANT**: When creating git commits, DO NOT include the following in commit messages:
- 🤖 Generated with [Claude Code](https://claude.ai/code)
- Co-Authored-By: Claude <noreply@anthropic.com>
- Any AI/Claude attribution or emoji signatures

Keep commit messages clean, professional, and focused solely on describing the changes made.

## Pre-Push Checklist

**MANDATORY**: Before pushing any code changes to the repository, complete ALL of the following steps:

1. **Test Locally**
   - Run `npm run dev:frontend` and verify functionality works
   - Test the specific features/changes you've made
   - Check browser console for any errors

2. **Build Verification**
   - Run `npm run build:frontend` to ensure NX build passes
   - Run `npx vercel build` to ensure Vercel build passes locally
   - Address any build errors or warnings before proceeding

3. **Code Quality**
   - Run `npm run lint` if available
   - Ensure no TypeScript errors are present
   - Check that all imports are correct (especially for AI SDK v5)

4. **API Testing** (if applicable)
   - Test API endpoints with curl or browser
   - Verify responses are in correct format
   - Check error handling works properly

5. **Final Verification**
   - Review all changed files with `git diff`
   - Ensure no sensitive data (API keys, secrets) are committed
   - Verify commit message is clear and descriptive

Only after ALL checks pass should you run:
```bash
git add -A
git commit -m "Clear descriptive message"
git push origin main
```

## Project Context

This is the MotorScout.ai automotive platform monorepo using:
- NX for monorepo management
- Next.js 15 for frontend (deployed to Vercel)
- Node.js backend (will deploy to AWS EC2)
- On-premise LLAMA 70B AI cluster (connected via Tailscale)
- Team of 4 developers
- AI SDK v5 (Vercel AI SDK) for chat functionality

## Key Commands

- `npm run dev` - Start development servers
- `npm run dev:frontend` - Start frontend dev server only
- `npm run build` - Build all projects
- `npm run build:frontend` - Build frontend only
- `npm run lint` - Run linting
- `npm run test` - Run tests
- `npx vercel build` - Test Vercel build locally
- `npx vercel pull --yes` - Pull Vercel project settings

## Deployment

- Frontend deploys to Vercel (project: v0-scout)
- Backend will deploy to AWS EC2 t3.large
- Use Tailscale for on-prem AI connection
- Automatic deployment triggered on push to main branch