frontend/
├── public/                 # Static assets (images, logos, favicon)
├── src/
│   ├── app/                # App Router (Pages & Layouts)
│   │   ├── (auth)/         # Route Group: Layout for Login/Signup
│   │   │   ├── sign-in/    # Clerk Sign-in page
│   │   │   └── sign-up/    # Clerk Sign-up page
│   │   ├── (marketing)/    # Route Group: Landing page layout
│   │   │   └── page.tsx    # The Home Page ("/")
│   │   ├── dashboard/      # Protected App Area
│   │   │   ├── layout.tsx  # Dashboard Sidebar & Header wrapper
│   │   │   ├── page.tsx    # Main Overview (Stats)
│   │   │   ├── analyze/    # Transaction Analyzer Tool
│   │   │   ├── history/    # Transaction History Table
│   │   │   └── billing/    # Upgrade/Plan Management
│   │   ├── api/            # Next.js API Routes (if needed for specialized proxying)
│   │   ├── globals.css     # Global styles (Tailwind imports)
│   │   └── layout.tsx      # Root Layout (ClerkProvider lives here)
│   │
│   ├── components/         # All React Components
│   │   ├── ui/             # "Dumb" Reusable UI (Buttons, Cards, Inputs)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── landing/        # Components specific to the Marketing Page
│   │   │   ├── Hero.tsx
│   │   │   └── Pricing.tsx
│   │   ├── dashboard/      # Components specific to the Dashboard
│   │   │   ├── Sidebar.tsx
│   │   │   ├── UsageChart.tsx
│   │   │   └── FraudGauge.tsx
│   │   └── forms/          # Complex forms with validation
│   │       └── AnalyzeForm.tsx
│   │
│   ├── lib/                # Logic & Utilities
│   │   ├── axios.ts        # Pre-configured Axios instance (Base URL to Render)
│   │   ├── utils.ts        # CN helper (for Tailwind) and formatters
│   │   └── constants.ts    # Config values (Plan limits, API endpoints)
│   │
│   ├── hooks/              # Custom React Hooks
│   │   └── use-fraud-check.ts # Hook to handle the API call & loading states
│   │
│   └── types/              # TypeScript Definitions
│       └── index.ts        # Interfaces (Transaction, UserProfile, APIResponse)
│
├── .env.local              # Secrets (Clerk Keys, Backend URL)
├── middleware.ts           # Clerk Authentication Middleware
├── next.config.mjs
└── tailwind.config.ts