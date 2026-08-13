/* Deterministic pseudo-random so demo data is stable across renders/SSR. */
let seed = 20260811;
function rnd() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}
function pick(arr) {
  return arr[Math.floor(rnd() * arr.length)];
}
function int(min, max) {
  return Math.floor(rnd() * (max - min + 1)) + min;
}
const BASE = new Date("2026-08-11T00:00:00Z").getTime();
function dayOffset(days) {
  return new Date(BASE + days * 86400000).toISOString().slice(0, 10);
}

export const categories = [
  { slug: "health", name: "Health Insurance", description: "Cashless hospitalisation across 12,000+ network hospitals.", icon: "HeartPulse" },
  { slug: "life", name: "Life Insurance", description: "Term and savings plans that secure your family's future.", icon: "Users" },
  { slug: "motor", name: "Motor Insurance", description: "Car, bike and commercial vehicle cover with instant policy issuance.", icon: "Car" },
  { slug: "travel", name: "Travel Insurance", description: "Worldwide medical, baggage and trip cancellation protection.", icon: "Plane" },
  { slug: "home", name: "Home Insurance", description: "Structure and contents cover against fire, theft and natural perils.", icon: "Home" },
  { slug: "business", name: "Business Insurance", description: "Liability, property and group cover for growing enterprises.", icon: "Building2" },
];

export const companies = [
  { id: "IC-01", name: "Sentinel General Insurance", shortName: "Sentinel", description: "A leading general insurer with a nationwide cashless garage and hospital network.", website: "https://sentinel.example.in", email: "care@sentinel.example.in", phone: "1800 200 1101", claimSettlementRatio: 96.4, status: "Active" },
  { id: "IC-02", name: "Aarogya Health Assurance", shortName: "Aarogya", description: "Specialist health insurer focused on family floater and senior citizen cover.", website: "https://aarogya.example.in", email: "support@aarogya.example.in", phone: "1800 200 1102", claimSettlementRatio: 98.1, status: "Active" },
  { id: "IC-03", name: "Bharat Life Assurance", shortName: "Bharat Life", description: "Term, endowment and ULIP products with one of the highest settlement ratios.", website: "https://bharatlife.example.in", email: "hello@bharatlife.example.in", phone: "1800 200 1103", claimSettlementRatio: 99.2, status: "Active" },
  { id: "IC-04", name: "Metro Motor Insurance", shortName: "Metro Motor", description: "Digital-first motor insurer with 20-minute claim intimation.", website: "https://metromotor.example.in", email: "claims@metromotor.example.in", phone: "1800 200 1104", claimSettlementRatio: 94.7, status: "Active" },
  { id: "IC-05", name: "Suraksha Bharti General", shortName: "Suraksha", description: "Home, travel and commercial lines insurer serving 300+ cities.", website: "https://suraksha.example.in", email: "info@suraksha.example.in", phone: "1800 200 1105", claimSettlementRatio: 92.3, status: "Active" },
];

function makePlans(base, cover) {
  return [
    { id: "P1", name: "Essential", sumInsured: cover, annualPremium: base, deductible: 10000, highlights: ["Cashless network access", "Annual health check-up", "24x7 assistance"] },
    { id: "P2", name: "Advantage", sumInsured: cover * 2, annualPremium: Math.round(base * 1.7), deductible: 5000, highlights: ["No room rent capping", "Restore benefit", "Day-care procedures"] },
    { id: "P3", name: "Elite", sumInsured: cover * 5, annualPremium: Math.round(base * 3.2), deductible: 0, highlights: ["Global cover", "Zero co-payment", "Unlimited restore"] },
  ];
}

