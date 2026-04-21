# SAP R2R Financial Close Simulator

> **Capstone Project — SAP Elective | 6th Semester**
> Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar

**Name:** Gyanesh Tiwary
**Roll Number:** 2306027
**Branch:** Information Technology
**Batch:** 2023–2027

---

## Overview

A fully interactive, browser-based simulator of the **Record-to-Report (R2R) Month-End and Year-End Financial Close** process using SAP FI/CO concepts.

The app guides users through all 7 steps of the R2R close cycle — from journal entry posting to final financial statement generation — simulating the exact SAP transaction flow a finance team executes during period-end.

---

## Live Demo

> Run locally using the steps below.

---

## Features

| Step | SAP T-Code | Description |
|------|-----------|-------------|
| 1 | FB50 / F-02 | General Ledger Journal Entry Posting |
| 2 | MR11 / F-44 | GR/IR Account Clearance |
| 3 | FAGL_FC_VAL | Foreign Currency Revaluation |
| 4 | AFAB | Fixed Asset Depreciation Run |
| 5 | KSU5 / KSV5 | Cost Center Allocation Cycles |
| 6 | OB52 | Period Lock with Prerequisites Check |
| 7 | S_ALR_87012284 | Balance Sheet & P&L Generation |

### Additional Highlights
- Live GL balance tracking across all steps
- Animated batch processing simulations
- Balanced journal entry validation (Dr = Cr)
- Real-time KPI dashboard (margins, profitability)
- Period lock enforces sequential close discipline
- INR currency, Indian company context

---

## Tech Stack

- **Frontend:** React 18 (Vite)
- **Styling:** Pure CSS with CSS Variables (no UI library)
- **State Management:** React useState
- **Fonts:** IBM Plex Sans + IBM Plex Mono (Google Fonts)
- **Build Tool:** Vite 5

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Gyanesh-Codes/r2r-financial-close-simulator.git
cd r2r-financial-close-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
r2r-simulator/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Step navigator
│   │   ├── JournalEntry.jsx    # Step 1: GL posting
│   │   ├── Steps2345.jsx       # Steps 2-5
│   │   └── Steps67.jsx         # Steps 6-7
│   ├── data/
│   │   └── appData.js          # GL accounts, assets, constants
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html
├── vite.config.js
└── package.json
```

---

## SAP Concepts Demonstrated

- **SAP FI (Financial Accounting):** GL postings, sub-ledger management, FX revaluation, asset accounting
- **SAP CO (Controlling):** Cost center assessment and distribution cycles
- **Universal Journal (ACDOCA):** Unified financial data model in SAP S/4HANA
- **Financial Statement Version (FSV):** Mapping GL accounts to BS/P&L line items
- **Period-End Close Discipline:** Enforced sequential steps with prerequisite validation

---

## License

MIT — For educational purposes.
