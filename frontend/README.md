# FraudGuard AI - Frontend

Enterprise-grade FinTech Micro-SaaS frontend for AI-powered fraud detection.

## 🎨 Design System

### Theme
- **Primary Background**: Deep navy blues (`#0a0e1a`, `#0f1729`)
- **Secondary Surfaces**: Charcoal and slate greys
- **Success/Safe**: Electric teal (`#06b6d4`, `#22d3ee`)
- **Risk/Danger**: Coral red (`#f87171`, `#dc2626`)
- **Typography**: Inter font family
- **Visual Style**: Dark mode with glassmorphism effects

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── login/page.tsx              # Login page
│   │   ├── signup/page.tsx             # Signup page
│   │   └── dashboard/
│   │       ├── page.tsx                # Dashboard overview
│   │       ├── analyze/page.tsx        # Transaction analyzer
│   │       ├── history/page.tsx        # Transaction history
│   │       └── billing/page.tsx        # Billing & plans
│   ├── components/
│   │   └── AppLayout.tsx               # Main dashboard layout
│   └── globals.css                     # Global styles & theme
```

## 🚀 Features

### Public Pages
- **Landing Page**: Hero section, features grid, pricing comparison
- **Authentication**: Login and signup with social auth options

### Dashboard (Post-Login)
- **Overview**: Welcome header, usage tracker, stats cards, recent activity
- **Transaction Analyzer**: Input form with real-time fraud detection results
- **History**: Searchable table of all scanned transactions
- **Billing**: Plan management, usage tracking, upgrade options

## 🎯 Key Components

### Navigation
- Persistent sidebar with logo and nav items
- User profile section at bottom
- Top header with notifications and settings

### Cards & Glassmorphism
- Frosted glass effect on all cards
- Subtle borders and soft shadows
- Smooth hover and focus states

### Forms
- Clean input fields with focus states
- Disabled and loading states
- Real-time validation feedback

### Data Visualization
- Progress bars for usage tracking
- Circular gauge for risk scores
- Animated result reveals

## 🛠 Tech Stack

- **Framework**: Next.js 16
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4.1
- **TypeScript**: 5.x
- **Font**: Inter (Google Fonts)

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎨 Color Reference

```css
/* Navy Blues */
--navy-950: #0a0e1a
--navy-900: #0f1729
--navy-800: #1a2235
--navy-700: #243047

/* Slate Greys */
--slate-800: #1e293b
--slate-700: #334155
--slate-600: #475569
--slate-500: #64748b

/* Teal (Success/Safe) */
--teal-400: #22d3ee
--teal-500: #06b6d4
--teal-600: #0891b2

/* Coral (Risk/Warning) */
--coral-400: #fca5a5
--coral-500: #f87171
--coral-600: #dc2626
```

## 🔐 Security Features

- Bank-grade 256-bit encryption
- SOC 2 Type II compliance messaging
- Secure authentication flow
- Enterprise-focused design

## 📱 Responsive Design

- Desktop-first approach
- Mobile-friendly layouts
- Collapsible sidebar
- Responsive tables and cards

## ✨ UI/UX Highlights

- **Calm & Authoritative**: Enterprise-grade feel
- **Data-Rich**: Comprehensive analytics displays
- **Smooth Transitions**: Professional animations
- **Clear Hierarchy**: Well-organized information architecture
- **Trust Indicators**: Security badges and certifications

## 🎯 Target Users

- Banks
- Payment processors
- FinTech risk teams
- Enterprise fraud prevention teams

---

**Note**: This is a frontend implementation. Backend API integration points are ready for connection.
