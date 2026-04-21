export const COMPANY = {
  name: "Kalinga Industries Pvt. Ltd.",
  code: "KI01",
  fiscalYear: "2025-26",
  period: "March 2026",
  currency: "INR"
};

export const GL_ACCOUNTS = [
  { code: "100000", name: "Cash and Cash Equivalents", type: "Asset" },
  { code: "110000", name: "Accounts Receivable", type: "Asset" },
  { code: "120000", name: "Inventory", type: "Asset" },
  { code: "150000", name: "Fixed Assets", type: "Asset" },
  { code: "155000", name: "Accumulated Depreciation", type: "Asset" },
  { code: "200000", name: "Accounts Payable", type: "Liability" },
  { code: "210000", name: "Accrued Liabilities", type: "Liability" },
  { code: "220000", name: "Short-Term Loans", type: "Liability" },
  { code: "300000", name: "Share Capital", type: "Equity" },
  { code: "310000", name: "Retained Earnings", type: "Equity" },
  { code: "400000", name: "Revenue from Operations", type: "Revenue" },
  { code: "410000", name: "Other Income", type: "Revenue" },
  { code: "500000", name: "Cost of Goods Sold", type: "Expense" },
  { code: "510000", name: "Salaries & Wages", type: "Expense" },
  { code: "520000", name: "Depreciation Expense", type: "Expense" },
  { code: "530000", name: "Rent Expense", type: "Expense" },
  { code: "540000", name: "Utilities Expense", type: "Expense" },
  { code: "550000", name: "Accrued Expenses", type: "Expense" },
  { code: "560000", name: "GR/IR Clearing Account", type: "Asset" },
  { code: "570000", name: "FX Revaluation Gain/Loss", type: "Revenue" },
];

export const FIXED_ASSETS = [
  { id: "A001", name: "Factory Machinery - Plant A", acquisitionValue: 5000000, accDepreciation: 1500000, method: "Straight-Line", usefulLife: 10, rate: 10 },
  { id: "A002", name: "IT Infrastructure & Servers", acquisitionValue: 1200000, accDepreciation: 600000, method: "Straight-Line", usefulLife: 5, rate: 20 },
  { id: "A003", name: "Office Building - HQ", acquisitionValue: 8000000, accDepreciation: 800000, method: "Straight-Line", usefulLife: 40, rate: 2.5 },
  { id: "A004", name: "Delivery Fleet (Vehicles)", acquisitionValue: 2400000, accDepreciation: 960000, method: "Declining Balance", usefulLife: 8, rate: 25 },
  { id: "A005", name: "Lab Equipment", acquisitionValue: 750000, accDepreciation: 225000, method: "Straight-Line", usefulLife: 10, rate: 10 },
];

export const COST_CENTERS = [
  { code: "CC100", name: "Manufacturing", type: "Production" },
  { code: "CC200", name: "Sales & Marketing", type: "Overhead" },
  { code: "CC300", name: "Human Resources", type: "Overhead" },
  { code: "CC400", name: "Information Technology", type: "Overhead" },
  { code: "CC500", name: "Finance & Accounting", type: "Overhead" },
];

export const INITIAL_GL_BALANCES = {
  "100000": 2450000,
  "110000": 3800000,
  "120000": 1200000,
  "150000": 17350000,
  "155000": -4085000,
  "200000": -2100000,
  "210000": -500000,
  "220000": -1500000,
  "300000": -5000000,
  "310000": -8215000,
  "400000": -6800000,
  "410000": -200000,
  "500000": 2400000,
  "510000": 850000,
  "520000": 0,
  "530000": 120000,
  "540000": 80000,
  "550000": 0,
  "560000": 150000,
  "570000": 0,
};

export const STEPS = [
  {
    id: 1,
    phase: "PRE-CLOSE",
    title: "Journal Entry Posting",
    tcode: "FB50 / F-02",
    description: "Record all business transactions — accruals, prepayments, corrections — into the General Ledger before period close.",
    color: "#1D4ED8"
  },
  {
    id: 2,
    phase: "PRE-CLOSE",
    title: "GR/IR & Open Item Clearance",
    tcode: "MR11 / F-44",
    description: "Match goods receipts against vendor invoices and clear all open items in sub-ledger accounts.",
    color: "#7C3AED"
  },
  {
    id: 3,
    phase: "PRE-CLOSE",
    title: "FX Revaluation",
    tcode: "FAGL_FC_VAL",
    description: "Revalue foreign currency open items at period-end exchange rates and post unrealized FX gains/losses.",
    color: "#0891B2"
  },
  {
    id: 4,
    phase: "CLOSE EXECUTION",
    title: "Depreciation Run (AFAB)",
    tcode: "AFAB",
    description: "Execute the asset depreciation run for all fixed assets in the company code for the current period.",
    color: "#D97706"
  },
  {
    id: 5,
    phase: "CLOSE EXECUTION",
    title: "Cost Allocation Cycles",
    tcode: "KSU5 / KSV5",
    description: "Run assessment/distribution cycles to allocate overhead cost center costs to production cost centers.",
    color: "#DB2777"
  },
  {
    id: 6,
    phase: "CLOSE EXECUTION",
    title: "Period Lock (OB52)",
    tcode: "OB52",
    description: "Lock the posting period to prevent unauthorized changes. Only period-end adjustment postings permitted.",
    color: "#059669"
  },
  {
    id: 7,
    phase: "REPORTING",
    title: "Financial Statements",
    tcode: "S_ALR_87012284",
    description: "Generate the Balance Sheet and Profit & Loss Statement for the closed period.",
    color: "#1B6B2F"
  },
];
