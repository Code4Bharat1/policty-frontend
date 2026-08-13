import Link from "next/link";
import { StatusBadge } from "@/components/app/status-badge";
import { inr, formatDate, fileSize } from "@/lib/format";
import { nameOfCustomer, nameOfAgent, nameOfCompany, policyNumberOf, nameOfProduct } from "@/services";

export function policyColumns(opts) {
  const cols = [
    {
      key: "policyNumber",
      header: "Policy",
      sortValue: (r) => r.policyNumber,
      cell: (r) => (
        <div>
          {opts?.href ? (
            <Link href={opts.href(r)} className="font-semibold text-foreground underline-offset-4 hover:underline">
              {r.policyNumber}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{r.policyNumber}</span>
          )}
          <p className="text-xs text-muted-foreground">{r.planName}</p>
        </div>
      ),
    },
    { key: "company", header: "Insurer", hideOnMobile: true, sortValue: (r) => nameOfCompany(r.companyId), cell: (r) => nameOfCompany(r.companyId) },
    { key: "sumInsured", header: "Sum insured", sortValue: (r) => r.sumInsured, cell: (r) => inr(r.sumInsured, true) },
    { key: "premium", header: "Premium", sortValue: (r) => r.premium, cell: (r) => inr(r.premium) },
    { key: "expiry", header: "Expires", hideOnMobile: true, sortValue: (r) => r.expiryDate, cell: (r) => formatDate(r.expiryDate) },
    { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ];
  if (opts?.customer) cols.splice(1, 0, { key: "customer", header: "Customer", sortValue: (r) => nameOfCustomer(r.customerId), cell: (r) => nameOfCustomer(r.customerId) });
  if (opts?.agent) cols.splice(2, 0, { key: "agent", header: "Advisor", hideOnMobile: true, sortValue: (r) => nameOfAgent(r.agentId), cell: (r) => nameOfAgent(r.agentId) });
  return cols;
}

export function claimColumns(opts) {
  const cols = [
    {
      key: "claimNumber",
      header: "Claim",
      sortValue: (r) => r.claimNumber,
      cell: (r) => (
        <div>
          {opts?.href ? (
            <Link href={opts.href(r)} className="font-semibold text-foreground underline-offset-4 hover:underline">{r.claimNumber}</Link>
          ) : (
            <span className="font-semibold text-foreground">{r.claimNumber}</span>
          )}
          <p className="text-xs text-muted-foreground">{r.type}</p>
        </div>
      ),
    },
    { key: "policy", header: "Policy", hideOnMobile: true, sortValue: (r) => policyNumberOf(r.policyId), cell: (r) => policyNumberOf(r.policyId) },
    { key: "amount", header: "Claimed", sortValue: (r) => r.amount, cell: (r) => inr(r.amount) },
    { key: "approved", header: "Approved", hideOnMobile: true, cell: (r) => (r.approvedAmount ? inr(r.approvedAmount) : "—") },
    { key: "submittedOn", header: "Submitted", hideOnMobile: true, sortValue: (r) => r.submittedOn, cell: (r) => formatDate(r.submittedOn) },
    { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ];
  if (opts?.customer) cols.splice(1, 0, { key: "customer", header: "Customer", sortValue: (r) => nameOfCustomer(r.customerId), cell: (r) => nameOfCustomer(r.customerId) });
  return cols;
}

export function quoteColumns(opts) {
  const cols = [
    { key: "quoteNumber", header: "Quote", sortValue: (r) => r.quoteNumber, cell: (r) => <span className="font-semibold text-foreground">{r.quoteNumber}</span> },
    { key: "product", header: "Product", sortValue: (r) => nameOfProduct(r.productId), cell: (r) => nameOfProduct(r.productId) },
    { key: "coverage", header: "Coverage", sortValue: (r) => r.coverage, cell: (r) => inr(r.coverage, true) },
    { key: "premium", header: "Premium", sortValue: (r) => r.premium, cell: (r) => inr(r.premium) },
    { key: "validTill", header: "Valid till", hideOnMobile: true, sortValue: (r) => r.validTill, cell: (r) => formatDate(r.validTill) },
    { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ];
  if (opts?.customer) cols.splice(1, 0, { key: "customer", header: "Customer", sortValue: (r) => nameOfCustomer(r.customerId), cell: (r) => nameOfCustomer(r.customerId) });
  return cols;
}

export function paymentColumns(opts) {
  const cols = [
    { key: "transactionId", header: "Transaction", sortValue: (r) => r.transactionId, cell: (r) => <span className="font-semibold text-foreground">{r.transactionId}</span> },
    { key: "policy", header: "Policy", hideOnMobile: true, cell: (r) => policyNumberOf(r.policyId) },
    { key: "amount", header: "Amount", sortValue: (r) => r.amount, cell: (r) => inr(r.amount) },
    { key: "method", header: "Method", hideOnMobile: true, sortValue: (r) => r.method, cell: (r) => `${r.method} · ${r.gateway}` },
    { key: "date", header: "Date", sortValue: (r) => r.date, cell: (r) => formatDate(r.date) },
    { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ];
  if (opts?.customer) cols.splice(1, 0, { key: "customer", header: "Customer", sortValue: (r) => nameOfCustomer(r.customerId), cell: (r) => nameOfCustomer(r.customerId) });
  return cols;
}

export const customerColumns = [
  {
    key: "name", header: "Customer", sortValue: (r) => r.name,
    cell: (r) => (
      <div>
        <p className="font-semibold text-foreground">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.email}</p>
      </div>
    ),
  },
  { key: "phone", header: "Phone", hideOnMobile: true, cell: (r) => r.phone },
  { key: "city", header: "Location", sortValue: (r) => r.city, cell: (r) => `${r.city}, ${r.state}` },
  { key: "agent", header: "Advisor", hideOnMobile: true, sortValue: (r) => nameOfAgent(r.agentId), cell: (r) => nameOfAgent(r.agentId) },
  { key: "kyc", header: "KYC", sortValue: (r) => r.kycStatus, cell: (r) => <StatusBadge status={r.kycStatus} /> },
  { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
];

export const agentColumns = [
  {
    key: "name", header: "Advisor", sortValue: (r) => r.name,
    cell: (r) => (
      <div>
        <p className="font-semibold text-foreground">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.code}</p>
      </div>
    ),
  },
  { key: "email", header: "Email", hideOnMobile: true, cell: (r) => r.email },
  { key: "phone", header: "Phone", hideOnMobile: true, cell: (r) => r.phone },
  { key: "city", header: "City", sortValue: (r) => r.city, cell: (r) => r.city },
  { key: "rating", header: "Rating", sortValue: (r) => r.rating, cell: (r) => `${r.rating.toFixed(1)} / 5` },
  { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
];

export const leadColumns = [
  {
    key: "name", header: "Lead", sortValue: (r) => r.name,
    cell: (r) => (
      <div>
        <p className="font-semibold text-foreground">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.phone}</p>
      </div>
    ),
  },
  { key: "interest", header: "Interest", sortValue: (r) => r.interest, cell: (r) => <span className="capitalize">{r.interest}</span> },
  { key: "source", header: "Source", hideOnMobile: true, sortValue: (r) => r.source, cell: (r) => r.source },
  { key: "premium", header: "Est. premium", sortValue: (r) => r.estimatedPremium, cell: (r) => inr(r.estimatedPremium) },
  { key: "followUp", header: "Next follow-up", hideOnMobile: true, sortValue: (r) => r.nextFollowUp, cell: (r) => formatDate(r.nextFollowUp) },
  { key: "priority", header: "Priority", sortValue: (r) => r.priority, cell: (r) => <StatusBadge status={r.priority} /> },
  { key: "stage", header: "Stage", sortValue: (r) => r.stage, cell: (r) => <StatusBadge status={r.stage} /> },
];

export const followUpColumns = [
  { key: "title", header: "Task", sortValue: (r) => r.title, cell: (r) => <span className="font-semibold text-foreground">{r.title}</span> },
  { key: "type", header: "Type", sortValue: (r) => r.type, cell: (r) => r.type },
  { key: "when", header: "Scheduled", sortValue: (r) => `${r.date} ${r.time}`, cell: (r) => `${formatDate(r.date)} · ${r.time}` },
  { key: "priority", header: "Priority", hideOnMobile: true, sortValue: (r) => r.priority, cell: (r) => <StatusBadge status={r.priority} /> },
  { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
];

export function commissionColumns(opts) {
  const cols = [
    { key: "policy", header: "Policy", sortValue: (r) => policyNumberOf(r.policyId), cell: (r) => <span className="font-semibold text-foreground">{policyNumberOf(r.policyId)}</span> },
    { key: "customer", header: "Customer", hideOnMobile: true, cell: (r) => nameOfCustomer(r.customerId) },
    { key: "premium", header: "Premium", sortValue: (r) => r.premium, cell: (r) => inr(r.premium) },
    { key: "pct", header: "Rate", sortValue: (r) => r.percentage, cell: (r) => `${r.percentage}%` },
    { key: "amount", header: "Commission", sortValue: (r) => r.amount, cell: (r) => inr(r.amount) },
    { key: "month", header: "Month", hideOnMobile: true, sortValue: (r) => r.month, cell: (r) => r.month },
    { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ];
  if (opts?.agent) cols.splice(1, 0, { key: "agent", header: "Advisor", sortValue: (r) => nameOfAgent(r.agentId), cell: (r) => nameOfAgent(r.agentId) });
  return cols;
}

export const documentColumns = [
  {
    key: "name", header: "Document", sortValue: (r) => r.name,
    cell: (r) => (
      <div>
        <p className="font-semibold text-foreground">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.relatedEntity}</p>
      </div>
    ),
  },
  { key: "category", header: "Category", sortValue: (r) => r.category, cell: (r) => r.category },
  { key: "type", header: "Type", hideOnMobile: true, cell: (r) => `${r.fileType} · ${fileSize(r.sizeKb)}` },
  { key: "uploadedBy", header: "Uploaded by", hideOnMobile: true, cell: (r) => r.uploadedBy },
  { key: "uploadedOn", header: "Uploaded", sortValue: (r) => r.uploadedOn, cell: (r) => formatDate(r.uploadedOn) },
];

export const auditColumns = [
  { key: "timestamp", header: "Timestamp", sortValue: (r) => r.timestamp, cell: (r) => r.timestamp },
  { key: "user", header: "User", sortValue: (r) => r.user, cell: (r) => <span className="font-semibold text-foreground">{r.user}</span> },
  { key: "role", header: "Role", hideOnMobile: true, cell: (r) => r.role.replace("_", " ") },
  { key: "action", header: "Action", sortValue: (r) => r.action, cell: (r) => r.action },
  { key: "module", header: "Module", sortValue: (r) => r.module, cell: (r) => r.module },
  { key: "ip", header: "IP", hideOnMobile: true, cell: (r) => r.ip },
];
