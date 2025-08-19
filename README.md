# Scout Monorepo

A modern automotive dealership platform built with NX, Next.js, and Fastify.

## Project Structure

```
scout-workspace/
├── apps/
│   ├── frontend/          # Next.js frontend application (Vercel)
│   └── backend/           # Fastify backend API (AWS Lambda)
├── libs/
│   └── shared/
│       ├── ui/            # Shared UI components
│       ├── types/         # Shared TypeScript types
│       └── utils/         # Shared utility functions
└── tools/                 # Build tools and scripts
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- AWS CLI (for backend deployment)
- Vercel CLI (for frontend deployment)

### Installation

```bash
npm install
```

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

### Building

Build all applications:

```bash
npm run build
```

Build specific apps:

```bash
npm run build:frontend
npm run build:backend
```

### Testing

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Deployment

### Frontend (Vercel)

The frontend is configured for deployment to Vercel:

```bash
npm run deploy:frontend
```

Or use Vercel's git integration for automatic deployments.

### Backend (AWS)

The backend is configured for AWS Lambda deployment using Serverless Framework:

```bash
npm run deploy:backend
```

Make sure to configure your AWS credentials first:

```bash
aws configure
```

## NX Commands

### View project graph

```bash
npm run graph
```

### Generate new library

```bash
npx nx g @nx/js:lib my-lib --directory=libs/my-lib
```

### Run specific tasks

```bash
npx nx serve frontend
npx nx build backend
npx nx test shared-ui
```

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
AWS_REGION=us-east-1
```

## Tech Stack

- **Monorepo**: NX
- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Fastify, Node.js
- **Deployment**: Vercel (Frontend), AWS Lambda (Backend)
- **Package Manager**: npm

## License

MIT