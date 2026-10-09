# FinEdu Builder - Interactive Financial Education & Curriculum Authoring Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-22%20Passed-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)

FinEdu Builder is a production-quality, modern, fully functional financial literacy platform and curriculum authoring web application. It empowers learners to master personal finance and investing concepts through interactive lessons, dynamic calculation sandboxes, real-time calculators, auto-graded quizzes, and gamified progress tracking, while providing financial educators and creators with a visual Module Builder to craft custom educational programs.

---

## ⚡ How to Start the Project (Quick Start Guide)

Follow these simple steps to run the application on your local machine:

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: v18.0.0 or newer (`node -v`)
- **npm**: v9.0.0 or newer (`npm -v`)

---

### 2. Step-by-Step Setup

#### Step 1: Open Terminal & Navigate to Project Directory
```powershell
cd C:\Users\Dell\.gemini\antigravity-ide\scratch\financial-education-builder
```

#### Step 2: Install Dependencies (if not already installed)
```powershell
npm install --legacy-peer-deps
```

#### Step 3: Start the Development Server
```powershell
npm run dev
```

#### Step 4: Open in Your Browser
Once started, open your web browser and navigate to:
```
http://localhost:3001
```
*(If port 3001 is already occupied by another app, you can start on another port: `npx next dev -p 3002` or `npx next dev -p 4321`)*

---

### 3. All Available NPM Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server on port **3001** with Hot Module Replacement (HMR) |
| `npm test` | Runs all 22 automated Vitest unit and integration test suites |
| `npm run test:watch` | Runs test runner in interactive watch mode for TDD |
| `npm run build` | Compiles an optimized, production-ready static/SSR build |
| `npm run start` | Runs the compiled production build locally on port 3001 |
| `npm run lint` | Runs ESLint static code analysis checks |

---

## 🌟 Application Core Features & Tour

### 1. 📊 Learning Dashboard
- **Personalized Learner Overview**: Shows your current rank, XP progress bar, active study streak (days), and focused learning timer.
- **Continue Learning**: Automatically detects your last accessed lesson and provides a 1-click **Resume** button.
- **Curriculum Catalog**: Displays all modules with progress rings, completion status, and difficulty badges (*Beginner*, *Intermediate*, *Advanced*).

### 2. 🎓 9 Preloaded Financial Education Modules
Contains full multi-lesson educational tracks, interactive calculation sandboxes, examples, and key takeaways:
1. **Stock Market Basics**: Shares, primary vs secondary markets, order books, bid-ask spread, and execution types (Market, Limit, Stop-Loss).
2. **Investing Fundamentals**: Equities vs Fixed Income vs Cash, Dollar-Cost Averaging (DCA), and inflation resilience.
3. **Compounding & Time Value of Money**: Linear vs exponential growth, compounding frequency, and Rule of 72 doubling calculations.
4. **Mutual Funds & ETFs**: Active funds vs passive index funds, Net Asset Value (NAV), expense ratios, and Systematic Investment Plans (SIP).
5. **Risk & Return**: Systematic vs unsystematic risk, standard deviation volatility, risk profiling, and the Sharpe ratio.
6. **Portfolio Diversification**: Modern Portfolio Theory (MPT), asset correlation matrix, rebalancing, and core-satellite asset allocation.
7. **Financial Ratios & Valuation**: Price-to-Earnings (P/E), PEG ratio, Debt-to-Equity (D/E), Return on Equity (ROE), and Current Ratio.
8. **Personal Finance & Wealth Building**: 50/30/20 budgeting rule, emergency reserve anchors, and Debt Avalanche vs Debt Snowball strategies.
9. **Market Terminology & Corporate Actions**: Cash dividends, stock splits (2-for-1, 3-for-1), share buybacks, and market capitalization tiers.

### 3. ⚡ Interactive Lesson Viewer
- **Live In-Lesson Sandboxes**: Adjust interest rates, principal amounts, or PE ratios right inside the lesson to see math update live.
- **Table of Contents**: Quick jumping between sections with reading time estimates.
- **Personal Lesson Notes**: In-app private study notes persisted automatically to `localStorage`.
- **Bookmarks & Completion**: Mark lessons as completed to trigger XP gain (+50 XP) and update curriculum progress.
- **Direct Quiz Access**: Launch the associated quiz at the end of each lesson.

### 4. 🧮 5 Interactive Financial Calculators
1. **Compound Interest Simulator**:
   - Sliders for Initial Principal, Monthly Contribution, Frequency, Rate (%), and Duration (1–40 years).
   - Real-time inflation toggle (calculates both nominal & purchasing-power adjusted future value).
   - Interactive SVG growth area chart and year-by-year amortization breakdown.
2. **SIP Wealth Planner**:
   - Monthly installments, expected annual return %, and annual step-up % adjustment.
   - Interactive asset breakdown donut chart.
3. **Loan EMI & Payoff Calculator**:
   - Presets for Home Loan, Auto Loan, and Personal Loan.
   - Monthly EMI calculation, total interest payable, loan payoff timeline, and annual amortization schedule.
4. **CAGR & Return Calculator**:
   - Calculates Compound Annual Growth Rate (CAGR) and total absolute return % over arbitrary holding periods.