export const products = [
  {
    id: "PR-1001", name: "Aarogya Total Health Shield", companyId: "IC-02", category: "health", planType: "Family Floater",
    tagline: "Family floater cover with unlimited restore and zero room-rent capping.",
    description: "A comprehensive family floater health plan covering hospitalisation, day-care procedures, pre and post hospitalisation expenses, and domiciliary treatment with a 12,400-hospital cashless network.",
    minPremium: 8400, maxCoverage: 5000000, rating: 4.7, featured: true,
    benefits: ["Cashless treatment at 12,400+ hospitals", "60 days pre and 180 days post hospitalisation", "Unlimited automatic restore of sum insured", "Annual preventive health check-up", "No claim bonus up to 100%"],
    eligibility: ["Entry age 18-65 years", "Children covered from 91 days", "Indian resident with valid KYC", "Pre-policy medical for age 55+"],
    addOns: [{ name: "Maternity Cover", premium: 4200 }, { name: "OPD & Diagnostics", premium: 2800 }, { name: "Critical Illness Rider", premium: 3600 }, { name: "Personal Accident", premium: 1200 }],
    exclusions: ["Cosmetic and aesthetic treatment", "Self-inflicted injuries", "Treatment outside India (unless Elite)", "Pre-existing diseases during waiting period"],
    plans: makePlans(8400, 500000),
  },
  {
    id: "PR-1002", name: "Aarogya Senior Secure", companyId: "IC-02", category: "health", planType: "Individual",
    tagline: "Purpose-built health cover for parents and senior citizens above 60.",
    description: "Designed for senior citizens with reduced waiting periods, domiciliary hospitalisation and dedicated claim relationship managers.",
    minPremium: 14800, maxCoverage: 2000000, rating: 4.4, featured: false,
    benefits: ["Reduced 2-year pre-existing waiting period", "Domiciliary hospitalisation", "Dedicated claim manager", "Ambulance cover up to Rs 5,000"],
    eligibility: ["Entry age 60-80 years", "Medical screening mandatory", "Lifelong renewability"],
    addOns: [{ name: "Co-payment Waiver", premium: 5200 }, { name: "OPD & Diagnostics", premium: 3100 }],
    exclusions: ["Non-allopathic treatment", "Obesity treatment", "Cosmetic surgery"],
    plans: makePlans(14800, 300000),
  },
  {
    id: "PR-1003", name: "Bharat Term Protect Plus", companyId: "IC-03", category: "life", planType: "Term",
    tagline: "Pure protection term plan with cover up to Rs 2 crore till age 85.",
    description: "A high-cover, low-premium term plan offering level cover, increasing cover and income payout options with accidental and critical illness riders.",
    minPremium: 9600, maxCoverage: 20000000, rating: 4.8, featured: true,
    benefits: ["Cover till age 85", "Level, increasing or income payout", "Terminal illness benefit built-in", "Premium waiver on disability"],
    eligibility: ["Entry age 18-60 years", "Minimum annual income Rs 3 lakh", "Medical underwriting applies"],
    addOns: [{ name: "Accidental Death Benefit", premium: 1800 }, { name: "Critical Illness Rider", premium: 4600 }, { name: "Waiver of Premium", premium: 900 }],
    exclusions: ["Suicide within 12 months", "Non-disclosure of material facts", "Death due to participation in criminal act"],
    plans: makePlans(9600, 5000000),
  },
  {
    id: "PR-1004", name: "Bharat Wealth Secure Endowment", companyId: "IC-03", category: "life", planType: "Individual",
    tagline: "Guaranteed maturity benefit with life cover through the policy term.",
    description: "A savings-oriented life plan combining guaranteed additions with life cover, suitable for long-term goals such as education and retirement.",
    minPremium: 36000, maxCoverage: 5000000, rating: 4.2, featured: false,
    benefits: ["Guaranteed maturity additions", "Life cover throughout term", "Loan facility after 2 years", "Tax benefits under 80C and 10(10D)"],
    eligibility: ["Entry age 18-55 years", "Policy term 10-25 years", "Annual or monthly premium modes"],
    addOns: [{ name: "Accidental Death Benefit", premium: 2100 }, { name: "Waiver of Premium", premium: 1400 }],
    exclusions: ["Suicide within 12 months", "Fraudulent claims"],
    plans: makePlans(36000, 1000000),
  },
  {
    id: "PR-1005", name: "Metro Drive Comprehensive Car", companyId: "IC-04", category: "motor", planType: "Comprehensive",
    tagline: "Own damage plus third-party cover with zero depreciation add-on.",
    description: "Comprehensive private car insurance with cashless repairs at 4,800+ garages, 24x7 roadside assistance and instant digital policy issuance.",
    minPremium: 6200, maxCoverage: 1500000, rating: 4.5, featured: true,
    benefits: ["Cashless repair at 4,800+ garages", "24x7 roadside assistance", "Instant policy issuance", "No claim bonus up to 50%"],
    eligibility: ["Valid registration certificate", "Valid driving licence", "Vehicle age up to 15 years"],
    addOns: [{ name: "Zero Depreciation", premium: 2400 }, { name: "Engine Protect", premium: 1600 }, { name: "Return to Invoice", premium: 1900 }, { name: "Consumables Cover", premium: 800 }],
    exclusions: ["Driving without valid licence", "Driving under influence", "Consequential damages", "Normal wear and tear"],
    plans: makePlans(6200, 500000),
  },
  {
    id: "PR-1006", name: "Metro Two-Wheeler Shield", companyId: "IC-04", category: "motor", planType: "Comprehensive",
    tagline: "Affordable bike insurance with long-term 3-year option.",
    description: "Two-wheeler package policy covering own damage, third-party liability and owner-driver personal accident cover.",
    minPremium: 1450, maxCoverage: 250000, rating: 4.3, featured: false,
    benefits: ["3-year long-term option", "Pillion rider cover add-on", "Instant renewal", "Personal accident cover Rs 15 lakh"],
    eligibility: ["Valid RC and DL", "Vehicle age up to 12 years"],
    addOns: [{ name: "Zero Depreciation", premium: 620 }, { name: "Pillion Rider Cover", premium: 340 }],
    exclusions: ["Racing and speed testing", "Illegal usage", "Wear and tear"],
    plans: makePlans(1450, 100000),
  },
  {
    id: "PR-1007", name: "Suraksha Global Travel Guard", companyId: "IC-05", category: "travel", planType: "Individual",
    tagline: "Worldwide medical, baggage and trip cancellation protection.",
    description: "Single-trip and multi-trip international travel insurance with emergency medical evacuation, passport loss and flight delay benefits.",
    minPremium: 980, maxCoverage: 4000000, rating: 4.6, featured: true,
    benefits: ["Emergency medical up to USD 50,000", "Trip cancellation and curtailment", "Checked baggage loss and delay", "Passport loss assistance", "Schengen-compliant certificate"],
    eligibility: ["Age 6 months to 70 years", "Trip must start from India", "Purchase before departure"],
    addOns: [{ name: "Adventure Sports Cover", premium: 640 }, { name: "Cruise Cover", premium: 780 }],
    exclusions: ["Pre-existing conditions", "Travel against medical advice", "War and civil unrest"],
    plans: makePlans(980, 1000000),
  },
  {
    id: "PR-1008", name: "Suraksha Home Shield Plus", companyId: "IC-05", category: "home", planType: "Comprehensive",
    tagline: "Structure and contents cover against fire, theft and natural perils.",
    description: "Householder package policy covering building structure, contents, jewellery, electronics and alternate accommodation expenses.",
    minPremium: 3400, maxCoverage: 10000000, rating: 4.1, featured: false,
    benefits: ["Structure and contents cover", "Burglary and theft", "Alternate accommodation rent", "Electronics and appliances breakdown"],
    eligibility: ["Owned or rented residential property", "Property age up to 40 years"],
    addOns: [{ name: "Jewellery Cover", premium: 1500 }, { name: "Portable Electronics", premium: 900 }],
    exclusions: ["Wilful damage", "Property under construction", "Loss of cash"],
    plans: makePlans(3400, 2000000),
  },
  {
    id: "PR-1009", name: "Sentinel Business Guard SME", companyId: "IC-01", category: "business", planType: "Group",
    tagline: "Property, liability and employee cover in one SME package.",
    description: "Bundled commercial policy for small and medium enterprises covering fire and allied perils, public liability, machinery breakdown and group health.",
    minPremium: 24000, maxCoverage: 50000000, rating: 4.4, featured: true,
    benefits: ["Fire and allied perils", "Public liability", "Machinery breakdown", "Business interruption", "Optional group health for employees"],
    eligibility: ["Registered business entity", "GST registration", "Minimum 3 employees"],
    addOns: [{ name: "Cyber Liability", premium: 12000 }, { name: "Marine Transit", premium: 8400 }],
    exclusions: ["Wilful misconduct", "Nuclear perils", "Unregistered operations"],
    plans: makePlans(24000, 10000000),
  },
  {
    id: "PR-1010", name: "Sentinel Group Health Care", companyId: "IC-01", category: "health", planType: "Group",
    tagline: "Employee group mediclaim with day-one maternity and pre-existing cover.",
    description: "Group health insurance for organisations with configurable sum insured bands, dependant cover and wellness programmes.",
    minPremium: 4800, maxCoverage: 1000000, rating: 4.5, featured: false,
    benefits: ["Day-one pre-existing cover", "Maternity benefit", "Dependant parents cover", "Corporate wellness programme"],
    eligibility: ["Minimum 10 employees", "Active payroll records"],
    addOns: [{ name: "Top-up Cover", premium: 2200 }, { name: "OPD Wallet", premium: 1800 }],
    exclusions: ["Cosmetic treatment", "Infertility treatment", "Experimental treatment"],
    plans: makePlans(4800, 300000),
  },
];

