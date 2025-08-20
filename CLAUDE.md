# Claude Code Instructions for MotorScout Project

## Git Commit Guidelines

**IMPORTANT**: When creating git commits, DO NOT include the following in commit messages:
- 🤖 Generated with [Claude Code](https://claude.ai/code)
- Co-Authored-By: Claude <noreply@anthropic.com>
- Any AI/Claude attribution or emoji signatures

Keep commit messages clean, professional, and focused solely on describing the changes made.

## Project Context

This is the MotorScout.ai automotive platform monorepo using:
- NX for monorepo management
- Next.js 15 for frontend (deployed to Vercel)
- Node.js backend (will deploy to AWS EC2)
- On-premise LLAMA 70B AI cluster (connected via Tailscale)
- Team of 4 developers

## Key Commands

- `npm run dev` - Start development servers
- `npm run build` - Build all projects
- `npm run lint` - Run linting
- `npm run test` - Run tests

## Deployment

- Frontend deploys to Vercel (project: v0-scout)
- Backend will deploy to AWS EC2 t3.large
- Use Tailscale for on-prem AI connection