5. **Portfolio Risk & Asset Allocation Profiler**:
   - Dynamic 4-asset allocation sliders (*Equities*, *Bonds*, *Gold*, *Cash*).
   - Interactive donut chart, expected return, volatility standard deviation, Sharpe ratio calculation, and **2008 Financial Crisis historical crash stress testing**.

### 5. 📝 Auto-Graded Quizzes
- Multiple-choice and True/False questions.
- Instant submission feedback with color-coded answer validation.
- Deep explanations for each option explaining the financial rationale.
- Dynamic scoring, 70% passing threshold, and **Canvas Confetti** celebration on passing.
- Retake mode with high score tracking.

### 6. 🛠️ Module Builder / Authoring Studio (Creator Mode)
- **Module Metadata Editor**: Title, slug, description, category, level, icon, and estimated duration.
- **Lesson Manager**: Add, delete, and reorder lessons with Up/Down buttons.
- **Section Builder**: Multi-section authoring with rich educational text and key takeaway highlights.
- **Quiz Creator**: Create MCQ and True/False questions, define options, designate correct answers, assign point weights, and write post-submission explanations.
- **Student Live Preview Mode**: Preview and test lessons interactively before publishing.
- **JSON Import & Export**: Export entire curricula to `.json` files or import existing courses.

### 7. 🏆 Gamification Hub
- **6 Rank Tiers**: *Novice Investor*, *Finance Apprentice*, *Market Strategist*, *Portfolio Architect*, *Chief Financial Officer*, and *Legendary Fund Manager*.
- **XP Reward Engine**: Earn points for lesson completions (+50 XP), passing quizzes (+75 XP), perfect scores (+50 XP), and authoring modules (+100 XP).
- **12 Unlockable Badges**: Milestone badges with rarity tiers (*Common*, *Rare*, *Epic*, *Legendary*).

### 8. 🔍 Search & Accessibility
- **Global Command Palette (`Ctrl+K` / `Cmd+K`)**: Instant search dialog across all modules, lessons, and calculators.
- **Filters**: Filter curriculum by difficulty level, category, and completion status.
- **Dark / Light Mode**: Seamless theme toggle persisted across sessions.
- **Accessible & Responsive**: Fully responsive across mobile, tablet, and desktop screens.

---

## 🧪 Running Automated Tests

FinEdu Builder includes a comprehensive Vitest test suite covering financial formulas, quiz scoring, progress persistence, and interactive UI components.

To execute all tests:
```powershell
npm test
```

### Test Suite Summary
```
 ✓ __tests__/financialMath.test.ts (11 tests)
 ✓ __tests__/quizScoring.test.ts (3 tests)
 ✓ __tests__/storeProgress.test.ts (6 tests)
 ✓ __tests__/components.test.tsx (2 tests)

 Test Files  4 passed (4)
      Tests  22 passed (22)
```

---

## 📁 Project Architecture & Directory Layout

```
financial-education-builder/
├── app/
│   ├── globals.css              # Tailwind base styles, dark mode tokens & glassmorphism
│   ├── layout.tsx               # Root layout with metadata and fonts
│   └── page.tsx                 # Main application view switcher & controller
├── components/
│   ├── achievements/
│   │   └── AchievementsView.tsx # Gamification hub, badge grid, and study stats
│   ├── builder/
│   │   └── ModuleBuilder.tsx    # Admin curriculum creator, quiz authoring & JSON export
│   ├── calculators/
│   │   └── CalculatorsView.tsx  # 5 interactive financial calculation tools
│   ├── charts/
│   │   ├── InteractiveGrowthChart.tsx # Responsive SVG area/line growth visualizer
│   │   └── PortfolioDonutChart.tsx    # Responsive SVG asset allocation donut chart
│   ├── dashboard/
│   │   └── DashboardView.tsx    # Main learning hub, stats, continue learning widget
│   ├── lesson/
│   │   └── LessonViewer.tsx     # Interactive reader with inline sandboxes & notes
│   ├── modules/
│   │   └── ModulesView.tsx      # Curriculum catalog with search and filters
│   ├── quiz/
│   │   └── QuizRunner.tsx       # Auto-graded quiz runner with instant feedback
│   ├── search/
│   │   └── CommandPalette.tsx   # Ctrl+K quick command menu & search dialog
│   └── ui/
│       ├── Navbar.tsx           # Top navigation bar with XP counter, streak & timer
│       ├── Sidebar.tsx          # Sidebar menu with progress indicator
│       └── ToastContainer.tsx   # Animated XP and badge unlock toast alerts
├── lib/
│   ├── badges.ts                # 12 badge definitions, unlock rules & rank scaling
│   ├── defaultModules.ts        # 9 preloaded curated financial education modules
│   ├── financialMath.ts         # Pure mathematical calculation functions
│   └── store.ts                 # Persistent Zustand store with localStorage sync
├── types/
│   └── index.ts                 # TypeScript data models and interfaces
├── __tests__/                   # 4 automated test suites
├── ARCHITECTURE.md              # Detailed architecture, mathematical formulas & data flows
└── README.md                    # Project overview & startup guide
```

---

## 🔒 Educational Disclaimer

FinEdu Builder is designed solely for educational, simulation, and training purposes. The calculations, simulations, and financial examples provided within lessons and tools do not constitute certified financial, legal, or investment advice.
