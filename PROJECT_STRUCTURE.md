# Project Structure

```
TradeX/
├── README.md                    # Main project documentation
├── PROJECT_STRUCTURE.md         # This file - detailed structure
├── .gitignore                   # Git ignore rules
├── package.json                 # Root package.json with scripts
├── package-lock.json            # Lock file for root dependencies
├── server.js                    # Express backend server
│
├── Dashboard/                   # Next.js frontend application
│   ├── app/                     # App Router pages
│   │   ├── ai-assistant/        # AI chat interface
│   │   │   └── page.tsx
│   │   ├── api/                 # API routes
│   │   │   ├── forecast/        # Stock forecasting endpoints
│   │   │   │   └── [symbol]/
│   │   │   │       └── route.ts
│   │   │   ├── insight/         # Market insights endpoints
│   │   │   │   └── [symbol]/
│   │   │   │       └── route.ts
│   │   │   ├── stock/           # Stock data endpoints
│   │   │   │   └── [symbol]/
│   │   │   │       └── route.ts
│   │   │   └── user/            # User management
│   │   │       └── route.ts
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   ├── loading.tsx          # Loading component
│   │   ├── page.tsx             # Main dashboard page
│   │   ├── profile/             # User profile page
│   │   │   └── page.tsx
│   │   ├── settings/            # Application settings
│   │   │   └── page.tsx
│   │   ├── task-performance/    # Performance metrics
│   │   │   └── page.tsx
│   │   └── watchlist/           # Watchlist management
│   │       └── page.tsx
│   │
│   ├── components/              # Reusable UI components
│   │   ├── glowing-menu.tsx     # Animated menu component
│   │   ├── pixelated-background.tsx # Background component
│   │   ├── stock-analysis/      # Stock analysis components
│   │   │   ├── ai-insights.tsx
│   │   │   └── technical-indicators.tsx
│   │   ├── stock-chart.tsx      # Chart component
│   │   ├── stock-table.tsx      # Data table component
│   │   ├── theme-provider.tsx   # Theme management
│   │   ├── watchlist.tsx        # Watchlist component
│   │   └── ui/                  # Base UI components (Radix UI)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       ├── use-mobile.tsx
│   │       └── use-toast.ts
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── config.ts            # Configuration
│   │   ├── db.ts                # Database utilities
│   │   ├── gemini.ts            # AI integration
│   │   ├── stock-data.ts        # Data processing
│   │   └── utils.ts             # Helper functions
│   │
│   ├── public/                  # Static assets
│   │   ├── placeholder-logo.png
│   │   ├── placeholder-logo.svg
│   │   ├── placeholder-user.jpg
│   │   ├── placeholder.jpg
│   │   └── placeholder.svg
│   │
│   ├── styles/                  # Additional styles
│   │   ├── custom.css
│   │   └── globals.css
│   │
│   ├── types/                   # TypeScript definitions
│   │   ├── stock.ts             # Stock data types
│   │   └── yfinance.d.ts        # yfinance type definitions
│   │
│   ├── .gitignore               # Frontend git ignore
│   ├── components.json          # shadcn/ui configuration
│   ├── env.example              # Environment template
│   ├── next-env.d.ts            # Next.js types
│   ├── next.config.js           # Next.js configuration
│   ├── package.json             # Frontend dependencies
│   ├── package-lock.json        # Frontend lock file
│   ├── postcss.config.mjs       # PostCSS configuration
│   ├── tailwind.config.ts       # Tailwind CSS configuration
│   └── tsconfig.json            # TypeScript configuration
│
└── StockData/                   # CSV stock data files
    ├── 20MICRONS.csv
    ├── AARTIDRUGS.csv
    ├── AARTIIND.csv
    ├── AARVEEDEN.csv
    ├── ABAN.csv
    ├── ABB.csv
    ├── ABBOTINDIA.csv
    ├── ABHISHEK.csv
    ├── ACC.csv
    ├── ACE.csv
    ├── ADANIENT.csv
    ├── ADANIPOWER.csv
    └── ADFFOODS.csv
```

## Key Files Explained

### Root Level
- **README.md**: Main project documentation
- **package.json**: Root package with scripts to run both frontend and backend
- **server.js**: Express backend server for stock data
- **.gitignore**: Comprehensive git ignore rules

### Dashboard (Frontend)
- **app/**: Next.js App Router pages and API routes
- **components/**: Reusable UI components including shadcn/ui components
- **lib/**: Utility functions and configurations
- **types/**: TypeScript type definitions
- **public/**: Static assets

### StockData
- Contains CSV files with historical stock data
- Used by the backend server for data retrieval

## Development Workflow

1. **Install Dependencies**: `npm run install-deps`
2. **Start Development**: `npm run dev` (runs both frontend and backend)
3. **Build for Production**: `npm run build`
4. **Start Production**: `npm start`

## Environment Setup

Copy `Dashboard/env.example` to `Dashboard/.env.local` and add your API keys:
- `NEXT_PUBLIC_GEMINI_API_KEY`: Google Gemini AI API key
- `ALPHA_VANTAGE_API_KEY`: Alpha Vantage API key (optional)
