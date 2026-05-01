# UniCC Frontend Design Specification

> A comprehensive frontend design document for UniCC - a competitive programming stats aggregator platform.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [User Flow](#user-flow)
3. [Page Architecture](#page-architecture)
4. [Design Inspirations](#design-inspirations)
5. [Design System](#design-system)
6. [Component Structure](#component-structure)
7. [File Structure](#file-structure)
8. [Detailed Page Specifications](#detailed-page-specifications)
9. [Animation Guidelines](#animation-guidelines)
10. [Responsive Breakpoints](#responsive-breakpoints)

---

## Project Overview

### What is UniCC?

UniCC is a **competitive programming stats aggregator** that allows users to:

- View aggregated stats from multiple competitive programming platforms (LeetCode, Codeforces, CodeChef, AtCoder, etc.) in one place
- Search for any competitive programmer's profile without authentication
- Create their own unified CP profile by linking platform handles
- Share their combined stats via a public profile URL

### Core Value Proposition

"All Your Competitive Programming Stats in One Place"

### Target Audience

- Competitive programmers
- Coding interview candidates
- Recruiters looking up candidate profiles
- CP community members

---

## User Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                            USER FLOW DIAGRAM                             │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         ┌──────────────┐                                 │
│                         │   Landing    │                                 │
│                         │   Page (/)   │                                 │
│                         └──────┬───────┘                                 │
│                                │                                         │
│                                ▼                                         │
│                         ┌──────────────┐                                 │
│                         │   Search     │                                 │
│                         │   Profile    │                                 │
│                         └──────┬───────┘                                 │
│                                │                                         │
│                                ▼                                         │
│                         ┌──────────────┐                                 │
│                         │   Search     │     ┌──────────────┐            │
│                         │   Results    │────▶│   Profile    │            │
│                         │  /search?q=  │     │  /u/[user]   │            │
│                         └──────────────┘     └──────┬───────┘            │
│                                                     │                    │
│                               ┌─────────────────────┴─────────────┐      │
│                               │                                   │      │
│                               ▼                                   ▼      │
│                        ┌─────────────┐                    ┌─────────────┐│
│                        │   Limited   │                    │   Sign In   ││
│                        │   View      │                    │   Prompt    ││
│                        │   (Guest)   │                    └──────┬──────┘│
│                        └─────────────┘                           │       │
│                                                                  ▼       │
│                                                          ┌─────────────┐ │
│                                                          │    Auth     │ │
│                                                          │   (Clerk)   │ │
│                                                          └──────┬──────┘ │
│                                                                 │        │
│                                                                 ▼        │
│                                                          ┌─────────────┐ │
│                                                          │  Full View  │ │
│                                                          │  Unlocked   │ │
│                                                          └──────┬──────┘ │
│                                                                 │        │
│                               ┌─────────────────────────────────┘        │
│                               │                                          │
│                               ▼                                          │
│                  ┌────────────────────────┐                              │
│                  │   Protected Routes     │                              │
│                  ├────────────────────────┤                              │
│                  │  /dashboard            │                              │
│                  │  /settings             │                              │
│                  └────────────────────────┘                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Flow Description

1. **Landing Page** - User arrives, sees hero with search bar
2. **Search** - User searches for a username/handle
3. **Search Results** - Shows matching profiles
4. **Profile View (Guest)** - Limited stats visible, detailed analytics blurred
5. **Auth Prompt** - "Sign in to view full stats"
6. **Authentication** - Clerk handles sign in/sign up
7. **Full Profile View** - All stats unlocked
8. **Dashboard** - User can create/manage their own profile
9. **Settings** - User preferences, notifications, privacy

---

## Page Architecture

### Public Pages (No Auth Required)

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Landing Page | Hero, search, platform showcase, CTA |
| `/u/[username]` | Public Profile | View aggregated stats (limited for guests) |
| `/search` | Search Results | Display matching profiles from search query |

### Protected Pages (Auth Required)

| Route | Page | Purpose |
|-------|------|---------|
| `/dashboard` | Dashboard | Manage linked platforms, edit profile |
| `/settings` | Settings | Account, notifications, privacy preferences |

### Auth Pages (Clerk)

| Route | Page |
|-------|------|
| `/sign-in` | Sign In |
| `/sign-up` | Sign Up |

---

## Design Inspirations

### 1. Airbnb (airbnb.com)

**Key Elements to Adopt:**

- **Shrinking Header**
  - Sticky header that collapses on scroll
  - Smooth height transition animation
  - Search bar transforms from expanded to compact state
  
- **Pill-Based Navigation**
  - Rounded pill tabs for category switching
  - Horizontal scrollable on mobile
  - Active state with subtle background
  
- **Search Bar Behavior**
  - Expandable search with multiple fields
  - Collapses to single line on scroll
  - Animated placeholder text

**Implementation Notes:**

```
Header States:
├── Expanded (top of page)
│   └── Full height (~80px)
│   └── Large search bar
│   └── All navigation visible
│
└── Collapsed (on scroll)
    └── Reduced height (~64px)
    └── Compact search bar
    └── Condensed navigation
```

### 2. n8n.io

**Key Elements to Adopt:**

- **Hero Section**
  - Rotating/animated text ("IT Ops can... Sec Ops can...")
  - Large bold headline with gradient text
  - Social proof badges (GitHub stars, ratings)
  
- **Bento Grid Layout**
  - Asymmetric card sizes (2x2, 1x1, 2x1, etc.)
  - Cards contain actual product UI/screenshots
  - Subtle border with hover glow effect
  
- **Micro-Interactions**
  - Cards lift on hover (translateY + shadow)
  - Smooth color transitions
  - Animated icons within cards
  
- **Social Proof**
  - Partner/customer logos
  - Testimonials with real quotes
  - Community statistics

**Bento Grid Pattern:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌─────────────────────────┐  ┌──────┐  ┌──────┐   │
│  │                         │  │      │  │      │   │
│  │      Large Card         │  │ Med  │  │ Med  │   │
│  │       (2x2)             │  │(1x1) │  │(1x1) │   │
│  │                         │  │      │  │      │   │
│  └─────────────────────────┘  └──────┘  └──────┘   │
│                                                     │
│  ┌──────┐  ┌──────┐  ┌─────────────────────────┐   │
│  │      │  │      │  │                         │   │
│  │ Med  │  │ Med  │  │      Wide Card          │   │
│  │(1x1) │  │(1x1) │  │       (2x1)             │   │
│  │      │  │      │  │                         │   │
│  └──────┘  └──────┘  └─────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. Motion.dev

**Key Elements to Adopt:**

- **Typography**
  - Large, bold headlines (fluid sizing)
  - High contrast text hierarchy
  - Elegant letter-spacing
  
- **Animated Showcases**
  - Live animation demos embedded in page
  - Interactive examples users can play with
  - Smooth scroll-triggered reveals
  
- **Dark Theme Execution**
  - Deep black background (#000 or #0a0a0a)
  - Vibrant accent colors that pop
  - Subtle gradients for depth
  
- **Scroll Animations**
  - Elements fade in on scroll
  - Staggered animations for lists
  - Parallax effects on backgrounds
  
- **Button Styles**
  - Pill-shaped buttons
  - Hover states with scale + glow
  - Ghost and solid variants

---

## Design System

### Color Palette

```css
/* Base Colors */
--background: #0a0a0a;        /* Deep black background */
--foreground: #fafafa;        /* Primary text */
--muted: #a1a1aa;             /* Secondary text */
--muted-foreground: #71717a;  /* Tertiary text */

/* Card Colors */
--card: #18181b;              /* Card background */
--card-hover: #27272a;        /* Card hover state */
--card-border: #27272a;       /* Card border */

/* Accent Colors */
--primary: #ff6b35;           /* Primary orange (CTAs) */
--primary-hover: #ff8555;     /* Primary hover */

/* Platform-Specific Accents */
--leetcode: #ffa116;          /* LeetCode orange */
--codeforces: #1890ff;        /* Codeforces blue */
--codechef: #5b4638;          /* CodeChef brown */
--atcoder: #222222;           /* AtCoder black */
--hackerrank: #00ea64;        /* HackerRank green */
--hackerearth: #2c3454;       /* HackerEarth purple */

/* Status Colors */
--success: #22c55e;           /* Green */
--warning: #eab308;           /* Yellow */
--error: #ef4444;             /* Red */
--info: #3b82f6;              /* Blue */

/* Gradients */
--gradient-primary: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
--gradient-glow: radial-gradient(ellipse at center, rgba(255, 107, 53, 0.15) 0%, transparent 70%);
```

### Typography

```css
/* Font Families */
--font-sans: 'Inter', 'SF Pro Display', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes (Fluid) */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
--text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
--text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);
--text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3rem);
--text-5xl: clamp(3rem, 2rem + 5vw, 4.5rem);
--text-6xl: clamp(3.75rem, 2.5rem + 6.25vw, 6rem);

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.1;
--leading-snug: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;

/* Letter Spacing */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
```

### Spacing Scale

```css
/* Based on 4px grid */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Border Radius

```css
--radius-sm: 0.375rem;    /* 6px */
--radius-md: 0.5rem;      /* 8px */
--radius-lg: 0.75rem;     /* 12px */
--radius-xl: 1rem;        /* 16px */
--radius-2xl: 1.5rem;     /* 24px */
--radius-full: 9999px;    /* Pill shape */
```

### Shadows

```css
/* Elevation shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Glow shadows (for dark theme) */
--glow-sm: 0 0 10px rgba(255, 107, 53, 0.1);
--glow-md: 0 0 20px rgba(255, 107, 53, 0.15);
--glow-lg: 0 0 30px rgba(255, 107, 53, 0.2);
```

---

## Component Structure

### Layout Components

```
components/
├── layout/
│   ├── Header.tsx              # Shrinking header (Airbnb-style)
│   ├── Footer.tsx              # Site footer
│   ├── Container.tsx           # Max-width container
│   └── BentoGrid.tsx           # Bento grid layout wrapper
```

### UI Components

```
components/
├── ui/
│   ├── Button.tsx              # Pill buttons with variants
│   ├── Card.tsx                # Base card with hover effects
│   ├── Input.tsx               # Form inputs
│   ├── SearchBar.tsx           # Expandable search (Airbnb-style)
│   ├── PillTabs.tsx            # Horizontal pill navigation
│   ├── Badge.tsx               # Status badges
│   ├── Avatar.tsx              # User avatars
│   ├── Skeleton.tsx            # Loading skeletons
│   └── BlurOverlay.tsx         # For limited view blur effect
```

### Feature Components

```
components/
├── landing/
│   ├── Hero.tsx                # Hero with rotating text
│   ├── PlatformShowcase.tsx    # Platform logos grid
│   ├── HowItWorks.tsx          # 3-step explanation
│   ├── FeaturedProfiles.tsx    # Example profile cards
│   └── CTASection.tsx          # Call to action
│
├── profile/
│   ├── ProfileHeader.tsx       # Avatar, name, bio
│   ├── StatsOverview.tsx       # Total problems, rating cards
│   ├── PlatformCard.tsx        # Individual platform stats
│   ├── ActivityHeatmap.tsx     # GitHub-style calendar
│   ├── RatingChart.tsx         # Rating history timeline
│   ├── LimitedOverlay.tsx      # Blur + sign in prompt
│   └── ShareButton.tsx         # Copy profile link
│
├── dashboard/
│   ├── ProfileEditor.tsx       # Edit name, bio, avatar
│   ├── PlatformManager.tsx     # Link/unlink platforms
│   ├── SyncStatus.tsx          # Sync status indicators
│   └── PublicPreview.tsx       # Preview public profile
│
├── search/
│   ├── SearchResults.tsx       # Results grid
│   ├── ProfilePreviewCard.tsx  # Compact profile card
│   └── EmptyState.tsx          # No results found
│
└── settings/
    ├── AccountSettings.tsx     # Email, password
    ├── NotificationSettings.tsx # Email preferences
    └── PrivacySettings.tsx     # Profile visibility
```

---

## File Structure

```
app/
├── (public)/
│   ├── page.tsx                # Landing page
│   ├── search/
│   │   └── page.tsx            # Search results
│   └── u/
│       └── [username]/
│           └── page.tsx        # Public profile
│
├── (protected)/
│   ├── layout.tsx              # Auth wrapper
│   ├── dashboard/
│   │   └── page.tsx            # User dashboard
│   └── settings/
│       └── page.tsx            # Settings page
│
├── api/
│   ├── profiles/
│   │   ├── route.ts            # CRUD profiles
│   │   ├── [username]/
│   │   │   └── route.ts        # Get specific profile
│   │   └── search/
│   │       └── route.ts        # Search profiles
│   ├── platforms/
│   │   ├── route.ts            # Platform operations
│   │   ├── sync/
│   │   │   └── route.ts        # Sync platform data
│   │   └── [platform]/
│   │       └── route.ts        # Platform-specific ops
│   └── stats/
│       └── route.ts            # Aggregated stats
│
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles + design tokens
└── not-found.tsx               # 404 page

components/
├── layout/                     # Layout components
├── ui/                         # Base UI components
├── landing/                    # Landing page sections
├── profile/                    # Profile components
├── dashboard/                  # Dashboard components
├── search/                     # Search components
└── settings/                   # Settings components

lib/
├── utils.ts                    # Utility functions
├── constants.ts                # Platform data, colors
└── animations.ts               # Framer Motion variants

hooks/
├── useScrollHeader.ts          # Shrinking header hook
├── usePlatformSync.ts          # Platform sync hook
└── useAnimateOnScroll.ts       # Scroll animation hook

types/
├── profile.ts                  # Profile types
├── platform.ts                 # Platform types
└── stats.ts                    # Stats types
```

---

## Detailed Page Specifications

### 1. Landing Page (`/`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  HEADER (Shrinking on scroll)                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Logo          [Search...]           [Sign In] [Create Profile] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  HERO SECTION                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │           All Your Competitive Programming                     │   │
│  │              Stats in One Place                                │   │
│  │                                                                 │   │
│  │    Search profiles from [LeetCode] [Codeforces] [CodeChef]     │   │
│  │                    ↑ rotating text                              │   │
│  │                                                                 │   │
│  │         ┌─────────────────────────────────────┐                │   │
│  │         │ 🔍  Search username or handle...    │                │   │
│  │         └─────────────────────────────────────┘                │   │
│  │                                                                 │   │
│  │              [Create Your Profile →]                           │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PLATFORM LOGOS                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │   [LC]    [CF]    [CC]    [AC]    [HR]    [HE]    [+more]      │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  HOW IT WORKS                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │   ┌─────────┐      ┌─────────┐      ┌─────────┐                │   │
│  │   │    1    │      │    2    │      │    3    │                │   │
│  │   │ Search  │  →   │  View   │  →   │  Share  │                │   │
│  │   │ Profile │      │  Stats  │      │  Link   │                │   │
│  │   └─────────┘      └─────────┘      └─────────┘                │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FEATURED PROFILES (Bento Grid)                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  ┌───────────────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │                   │  │          │  │          │             │   │
│  │  │   Featured User   │  │ Profile  │  │ Profile  │             │   │
│  │  │   @tourist        │  │   #2     │  │   #3     │             │   │
│  │  │   [Stats Preview] │  │          │  │          │             │   │
│  │  │                   │  │          │  │          │             │   │
│  │  └───────────────────┘  └──────────┘  └──────────┘             │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CTA SECTION                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │          Ready to showcase your CP journey?                    │   │
│  │                                                                 │   │
│  │              [Create Your Profile →]                           │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FOOTER                                                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Public Profile Page (`/u/[username]`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ← Back to Search       Logo              [Sign In] [Share]     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
├──────────────────────��──────────────────────────────────────────────────┤
│                                                                         │
│  PROFILE HEADER                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │     ┌─────────┐                                                │   │
│  │     │         │    @username                                   │   │
│  │     │ Avatar  │    Full Name                                   │   │
│  │     │         │    "Bio text goes here..."                     │   │
│  │     └─────────┘    [GitHub] [Twitter] [Website]                │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  STATS OVERVIEW (Always visible)                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │ Total Solved │  │ Best Rating  │  │   Contests   │          │   │
│  │  │    1,247     │  │    1,892     │  │     127      │          │   │
│  │  │  problems    │  │  Codeforces  │  │  attended    │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PLATFORM CARDS (Bento Grid - Always visible)                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │   │
│  │  │   LeetCode     │  │   Codeforces   │  │   CodeChef     │    │   │
│  │  │   ──────────   │  │   ──────────   │  │   ──────────   │    │   │
│  │  │   [LC Icon]    │  │   [CF Icon]    │  │   [CC Icon]    │    │   │
│  │  │                │  │                │  │                │    │   │
│  │  │   532 solved   │  │   1,892 rating │  │   1,650 rating │    │   │
│  │  │   @handle      │  │   @handle      │  │   @handle      │    │   │
│  │  │   [View →]     │  │   [View →]     │  │   [View →]     │    │   │
│  │  └────────────────┘  └────────────────┘  └────────────────┘    │   │
│  │                                                                 │   │
│  │  ┌────────────────┐  ┌────────────────┐                        │   │
│  │  │    AtCoder     │  │   HackerRank   │                        │   │
│  │  │   ──────────   │  │   ──────────   │                        │   │
│  │  │   1,200 rating │  │   Gold Badge   │                        │   │
│  │  │   @handle      │  │   @handle      │                        │   │
│  │  └────────────────┘  └────────────────┘                        │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  DETAILED ANALYTICS (Blurred for guests)                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │                                                                 │   │
│  │                 ┌─────────────────────────┐                    │   │
│  │                 │  🔒 Sign in to unlock   │                    │   │
│  │                 │  full analytics         │                    │   │
│  │                 │                         │                    │   │
│  │                 │  [Sign In] [Sign Up]    │                    │   │
│  │                 └─────────────────────────┘                    │   │
│  │                                                                 │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  CONTENTS BEHIND BLUR:                                                  │
│  - Activity Heatmap (GitHub-style)                                      │
│  - Rating History Chart (multi-platform timeline)                       │
│  - Problem Distribution (difficulty breakdown)                          │
│  - Contest Performance History                                          │
│  - Language Statistics                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3. Dashboard Page (`/dashboard`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Logo    [Dashboard] [Settings]              [@user] [Sign Out] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BENTO GRID DASHBOARD                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  ┌───────────────────────────────┐  ┌─────────────┐            │   │
│  │  │                               │  │             │            │   │
│  │  │      YOUR PROFILE (2x2)       │  │  LeetCode   │            │   │
│  │  │      ─────────────────        │  │  ─────────  │            │   │
│  │  │                               │  │  [LC icon]  │            │   │
│  │  │  ┌────────┐                   │  │             │            │   │
│  │  │  │ Avatar │  @username        │  │  532 probs  │            │   │
│  │  │  │  [📷]  │  Full Name        │  │  @handle    │            │   │
│  │  │  └────────┘  "Your bio..."    │  │             │            │   │
│  │  │                               │  │  ● Synced   │            │   │
│  │  │  [Edit Profile]               │  │  [Sync Now] │            │   │
│  │  │                               │  └─────────────┘            │   │
│  │  │  ────────────────────────     │  ┌─────────────┐            │   │
│  │  │  Public Profile:              │  │             │            │   │
│  │  │  unicc.dev/u/username         │  │ Codeforces  │            │   │
│  │  │  [View Public] [Copy Link]    │  │  ─────────  │            │   │
│  │  │                               │  │  1892 rtg   │            │   │
│  │  └───────────────────────────────┘  │  @handle    │            │   │
│  │                                     │             │            │   │
│  │  ┌─────────────┐  ┌─────────────┐  │  ● Synced   │            │   │
│  │  │             │  │             │  │  [Sync Now] │            │   │
│  │  │  CodeChef   │  │   AtCoder   │  └─────────────┘            │   │
│  │  │  ─────────  │  │  ─────────  │                             │   │
│  │  │  1650 rtg   │  │  1200 rtg   │  ┌─────────────────────────┐│   │
│  │  │  @handle    │  │  @handle    │  │                         ││   │
│  │  │             │  │             │  │  + Link New Platform    ││   │
│  │  │  ● Synced   │  │  ○ Not set  │  │                         ││   │
│  │  │  [Sync Now] │  │  [Connect]  │  │  Connect more platforms ││   │
│  │  └─────────────┘  └─────────────┘  │  to your profile        ││   │
│  │                                     │                         ││   │
│  │  ┌───────────────────────────────────────────────────────────┐│   │
│  │  │                                                           ││   │
│  │  │        ACTIVITY OVERVIEW (Wide Card 3x1)                  ││   │
│  │  │        ─────────────────────────────────                  ││   │
│  │  │                                                           ││   │
│  │  │  ░▓▓░░▓▓▓░░░▓▓░░▓▓▓▓░░▓░░░▓▓▓░░░▓▓░░▓▓▓░░░▓▓░░▓          ││   │
│  │  │  ░░▓░░▓░▓░░░░▓░░▓░░░▓░░▓░░░░▓▓░░░░▓░░▓░▓░░░░▓░░░          ││   │
│  │  │  ░▓▓░░░▓░░░▓▓▓░░░▓▓▓░░░▓▓░░░░▓░░▓▓▓░░░▓░░░▓▓▓░░░          ││   │
│  │  │                                                           ││   │
│  │  │  Total: 1,247 problems | Current Streak: 15 days          ││   │
│  │  │                                                           ││   │
│  │  └───────────────────────────────────────────────────────────┘│   │
│  │                                                                │   │
│  ��────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4. Settings Page (`/settings`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Logo    [Dashboard] [Settings]              [@user] [Sign Out] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SETTINGS                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  Settings                                                       │   │
│  │  ════════                                                       │   │
│  │                                                                 │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │  ACCOUNT                                                  │ │   │
│  │  │  ───────                                                  │ │   │
│  │  │                                                           │ │   │
│  │  │  Email                                                    │ │   │
│  │  │  ┌─────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ user@example.com                                    │ │ │   │
│  │  │  └─────────────────────────────────────────────────────┘ │ │   │
│  │  │                                                           │ │   │
│  │  │  Username                                                 │ │   │
│  │  │  ┌─────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ @username                                           │ │ │   │
│  │  │  └─────────────────────────────────────────────────────┘ │ │   │
│  │  │                                                           │ │   │
│  │  │  [Change Password]                                        │ │   │
│  │  │                                                           │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │  NOTIFICATIONS                                            │ │   │
│  │  │  ─────────────                                            │ │   │
│  │  │                                                           │ │   │
│  │  │  Email Notifications                                      │ │   │
│  │  │  ┌──────┐                                                │ │   │
│  │  │  │ [ON] │ Receive weekly stats summary                   │ │   │
│  │  │  └──────┘                                                │ │   │
│  │  │  ┌──────┐                                                │ │   │
│  │  │  │ [OFF]│ Notify when someone views my profile           │ │   │
│  │  │  └──────┘                                                │ │   │
│  │  │  ┌──────┐                                                │ │   │
│  │  │  │ [ON] │ Rating change alerts                           │ │   │
│  │  │  └──────┘                                                │ │   │
│  │  │                                                           │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │  PRIVACY                                                  │ │   │
│  │  │  ───────                                                  │ │   │
│  │  │                                                           │ │   │
│  │  │  Profile Visibility                                       │ │   │
│  │  │  ┌──────┐                                                │ │   │
│  │  │  │ [◉] │ Public (anyone can view)                        │ │   │
│  │  │  └──────┘                                                │ │   │
│  │  │  ┌──────┐                                                │ │   │
│  │  │  │ [○] │ Private (only you can view)                     │ │   │
│  │  │  └──────┘                                                │ │   │
│  │  │                                                           │ │   │
│  │  │  Show on Search                                           │ │   │
│  │  │  ┌──────┐                                                │ │   │
│  │  │  │ [ON] │ Allow profile to appear in search results      │ │   │
│  │  │  └──────┘                                                │ │   │
│  │  │                                                           │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │  DANGER ZONE                                              │ │   │
│  │  │  ───────────                                              │ │   │
│  │  │                                                           │ │   │
│  │  │  [Delete Account]                                         │ │   │
│  │  │  This will permanently delete your profile and all data.  │ │   │
│  │  │                                                           │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Animation Guidelines

### Framer Motion Variants

```typescript
// Fade in on scroll
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Staggered children
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Card hover effect
export const cardHover = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: "0 0 0 rgba(255, 107, 53, 0)"
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    boxShadow: "0 10px 30px rgba(255, 107, 53, 0.15)",
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// Header shrink
export const headerShrink = {
  expanded: { height: 80 },
  collapsed: { 
    height: 64,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

// Text rotation (for hero)
export const textRotation = {
  enter: { y: 20, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

// Blur reveal (for limited content)
export const blurReveal = {
  blurred: { filter: "blur(8px)", opacity: 0.5 },
  clear: { 
    filter: "blur(0px)", 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};
```

### Animation Principles

1. **Subtlety** - Animations should enhance, not distract
2. **Performance** - Use `transform` and `opacity` only (GPU accelerated)
3. **Timing** - 200-500ms for most transitions
4. **Easing** - `easeOut` for enters, `easeIn` for exits
5. **Purpose** - Every animation should have meaning

### Scroll-Triggered Animations

```typescript
// Use Intersection Observer for scroll reveals
const scrollRevealConfig = {
  threshold: 0.1,
  triggerOnce: true,
  rootMargin: "-50px"
};
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */

/* Small (mobile) - default styles */
/* No media query needed */

/* Medium (tablet) */
@media (min-width: 768px) {
  /* md: breakpoint */
}

/* Large (desktop) */
@media (min-width: 1024px) {
  /* lg: breakpoint */
}

/* Extra large (wide desktop) */
@media (min-width: 1280px) {
  /* xl: breakpoint */
}

/* 2XL (ultrawide) */
@media (min-width: 1536px) {
  /* 2xl: breakpoint */
}
```

### Bento Grid Responsive Behavior

```css
/* Mobile: Single column */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large cards span multiple columns */
.bento-card-large {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .bento-card-large {
    grid-column: span 2;
  }
}

.bento-card-wide {
  grid-column: span 1;
}

@media (min-width: 1024px) {
  .bento-card-wide {
    grid-column: span 3;
  }
}
```

---

## Platform Data Reference

```typescript
export const PLATFORMS = {
  leetcode: {
    name: "LeetCode",
    color: "#ffa116",
    icon: "leetcode-icon",
    url: "https://leetcode.com",
    metrics: ["problems_solved", "ranking", "acceptance_rate"]
  },
  codeforces: {
    name: "Codeforces",
    color: "#1890ff",
    icon: "codeforces-icon",
    url: "https://codeforces.com",
    metrics: ["rating", "max_rating", "rank", "contests"]
  },
  codechef: {
    name: "CodeChef",
    color: "#5b4638",
    icon: "codechef-icon",
    url: "https://codechef.com",
    metrics: ["rating", "stars", "problems_solved"]
  },
  atcoder: {
    name: "AtCoder",
    color: "#222222",
    icon: "atcoder-icon",
    url: "https://atcoder.jp",
    metrics: ["rating", "rank", "contests"]
  },
  hackerrank: {
    name: "HackerRank",
    color: "#00ea64",
    icon: "hackerrank-icon",
    url: "https://hackerrank.com",
    metrics: ["badges", "certifications", "score"]
  },
  hackerearth: {
    name: "HackerEarth",
    color: "#2c3454",
    icon: "hackerearth-icon",
    url: "https://hackerearth.com",
    metrics: ["rating", "problems_solved"]
  }
};
```

---

## Summary Checklist

### Before Development
- [ ] Set up design tokens in `globals.css`
- [ ] Configure fonts (Inter + JetBrains Mono)
- [ ] Install Framer Motion
- [ ] Set up dark theme as default

### Pages to Build
- [ ] Landing Page (`/`)
- [ ] Search Results (`/search`)
- [ ] Public Profile (`/u/[username]`)
- [ ] Dashboard (`/dashboard`)
- [ ] Settings (`/settings`)

### Key Components
- [ ] Shrinking Header (Airbnb-style)
- [ ] Expandable Search Bar
- [ ] Bento Grid Layout
- [ ] Platform Cards
- [ ] Activity Heatmap
- [ ] Rating Chart
- [ ] Limited View Overlay

### Animations to Implement
- [ ] Header shrink on scroll
- [ ] Card hover effects
- [ ] Scroll reveal animations
- [ ] Text rotation in hero
- [ ] Blur reveal transition

---

*Document Version: 1.0*
*Last Updated: 2026*
*Project: UniCC - Competitive Programming Stats Aggregator*