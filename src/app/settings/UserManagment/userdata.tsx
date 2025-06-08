// Define User type with permissions
export interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  lastLogin: string
  permissions: {
    // Insights Modules
    dashboard: boolean
    financialReports: boolean
    managementReports: boolean
    aiChatbot: boolean
    // Payroll Modules
    payrollRuns: boolean
    employeeManagement: boolean
    // Accounting Modules
    purchases: boolean
    sales: boolean
    contacts: boolean
    chartOfAccounts: boolean
    manualJournals: boolean
    stockControl: boolean
    // Settings Modules
    storeManagement: boolean
    xeroIntegration: boolean
    franchiseSettings: boolean
    userManagement: boolean
  }
  companyAccess: string[]
  storeAccess: string[]
}

// Define Role Template interface
export interface RoleTemplate {
  id: string
  name: string
  description: string
  permissions: User['permissions']
}

// Define Company and Store types
export interface Company {
  id: string
  name: string
  storeIds: string[]
}

export interface Store {
  id: string
  name: string
  location: string
  companyId: string
}

// Companies data
export const companies: Company[] = [
  {
    id: "company-a",
    name: "Company A",
    storeIds: ["store-1", "store-2", "store-3", "store-4"]
  },
  {
    id: "company-b", 
    name: "Company B",
    storeIds: ["store-5", "store-6", "store-7", "store-8"]
  },
  {
    id: "company-c",
    name: "Company C", 
    storeIds: ["store-9", "store-10", "store-11", "store-12"]
  },
  {
    id: "company-d",
    name: "Company D",
    storeIds: ["store-13", "store-14", "store-15"]
  }
]

// Stores data with UK locations
export const stores: Store[] = [
  // Company A stores
  { id: "store-1", name: "Tunbridge Wells", location: "Kent", companyId: "company-a" },
  { id: "store-2", name: "Kings Hill", location: "Kent", companyId: "company-a" },
  { id: "store-3", name: "Sevenoaks", location: "Kent", companyId: "company-a" },
  { id: "store-4", name: "Maidstone", location: "Kent", companyId: "company-a" },
  
  // Company B stores  
  { id: "store-5", name: "Brighton", location: "East Sussex", companyId: "company-b" },
  { id: "store-6", name: "Eastbourne", location: "East Sussex", companyId: "company-b" },
  { id: "store-7", name: "Hastings", location: "East Sussex", companyId: "company-b" },
  { id: "store-8", name: "Lewes", location: "East Sussex", companyId: "company-b" },
  
  // Company C stores
  { id: "store-9", name: "Canterbury", location: "Kent", companyId: "company-c" },
  { id: "store-10", name: "Ashford", location: "Kent", companyId: "company-c" },
  { id: "store-11", name: "Dover", location: "Kent", companyId: "company-c" },
  { id: "store-12", name: "Folkestone", location: "Kent", companyId: "company-c" },
  
  // Company D stores
  { id: "store-13", name: "Windsor", location: "Berkshire", companyId: "company-d" },
  { id: "store-14", name: "Reading", location: "Berkshire", companyId: "company-d" },
  { id: "store-15", name: "Bracknell", location: "Berkshire", companyId: "company-d" }
]

// Permission labels mapping with hierarchical structure
export const permissionLabels = {
  // Insights Modules
  dashboard: "Dashboard",
  financialReports: "Financial Reports",
  managementReports: "Management Reports", 
  aiChatbot: "AI Chatbot/Reports",
  // Payroll Modules
  payrollRuns: "Payroll Runs",
  employeeManagement: "Employee Management",
  // Accounting Modules
  purchases: "Purchases - Bills",
  sales: "Sales - Invoices", 
  contacts: "Contacts",
  chartOfAccounts: "Chart of Accounts",
  manualJournals: "Manual Journals",
  stockControl: "Stock Control",
  // Settings Modules
  storeManagement: "Store Management",
  xeroIntegration: "Xero Integration", 
  franchiseSettings: "Franchise Settings",
  userManagement: "User Management",
}

// Permission categories for better organization
export const permissionCategories = {
  insights: {
    label: "Insights",
    items: [
      { key: "financialReports", label: "Financial Reports" },
      { key: "managementReports", label: "Management Reports" },
      { key: "aiChatbot", label: "AI Chatbot/Reports" },
    ]
  },
  payroll: {
    label: "Payroll",
    items: [
      { key: "payrollRuns", label: "Payroll Runs" },
      { key: "employeeManagement", label: "Employee Management" },
    ]
  },
  accounting: {
    label: "Accounting",
    items: [
      { key: "purchases", label: "Purchases - Bills" },
      { key: "sales", label: "Sales - Invoices" },
      { key: "contacts", label: "Contacts" },
      { key: "chartOfAccounts", label: "Chart of Accounts" },
      { key: "manualJournals", label: "Manual Journals" },
      { key: "stockControl", label: "Stock Control" },
    ]
  },
  settings: {
    label: "Settings",
    items: [
      { key: "storeManagement", label: "Store Management" },
      { key: "xeroIntegration", label: "Xero Integration" },
      { key: "franchiseSettings", label: "Franchise Settings" },
      { key: "userManagement", label: "User Management" },
    ]
  }
}

