export const LOCAL_STORAGE_KEY = "projects";
export const LOCAL_STORAGE_TOKEN = "token";
export const LOCAL_STORAGE_COMPANIES = "companies";
export const LOCAL_STORAGE_COMPANY = "company";
export const LOCAL_STORAGE_COMPANY_ID = "companyID";
export const LOCAL_STORAGE_COLLAPSED = "collapsed";
export const LOCAL_STORAGE_DATERANGE = "daterange";
export const LOCAL_STORAGE_DEFAULT_CHANNEL = "defaultChannel";
export const LOCAL_STORAGE_DEFAULT_WHATSAPP_SESSION = "defaultWhatsappSession";
export const Q1 = "Q1"
export const Q2 = "Q2"
export const Q3 = "Q3"
export const Q4 = "Q4"
export const THIS_MONTH = "THIS_MONTH"
export const THIS_WEEK = "THIS_WEEK"
export const THIS_YEAR = "THIS_YEAR"
export const MONTHLY = "MONTHLY"
export const WEEKLY = "WEEKLY"
export const ANNUALY = "ANNUALY"

export const TIMERANGE_OPTIONS = [

    { value: THIS_WEEK, label: "This Week" },
    { value: THIS_MONTH, label: "This Month" },
    { value: Q1, label: "Q1" },
    { value: Q2, label: "Q2" },
    { value: Q3, label: "Q3" },
    { value: Q4, label: "Q4" },
    { value: THIS_YEAR, label: "This Year" },
];

export const severityOptions = [
    { value: "LOW", label: "Low", color: "#8BC34A" },
    { value: "MEDIUM", label: "Medium", color: "#F7DC6F" },
    { value: "HIGH", label: "High", color: "#FFC107" },
    { value: "CRITICAL", label: "Critical", color: "#F44336" },
];

export const depreciationOptions = [
    { value: "SLN", label: "Straight Line" },
    { value: "DB", label: "Declining Balance" },
    { value: "SYD", label: "Sum of Years" },
];


export const priorityOptions = [
    { value: "LOW", label: "Low", color: "#8BC34A" },
    { value: "MEDIUM", label: "Medium", color: "#F7DC6F" },
    { value: "HIGH", label: "High", color: "#FFC107" },
    { value: "URGENT", label: "Urgent", color: "#F44336" },
];

export const ONLINE = "ONLINE";
export const OFFLINE = "OFFLINE";
export const DIRECT_SELLING = "DIRECT_SELLING";
export const salesTypes = [
    { value: ONLINE, label: "Online" },
    { value: OFFLINE, label: "Offline" },
    { value: DIRECT_SELLING, label: "Direct Selling" },
];



export const salesDocTypes = [
    { value: "INVOICE", label: "Invoice" },
    { value: "SALES_ORDER", label: "Sales Order" },
    { value: "SALES_QUOTE", label: "Sales Quote" },
    { value: "DELIVERY", label: "Delivery" },
];

export const purchaseDocTypes = [
    { value: "BILL", label: "Invoice" },
    { value: "PURCHASE_ORDER", label: "Purchase Order" },
];


export const purchaseTypes = [
    { value: "PROCUREMENT", label: "Procurement" },
    { value: "PURCHASE", label: "Purchase" },
    { value: "PURCHASE_ECOMMERCE", label: "E-commerce" },
];

export const paymentMethods = [
    { value: "CASH", label: "Cash" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "QRIS", label: "QRIS" },
];

export let AUTO_NUMERIC_FORMAL = [
    "{month-roman}",
    "{month-mm}",
    "{month-mmm}",
    "{month-mmmm}",
    "{year-yyyy}",
    "{year-yy}",
    "{auto-numeric}",
    "{random-numeric}",
    "{random-character}",
    "{static-character}",
]



export const OPTION_ACCOUNT_TYPES = [
    { value: "ASSET", label: "Asset" },
    { value: "CONTRA_ASSET", label: "Contra Asset" },
    { value: "RECEIVABLE", label: "Receivable" },
    { value: "LIABILITY", label: "Liability" },
    { value: "EQUITY", label: "Equity" },
    { value: "REVENUE", label: "Revenue" },
    { value: "CONTRA_REVENUE", label: "Contra Revenue" },
    { value: "EXPENSE", label: "Expense" },
    { value: "COST", label: "Cost" },
];