const firstNames = ["Aarav", "Vivaan", "Ananya", "Diya", "Kabir", "Ishaan", "Meera", "Riya", "Rohan", "Sneha", "Arjun", "Nisha", "Kiran", "Pooja", "Manav", "Tanvi", "Rahul", "Farhan", "Neha", "Sanjay", "Deepa", "Aditya", "Kavya", "Vikram", "Shreya"];
const lastNames = ["Sharma", "Verma", "Iyer", "Nair", "Patel", "Reddy", "Chatterjee", "Kulkarni", "Menon", "Bose", "Joshi", "Gupta", "Rao", "Desai", "Khan"];
const cities = [["Mumbai", "Maharashtra"], ["Pune", "Maharashtra"], ["Bengaluru", "Karnataka"], ["Chennai", "Tamil Nadu"], ["Hyderabad", "Telangana"], ["Delhi", "Delhi"], ["Ahmedabad", "Gujarat"], ["Kolkata", "West Bengal"], ["Jaipur", "Rajasthan"], ["Kochi", "Kerala"]];

export const agents = Array.from({ length: 10 }, (_, i) => {
  const name = `${firstNames[(i * 3) % firstNames.length]} ${lastNames[(i * 5) % lastNames.length]}`;
  const [city] = cities[i % cities.length];
  return {
    id: `AG-${101 + i}`,
    name,
    email: `${name.split(" ")[0].toLowerCase()}.${name.split(" ")[1].toLowerCase()}@policycare.demo`,
    phone: `+91 9${int(100000000, 899999999)}`,
    code: `PC-ADV-${1001 + i}`,
    city,
    status: i === 9 ? "Inactive" : "Active",
    joinedOn: dayOffset(-int(200, 1400)),
    rating: Number((3.8 + rnd() * 1.2).toFixed(1)),
  };
});