// Predefined role templates
export const roleTemplates: RoleTemplate[] = [
  {
    id: "franchise-owner",
    name: "Franchise Owner",
    description: "Full access to all system modules and areas",
    permissions: {
      // Insights Modules
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: true,
      // Payroll Modules
      payrollRuns: true,
      employeeManagement: true,
      // Accounting Modules
      purchases: true,
      sales: true,
      contacts: true,
      chartOfAccounts: true,
      manualJournals: true,
      stockControl: true,
      // Settings Modules
      storeManagement: true,
      xeroIntegration: true,
      franchiseSettings: true,
      userManagement: true,
    }
  },
  {
    id: "payroll",
    name: "Payroll",
    description: "Access to payroll and employee management functions",
    permissions: {
      // Insights Modules
      dashboard: true,
      financialReports: false,
      managementReports: false,
      aiChatbot: false,
      // Payroll Modules
      payrollRuns: true,
      employeeManagement: true,
      // Accounting Modules
      purchases: false,
      sales: false,
      contacts: true,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: false,
      // Settings Modules
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "store-manager",
    name: "Store Manager",
    description: "Access to store operations, sales, and basic reporting",
    permissions: {
      // Insights Modules
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: false,
      // Payroll Modules
      payrollRuns: false,
      employeeManagement: true,
      // Accounting Modules
      purchases: false,
      sales: true,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: true,
      // Settings Modules
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "accountant",
    name: "Accountant",
    description: "Full access to accounting modules and financial reporting",
    permissions: {
      // Insights Modules
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: false,
      // Payroll Modules
      payrollRuns: false,
      employeeManagement: false,
      // Accounting Modules
      purchases: true,
      sales: true,
      contacts: true,
      chartOfAccounts: true,
      manualJournals: true,
      stockControl: false,
      // Settings Modules
      storeManagement: false,
      xeroIntegration: true,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "area-manager",
    name: "Area Manager",
    description: "Access to multiple stores with management and reporting capabilities",
    permissions: {
      // Insights Modules
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: true,
      // Payroll Modules
      payrollRuns: false,
      employeeManagement: true,
      // Accounting Modules
      purchases: true,
      sales: true,
      contacts: true,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: true,
      // Settings Modules
      storeManagement: true,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "it-administrator",
    name: "IT Administrator",
    description: "Access to system settings, integrations, and user management",
    permissions: {
      // Insights Modules
      dashboard: true,
      financialReports: false,
      managementReports: false,
      aiChatbot: false,
      // Payroll Modules
      payrollRuns: false,
      employeeManagement: false,
      // Accounting Modules
      purchases: false,
      sales: false,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: false,
      // Settings Modules
      storeManagement: true,
      xeroIntegration: true,
      franchiseSettings: true,
      userManagement: true,
    }
  }
]

// Available user roles (now derived from roleTemplates)
export const roles = roleTemplates.map(template => template.name)

// Simulated user data (updated with new permission structure)
export const initialUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@franchise.com",
    role: "Franchise Owner",
    status: "active",
    lastLogin: "2024-01-15 14:30",
    companyAccess: ["company-a", "company-b", "company-c", "company-d"],
    storeAccess: stores.map(store => store.id),
    permissions: {
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: true,
      payrollRuns: true,
      employeeManagement: true,
      purchases: true,
      sales: true,
      contacts: true,
      chartOfAccounts: true,
      manualJournals: true,
      stockControl: true,
      storeManagement: true,
      xeroIntegration: true,
      franchiseSettings: true,
      userManagement: true,
    }
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@franchise.com",
    role: "Store Manager",
    status: "active",
    lastLogin: "2024-01-15 09:15",
    companyAccess: ["company-a"],
    storeAccess: ["store-1", "store-2"],
    permissions: {
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: false,
      payrollRuns: false,
      employeeManagement: true,
      purchases: false,
      sales: true,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: true,
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "3",
    name: "Emma Thompson",
    email: "emma.thompson@franchise.com",
    role: "Payroll",
    status: "active",
    lastLogin: "2024-01-14 16:45",
    companyAccess: ["company-a", "company-b"],
    storeAccess: ["store-1", "store-2", "store-3", "store-4", "store-5", "store-6", "store-7", "store-8"],
    permissions: {
      dashboard: true,
      financialReports: false,
      managementReports: false,
      aiChatbot: false,
      payrollRuns: true,
      employeeManagement: true,
      purchases: false,
      sales: false,
      contacts: true,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: false,
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "4",
    name: "David Rodriguez",
    email: "david.rodriguez@franchise.com",
    role: "Area Manager",
    status: "active",
    lastLogin: "2024-01-15 11:20",
    companyAccess: ["company-b", "company-c"],
    storeAccess: ["store-5", "store-6", "store-7", "store-8", "store-9", "store-10", "store-11", "store-12"],
    permissions: {
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: true,
      payrollRuns: false,
      employeeManagement: true,
      purchases: true,
      sales: true,
      contacts: true,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: true,
      storeManagement: true,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@franchise.com",
    role: "Accountant",
    status: "active",
    lastLogin: "2024-01-15 08:30",
    companyAccess: ["company-a", "company-d"],
    storeAccess: ["store-1", "store-2", "store-3", "store-4", "store-13", "store-14", "store-15"],
    permissions: {
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: false,
      payrollRuns: false,
      employeeManagement: false,
      purchases: true,
      sales: true,
      contacts: true,
      chartOfAccounts: true,
      manualJournals: true,
      stockControl: false,
      storeManagement: false,
      xeroIntegration: true,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.wilson@franchise.com",
    role: "Store Manager",
    status: "active",
    lastLogin: "2024-01-14 17:00",
    companyAccess: ["company-b"],
    storeAccess: ["store-5", "store-6"],
    permissions: {
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: false,
      payrollRuns: false,
      employeeManagement: true,
      purchases: false,
      sales: true,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: true,
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "7",
    name: "Rachel Green",
    email: "rachel.green@franchise.com",
    role: "Store Manager",
    status: "inactive",
    lastLogin: "2024-01-10 12:30",
    companyAccess: [],
    storeAccess: ["store-13"],
    permissions: {
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: false,
      payrollRuns: false,
      employeeManagement: true,
      purchases: false,
      sales: true,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: true,
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "8",
    name: "Kevin Brown",
    email: "kevin.brown@franchise.com",
    role: "Accountant",
    status: "active",
    lastLogin: "2024-01-15 13:45",
    companyAccess: ["company-a", "company-b", "company-c"],
    storeAccess: ["store-1", "store-2", "store-3", "store-4", "store-5", "store-6", "store-7", "store-8", "store-9", "store-10", "store-11", "store-12"],
    permissions: {
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: false,
      payrollRuns: false,
      employeeManagement: false,
      purchases: true,
      sales: true,
      contacts: true,
      chartOfAccounts: true,
      manualJournals: true,
      stockControl: false,
      storeManagement: false,
      xeroIntegration: true,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "9",
    name: "Amy Davis",
    email: "amy.davis@franchise.com",
    role: "Store Manager",
    status: "active",
    lastLogin: "2024-01-15 10:00",
    companyAccess: ["company-c"],
    storeAccess: ["store-9", "store-10"],
    permissions: {
      dashboard: true,
      financialReports: true,
      managementReports: true,
      aiChatbot: false,
      payrollRuns: false,
      employeeManagement: true,
      purchases: false,
      sales: true,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: true,
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  },
  {
    id: "10",
    name: "Tom Miller",
    email: "tom.miller@franchise.com",
    role: "IT Administrator",
    status: "active",
    lastLogin: "2024-01-15 15:20",
    companyAccess: ["company-a", "company-b", "company-c", "company-d"],
    storeAccess: stores.map(store => store.id),
    permissions: {
      dashboard: true,
      financialReports: false,
      managementReports: false,
      aiChatbot: false,
      payrollRuns: false,
      employeeManagement: false,
      purchases: false,
      sales: false,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: false,
      storeManagement: true,
      xeroIntegration: true,
      franchiseSettings: true,
      userManagement: true,
    }
  },
]

// Helper functions for working with the data
export const getCompanyName = (companyId: string): string => {
  return companies.find(c => c.id === companyId)?.name || companyId
}

export const getStoreName = (storeId: string): string => {
  const store = stores.find(s => s.id === storeId)
  return store ? `${store.name}, ${store.location}` : storeId
}

export const getStoresByCompany = (companyId: string): Store[] => {
  return stores.filter(store => store.companyId === companyId)
}

export const getCompanyByStore = (storeId: string): Company | undefined => {
  const store = stores.find(s => s.id === storeId)
  return store ? companies.find(c => c.id === store.companyId) : undefined
}
