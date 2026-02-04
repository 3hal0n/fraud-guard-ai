# FraudGuard AI – Enterprise FinTech Fraud Detection Platform

A complete, enterprise-grade fraud detection Micro-SaaS frontend built with Next.js 15, TypeScript, and Tailwind CSS v4.

## 🎯 Product Overview

FraudGuard AI is an enterprise dark-mode FinTech platform designed for banks, payment processors, and FinTech risk teams. The platform provides real-time AI-powered fraud detection with sub-second latency and bank-grade security.

## 🎨 Design System

### Brand Identity
- **Enterprise Dark-Mode FinTech** aesthetic
- Deep navy blue primary backgrounds
- Charcoal and slate grey surfaces
- Teal accents for CTAs and safe states
- Coral red for fraud alerts and high-risk indicators

### Typography
- **Font Family**: Inter
- Clean, technical, enterprise-appropriate hierarchy

### Visual Style
- Minimalist but data-rich
- Subtle glassmorphism on cards
- Calm transitions and micro-animations
- Fully responsive (desktop-first, mobile-friendly)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── login/page.tsx              # Login page
│   │   ├── signup/page.tsx             # Sign-up page
│   │   ├── app/
│   │   │   ├── dashboard/page.tsx      # Dashboard overview
│   │   │   ├── analyze/page.tsx        # Transaction analyzer
│   │   │   ├── history/page.tsx        # Transaction history
│   │   │   └── billing/page.tsx        # Billing & plan management
│   │   ├── globals.css                 # Global styles & design tokens
│   │   └── layout.tsx                  # Root layout
│   ├── components/
│   │   ├── landing/
│   │   │   ├── HeroSection.tsx         # Hero with CTAs
│   │   │   ├── FeaturesSection.tsx     # Feature cards
│   │   │   └── PricingSection.tsx      # Pricing tiers
│   │   ├── app/
│   │   │   └── AppLayout.tsx           # Main app layout with sidebar
│   │   └── ui/
│   │       └── button.tsx              # Reusable Button component
│   └── lib/
│       └── utils.ts                    # Utility functions (cn helper)
├── tailwind.config.js                  # Tailwind configuration
├── postcss.config.mjs                  # PostCSS configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## 📄 Pages & Routes

### Public Pages
- `/` - Landing page with hero, features, and pricing
- `/login` - Authentication (email/password + social auth)
- `/signup` - Account creation

### App Pages (Post-Login)
- `/app/dashboard` - Welcome overview with usage stats
- `/app/analyze` - Transaction analyzer (core feature)
- `/app/history` - Transaction history table
- `/app/billing` - Plan management and billing

## 🎨 Design Tokens

All design tokens are defined in `globals.css` as CSS variables:

```css
--primary: 174 72% 50%;        /* Teal */
--destructive: 4 72% 56%;      /* Coral red */
--background: 222 47% 6%;      /* Deep navy */
--card: 222 47% 9%;            /* Navy medium */
--border: 217 33% 18%;         /* Slate border */
```

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Utilities**: class-variance-authority, tailwind-merge, clsx

## ✨ Key Features

### Landing Page
- Hero section with dual CTAs
- Trust indicators (no credit card, 5 free scans, 2-min setup)
- Feature cards (99% accuracy, sub-second latency, bank-grade security)
- Simple pricing (Free Starter, Pro Scale)

### Authentication
- Email/password login
- Social auth (Google, GitHub)
- Centered card layout with enterprise security aesthetic

### Dashboard
- Daily usage tracker with progress bar
- Quick stats (total scans, at-risk detected, accuracy rate)
- Quick action CTA to analyzer

### Transaction Analyzer
- Form inputs (amount, category, location, user ID)
- Real-time fraud detection simulation
- Animated circular risk gauge
- Status badge (HIGH RISK / SAFE)
- Analysis details panel

### Billing
- Current plan display with usage
- Pro upgrade section with feature comparison
- Payment method management

### History
- Sortable transaction table
- Risk score visualization
- Status badges per transaction
- Timestamp and category details

## 🎯 UX Principles

- Clear focus and hover states
- No distracting animations
- Calm, predictable transitions
- Designed for long analyst sessions
- Enterprise-ready, not consumer-facing

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "lucide-react": "latest",
    "tailwind-merge": "latest",
    "tailwindcss": "^4.x"
  }
}
```

## 🔐 Security & Compliance

- Enterprise dark-mode design for reduced eye strain
- Bank-grade security messaging
- SOC 2 compliant infrastructure positioning
- Professional, authoritative tone

## 📱 Responsive Design

- Desktop-first approach
- Mobile-optimized navigation
- Collapsible sidebar on small screens
- Touch-friendly interactions

## 🎨 Color Usage Guidelines

### Primary (Teal)
- CTAs and action buttons
- "Safe" transaction indicators
- Success states
- Progress bars

### Destructive (Coral Red)
- Fraud alerts
- High-risk indicators
- Destructive actions
- Warning states

### Avoid
- Purple-dominant palettes
- Neon or high-saturation gradients
- Playful or consumer-app styling

## 🚧 Future Enhancements

- Real API integration
- User authentication with JWT
- Real-time WebSocket updates
- Advanced analytics dashboard
- Custom risk threshold configuration
- Webhook integrations
- Export capabilities (CSV, PDF)
- Multi-language support

## 📝 License

Proprietary - FraudGuard AI Enterprise Platform

---

**Built for banks, payment processors, and FinTech risk teams.**


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
