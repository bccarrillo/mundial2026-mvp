# Memories26 - Development

This is the main application folder for the Memories26 project.

## Quick Start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Documentation

All project documentation is located in the `/docs` folder:

- **[README.md](../docs/README.md)** - Complete project overview
- **[PROJECT-STATUS.md](../docs/PROJECT-STATUS.md)** - Current development status
- **[I18N-STATUS.md](../docs/I18N-STATUS.md)** - Internationalization status

## Environment Setup

Copy `.env.local` and configure your environment variables:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Debug (set to false for production)
NEXT_PUBLIC_DEBUG_MODE=false
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4

## Status: ✅ Production Ready

The V2 system is complete and ready for production deployment.