export const customers = Array.from({ length: 24 }, (_, i) => {
  const name = `${firstNames[(i * 7) % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
  const [city, state] = cities[i % cities.length];
  return {
    id: `CU-${2001 + i}`,
    name,
    email: `${name.split(" ")[0].toLowerCase()}.${name.split(" ")[1].toLowerCase()}${i}@example.in`,
    phone: `+91 8${int(100000000, 899999999)}`,
    city,
    state,
    dob: dayOffset(-int(8000, 20000)),
    kycStatus: i % 7 === 0 ? "Pending" : "Verified",
    agentId: agents[i % agents.length].id,
    status: i % 11 === 0 ? "Inactive" : "Active",
    joinedOn: dayOffset(-int(30, 1100)),
  };
});

export const DEMO_CUSTOMER_ID = "CU-2001";
export const DEMO_AGENT_ID = "AG-101";
customers[0].name = "Ananya Sharma";
customers[0].email = "customer@policycare.demo";
customers[0].agentId = DEMO_AGENT_ID;
agents[0].name = "Rohan Mehta";
agents[0].email = "agent@policycare.demo";

const statusPlan = [
  { status: "Active", days: 240 },
  { status: "Expiring Soon", days: 21 },
  { status: "Active", days: 160 },
  { status: "Expired", days: -34 },
  { status: "Pending", days: 300 },
  { status: "Active", days: 88 },
  { status: "Expiring Soon", days: 12 },
  { status: "Cancelled", days: 120 },
];

export const policies = Array.from({ length: 48 }, (_, i) => {
  const customer = customers[i % customers.length];
  const product = products[i % products.length];
  const plan = product.plans[i % 3];
  const sp = statusPlan[i % statusPlan.length];
  return {
    id: `PL-${3001 + i}`,
    policyNumber: `PC/${product.category.toUpperCase().slice(0, 3)}/2026/${40100 + i}`,
    customerId: customer.id,
    agentId: customer.agentId,
    productId: product.id,
    companyId: product.companyId,
    category: product.category,
    planName: plan.name,
    sumInsured: plan.sumInsured,
    premium: plan.annualPremium,
    startDate: dayOffset(sp.days - 365),
    expiryDate: dayOffset(sp.days),
    status: sp.status,
    nominees: [
      { name: `${lastNames[i % lastNames.length]} family member`, relation: pick(["Spouse", "Son", "Daughter", "Parent"]), share: 100 },
    ],
  };
});

[0, 8, 16, 24, 32, 40].forEach((idx) => {
  policies[idx].customerId = DEMO_CUSTOMER_ID;
  policies[idx].agentId = DEMO_AGENT_ID;
});

const claimTypes = ["Hospitalisation", "Accidental Damage", "Theft", "Critical Illness", "Trip Cancellation", "Fire Damage"];
const claimStatuses = ["Submitted", "Under Review", "Documents Required", "Approved", "Rejected", "Settled"];

export const claims = Array.from({ length: 18 }, (_, i) => {
  const policy = policies[(i * 3) % policies.length];
  const status = claimStatuses[i % claimStatuses.length];
  const steps = ["Submitted", "Under Review", "Documents Verified", "Approved", "Settled"];
  const reached = { "Submitted": 1, "Under Review": 2, "Documents Required": 2, "Approved": 4, "Rejected": 3, "Settled": 5 }[status];
  return {
    id: `CL-${4001 + i}`,
    claimNumber: `CLM-2026-${7100 + i}`,
    policyId: policy.id,
    customerId: policy.customerId,
    agentId: policy.agentId,
    type: claimTypes[i % claimTypes.length],
    amount: int(15, 480) * 1000,
    approvedAmount: status === "Approved" || status === "Settled" ? int(12, 400) * 1000 : undefined,
    submittedOn: dayOffset(-int(3, 120)),
    status,
    description: "Claim raised for expenses incurred against the covered event. Supporting bills and discharge summary submitted through the customer portal.",
    remarks: status === "Documents Required" ? "Please upload the original discharge summary and pharmacy bills." : status === "Rejected" ? "Event falls within the policy waiting period." : "Processing as per policy terms.",
    timeline: steps.map((label, si) => ({
      label,
      date: dayOffset(-int(3, 90)),
      done: si < reached,
      note: si === 1 ? "Assigned to claims desk" : undefined,
    })),
  };
});
[0, 3, 7].forEach((i) => {
  claims[i].customerId = DEMO_CUSTOMER_ID;
  claims[i].policyId = policies[0].id;
});

const quoteStatuses = ["Draft", "Requested", "Under Review", "Quoted", "Accepted", "Rejected", "Expired"];
export const quotes = Array.from({ length: 22 }, (_, i) => {
  const customer = customers[(i * 2) % customers.length];
  const product = products[i % products.length];
  return {
    id: `QT-${5001 + i}`,
    quoteNumber: `QTE-2026-${3300 + i}`,
    customerId: customer.id,
    agentId: customer.agentId,
    productId: product.id,
    coverage: product.plans[i % 3].sumInsured,
    premium: product.plans[i % 3].annualPremium,
    addOns: product.addOns.slice(0, (i % 3) + 1).map((a) => a.name),
    createdOn: dayOffset(-int(2, 60)),
    validTill: dayOffset(int(3, 40)),
    status: quoteStatuses[i % quoteStatuses.length],
  };
});
[0, 5, 11].forEach((i) => {
  quotes[i].customerId = DEMO_CUSTOMER_ID;
  quotes[i].agentId = DEMO_AGENT_ID;
});

const payStatuses = ["Successful", "Successful", "Pending", "Failed", "Refunded", "Successful"];
export const payments = Array.from({ length: 40 }, (_, i) => {
  const policy = policies[i % policies.length];
  return {
    id: `PY-${6001 + i}`,
    transactionId: `TXN2026${820100 + i}`,
    customerId: policy.customerId,
    policyId: policy.id,
    amount: policy.premium,
    date: dayOffset(-int(1, 300)),
    method: pick(["UPI", "Net Banking", "Credit Card", "Debit Card", "NEFT"]),
    gateway: pick(["Razorpay", "PayU", "Cashfree"]),
    status: payStatuses[i % payStatuses.length],
    type: i % 5 === 0 ? "Renewal" : i % 9 === 0 ? "Refund" : "Premium",
  };
});

const leadStages = ["New", "Contacted", "Qualified", "Quotation", "Negotiation", "Converted", "Lost"];
export const leads = Array.from({ length: 28 }, (_, i) => {
  const name = `${firstNames[(i * 11) % firstNames.length]} ${lastNames[(i * 7) % lastNames.length]}`;
  return {
    id: `LD-${7001 + i}`,
    name,
    email: `${name.split(" ")[0].toLowerCase()}${i}@example.in`,
    phone: `+91 7${int(100000000, 899999999)}`,
    interest: categories[i % categories.length].slug,
    source: pick(["Website", "Referral", "Campaign", "Walk-in", "Call Centre"]),
    agentId: agents[i % agents.length].id,
    priority: pick(["High", "Medium", "Low"]),
    stage: leadStages[i % leadStages.length],
    lastContact: dayOffset(-int(1, 25)),
    nextFollowUp: dayOffset(int(0, 14)),
    estimatedPremium: int(6, 90) * 1000,
    notes: "Prospect enquired through the website enquiry form and requested a comparison of two plans.",
  };
});
leads.slice(0, 12).forEach((l) => (l.agentId = DEMO_AGENT_ID));

export const followUps = Array.from({ length: 20 }, (_, i) => {
  const lead = leads[i % leads.length];
  return {
    id: `FU-${8001 + i}`,
    leadId: lead.id,
    customerId: i % 3 === 0 ? customers[i % customers.length].id : undefined,
    title: `${["Discuss plan options", "Share revised quotation", "Renewal reminder", "Collect KYC documents", "Payment confirmation"][i % 5]} — ${lead.name}`,
    agentId: i < 12 ? DEMO_AGENT_ID : lead.agentId,
    date: dayOffset(int(-3, 12)),
    time: `${String(9 + (i % 8)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
    type: pick(["Call", "Meeting", "WhatsApp", "Email", "Renewal Follow-up", "Payment Follow-up"]),
    priority: pick(["High", "Medium", "Low"]),
    status: i % 5 === 0 ? "Completed" : i % 7 === 0 ? "Missed" : "Pending",
    notes: "Customer prefers a call after 6 PM on weekdays.",
  };
});

export const commissions = policies.slice(0, 30).map((p, i) => {
  const pct = [8, 10, 12, 15][i % 4];
  return {
    id: `CM-${9001 + i}`,
    agentId: p.agentId,
    policyId: p.id,
    customerId: p.customerId,
    premium: p.premium,
    percentage: pct,
    amount: Math.round((p.premium * pct) / 100),
    status: i % 3 === 0 ? "Pending" : "Paid",
    month: ["Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026"][i % 6],
    paidOn: i % 3 === 0 ? undefined : dayOffset(-int(5, 120)),
  };
});

export const notifications = [
  { id: "NT-01", userScope: "CUSTOMER", customerId: DEMO_CUSTOMER_ID, title: "Policy expiring in 21 days", body: "Your Metro Drive Comprehensive Car policy PC/MOT/2026/40108 expires soon. Renew now to keep cover unbroken.", type: "Renewal", date: dayOffset(-1), read: false },
  { id: "NT-02", userScope: "CUSTOMER", customerId: DEMO_CUSTOMER_ID, title: "Claim CLM-2026-7100 under review", body: "Our claims desk has received your documents and started assessment.", type: "Claim", date: dayOffset(-2), read: false },
  { id: "NT-03", userScope: "CUSTOMER", customerId: DEMO_CUSTOMER_ID, title: "Payment received", body: "We have received Rs 26,880 towards premium for policy PC/HEA/2026/40100.", type: "Payment", date: dayOffset(-6), read: true },
  { id: "NT-04", userScope: "CUSTOMER", customerId: DEMO_CUSTOMER_ID, title: "Documents required", body: "Please upload your updated address proof to complete KYC.", type: "Document", date: dayOffset(-9), read: true },
  { id: "NT-05", userScope: "AGENT", title: "3 new leads assigned", body: "Three website leads have been assigned to you for first contact today.", type: "Alert", date: dayOffset(0), read: false },
  { id: "NT-06", userScope: "AGENT", title: "Renewal follow-ups due", body: "5 policies in your book expire within 30 days.", type: "Renewal", date: dayOffset(-1), read: false },
  { id: "NT-07", userScope: "ADMIN", title: "Payment gateway failures", body: "4 transactions failed on Cashfree in the last 24 hours.", type: "Payment", date: dayOffset(0), read: false },
  { id: "NT-08", userScope: "ADMIN", title: "New agent onboarded", body: "Agent PC-ADV-1010 completed onboarding and awaits customer assignment.", type: "Alert", date: dayOffset(-3), read: true },
];

export const documents = Array.from({ length: 16 }, (_, i) => {
  const cats = ["Policy Documents", "KYC Documents", "Claim Documents", "Payment Receipts", "Other Documents"];
  const policy = policies[i % policies.length];
  return {
    id: `DC-${1101 + i}`,
    name: `${["Policy Schedule", "PAN Card", "Aadhaar", "Discharge Summary", "Premium Receipt", "Claim Form", "Address Proof", "Vehicle RC"][i % 8]}_${1101 + i}`,
    category: cats[i % cats.length],
    fileType: pick(["PDF", "JPG", "PNG", "DOCX"]),
    sizeKb: int(120, 4800),
    uploadedBy: i % 4 === 0 ? "Rohan Mehta (Advisor)" : "Ananya Sharma",
    uploadedOn: dayOffset(-int(1, 200)),
    customerId: i % 2 === 0 ? DEMO_CUSTOMER_ID : policy.customerId,
    relatedEntity: policy.policyNumber,
  };
});

export const auditLogs = Array.from({ length: 24 }, (_, i) => {
  const actions = ["Login", "Logout", "Customer created", "Customer updated", "Policy created", "Policy updated", "Claim updated", "Payment refunded", "Agent assignment", "Permission changed"];
  const modules = ["Auth", "Auth", "Customers", "Customers", "Policies", "Policies", "Claims", "Payments", "Agents", "Roles"];
  return {
    id: `AU-${1201 + i}`,
    user: i % 3 === 0 ? "admin@policycare.demo" : i % 3 === 1 ? "agent@policycare.demo" : "customer@policycare.demo",
    role: i % 3 === 0 ? "ADMIN" : i % 3 === 1 ? "AGENT" : "CUSTOMER",
    action: actions[i % actions.length],
    module: modules[i % modules.length],
    timestamp: `${dayOffset(-int(0, 20))} ${String(int(8, 20)).padStart(2, "0")}:${String(int(10, 59))}`,
    ip: `103.${int(10, 250)}.${int(1, 250)}.${int(1, 250)}`,
    details: "Action recorded from the web application.",
  };
});

export const faqs = [
  { id: "F1", category: "Getting started", question: "What is Policy Care?", answer: "Policy Care is a digital insurance management platform where you can compare plans, buy policies, track renewals, submit claims and store all your insurance documents in one place." },
  { id: "F2", category: "Getting started", question: "Does Policy Care charge customers a fee?", answer: "No. Advisory, comparison and policy servicing on Policy Care are free for customers. We are remunerated by insurers through standard IRDAI-regulated commissions." },
  { id: "F3", category: "Policies", question: "How quickly is my policy issued?", answer: "Motor and travel policies are typically issued instantly after payment. Health and life policies may require medical underwriting, which usually takes 2 to 7 working days." },
  { id: "F4", category: "Policies", question: "Can I add my existing policies bought elsewhere?", answer: "Yes. Upload your policy schedule under Documents and your advisor will add it to your dashboard so renewals and claims are tracked centrally." },
  { id: "F5", category: "Claims", question: "How do I submit a claim?", answer: "Go to Claims in your portal, choose the policy, describe the incident, upload the supporting documents and submit. You can track every stage from the claim timeline." },
  { id: "F6", category: "Claims", question: "What documents are required for a health claim?", answer: "Typically the claim form, discharge summary, hospital bills with break-up, diagnostic reports, KYC and a cancelled cheque for reimbursement claims." },
  { id: "F7", category: "Renewals", question: "Will I be reminded before my policy expires?", answer: "Yes. You receive in-app, email and SMS reminders 45, 30, 15 and 7 days before expiry, and your advisor follows up personally." },
  { id: "F8", category: "Payments", question: "Which payment methods are supported?", answer: "UPI, net banking, credit and debit cards and NEFT. Receipts are generated instantly and stored under Documents." },
  { id: "F9", category: "Security", question: "How is my data protected?", answer: "Access is role based, documents are stored with restricted access and every sensitive action is written to an immutable audit log." },
];

export const testimonials = [
  { id: "T1", name: "Sneha Kulkarni", city: "Pune", role: "Health policyholder", quote: "My cashless approval came through in under two hours. Having every document already on the portal made the hospital admission painless.", rating: 5 },
  { id: "T2", name: "Vikram Rao", city: "Bengaluru", role: "Motor and home cover", quote: "I compared four car plans side by side and my advisor called back the same day. Renewals are now one tap.", rating: 5 },
  { id: "T3", name: "Farhan Khan", city: "Hyderabad", role: "Term life policyholder", quote: "The comparison table finally explained riders in plain language. I increased my cover and still pay less than before.", rating: 4 },
  { id: "T4", name: "Deepa Menon", city: "Kochi", role: "SME business cover", quote: "Managing group health for 40 employees used to be spreadsheets and phone calls. Now it is one dashboard.", rating: 5 },
];

export const blogPosts = [
  { id: "B1", title: "Health insurance waiting periods explained", excerpt: "Initial, specific-disease and pre-existing waiting periods decide when your cover actually starts. Here is how to read them.", category: "Health", author: "Policy Care Desk", date: dayOffset(-4), readMinutes: 6, body: "Every health policy carries three waiting periods. The initial 30-day period excludes everything except accidents. Specific ailments such as hernia or cataract usually carry a one to two year wait. Pre-existing diseases are covered after two to four years depending on the insurer. When you port a policy, the waiting period already served is carried forward, which is why porting rather than buying fresh usually protects you better." },
  { id: "B2", title: "Term cover: how much is enough?", excerpt: "A simple framework using income replacement, liabilities and future goals to size your term plan.", category: "Life", author: "Policy Care Desk", date: dayOffset(-11), readMinutes: 5, body: "A practical rule is 15 to 20 times your annual income, plus outstanding liabilities such as a home loan, plus the future cost of your children's education, minus existing liquid assets. Review the number every three years or after any major life event." },
  { id: "B3", title: "Zero depreciation: is the add-on worth it?", excerpt: "For cars under five years old the maths usually favours the add-on. We break down a real claim.", category: "Motor", author: "Policy Care Desk", date: dayOffset(-19), readMinutes: 4, body: "Without zero depreciation, plastic and rubber parts are settled at up to 50 per cent depreciation. On a typical bumper and fender repair of Rs 42,000, the customer paid Rs 11,400 out of pocket. The add-on costs around Rs 2,400 a year, so a single moderate claim pays for several years of the rider." },
  { id: "B4", title: "What to do in the first hour after an accident", excerpt: "Intimation timelines, photographs, FIR requirements and cashless garage selection.", category: "Motor", author: "Policy Care Desk", date: dayOffset(-27), readMinutes: 7, body: "Intimate the insurer before moving the vehicle where possible, photograph all four corners and the surroundings, note the other vehicle's registration number, and file an FIR for third-party injury or theft. Choose a network garage to keep the claim cashless." },
  { id: "B5", title: "Travel insurance and Schengen visas", excerpt: "The minimum cover the consulate expects and the certificate wording that gets accepted.", category: "Travel", author: "Policy Care Desk", date: dayOffset(-34), readMinutes: 4, body: "Schengen states require a minimum medical cover of EUR 30,000 valid across all member states for the full duration of stay, including repatriation. The certificate must carry your passport number exactly as printed." },
  { id: "B6", title: "Group health for small teams", excerpt: "Why a 12-person company can still get day-one pre-existing cover.", category: "Business", author: "Policy Care Desk", date: dayOffset(-41), readMinutes: 6, body: "Group policies are underwritten on the pool rather than the individual, which is why waiting periods are often waived. For teams under 20 the premium is sensitive to average age and prior claim history, so sharing accurate census data upfront gets sharper pricing." },
];

export const users = [
  { id: "US-1", name: "Priya Nair", email: "admin@policycare.demo", phone: "+91 9800000001", role: "ADMIN", avatarInitials: "PN" },
  { id: "US-2", name: "Rohan Mehta", email: "agent@policycare.demo", phone: "+91 9800000002", role: "AGENT", avatarInitials: "RM", linkedId: DEMO_AGENT_ID },
  { id: "US-3", name: "Ananya Sharma", email: "customer@policycare.demo", phone: "+91 9800000003", role: "CUSTOMER", avatarInitials: "AS", linkedId: DEMO_CUSTOMER_ID },
];

export const monthlySeries = [
  { month: "Mar", policies: 182, premium: 4820000, claims: 24, renewals: 96, leads: 210, converted: 62 },
  { month: "Apr", policies: 204, premium: 5310000, claims: 31, renewals: 108, leads: 238, converted: 71 },
  { month: "May", policies: 197, premium: 5120000, claims: 28, renewals: 101, leads: 226, converted: 66 },
  { month: "Jun", policies: 241, premium: 6240000, claims: 35, renewals: 124, leads: 268, converted: 88 },
  { month: "Jul", policies: 268, premium: 7015000, claims: 30, renewals: 139, leads: 291, converted: 97 },
  { month: "Aug", policies: 289, premium: 7640000, claims: 27, renewals: 151, leads: 312, converted: 109 },
];
