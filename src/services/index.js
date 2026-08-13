import * as db from "@/data/mock";

const LATENCY = 220;

function respond(data) {
  return new Promise((resolve) => setTimeout(() => resolve(data), LATENCY));
}

export const catalogService = {
  categories: () => respond(db.categories),
  companies: () => respond(db.companies),
  company: (id) => respond(db.companies.find((c) => c.id === id) ?? null),
  products: (filters) => {
    let list = db.products;
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q));
    }
    if (filters?.category && filters.category !== "all") list = list.filter((p) => p.category === filters.category);
    if (filters?.companyId && filters.companyId !== "all") list = list.filter((p) => p.companyId === filters.companyId);
    if (filters?.maxPremium) list = list.filter((p) => p.minPremium <= filters.maxPremium);
    return respond(list);
  },
  product: (id) => respond(db.products.find((p) => p.id === id) ?? null),
  faqs: () => respond(db.faqs),
  blogPosts: () => respond(db.blogPosts),
  blogPost: (id) => respond(db.blogPosts.find((b) => b.id === id) ?? null),
  testimonials: () => respond(db.testimonials),
};

export const customerService = {
  list: (agentId) => respond(agentId ? db.customers.filter((c) => c.agentId === agentId) : db.customers),
  get: (id) => respond(db.customers.find((c) => c.id === id) ?? null),
};

export const agentService = {
  list: () => respond(db.agents),
  get: (id) => respond(db.agents.find((a) => a.id === id) ?? null),
  performance: () =>
    respond(
      db.agents.map((a) => {
        const pols = db.policies.filter((p) => p.agentId === a.id);
        const lds = db.leads.filter((l) => l.agentId === a.id);
        return {
          agent: a,
          policies: pols.length,
          premium: pols.reduce((s, p) => s + p.premium, 0),
          leads: lds.length,
          conversions: lds.filter((l) => l.stage === "Converted").length,
          claims: db.claims.filter((c) => c.agentId === a.id).length,
          commission: db.commissions.filter((c) => c.agentId === a.id).reduce((s, c) => s + c.amount, 0),
        };
      }),
    ),
};

export const policyService = {
  list: (scope) =>
    respond(
      db.policies.filter(
        (p) =>
          (!scope?.customerId || p.customerId === scope.customerId) &&
          (!scope?.agentId || p.agentId === scope.agentId),
      ),
    ),
  get: (id) => respond(db.policies.find((p) => p.id === id) ?? null),
  renewals: (scope) =>
    respond(
      db.policies.filter(
        (p) =>
          (p.status === "Expiring Soon" || p.status === "Expired") &&
          (!scope?.customerId || p.customerId === scope.customerId) &&
          (!scope?.agentId || p.agentId === scope.agentId),
      ),
    ),
};

export const claimService = {
  list: (scope) =>
    respond(
      db.claims.filter(
        (c) =>
          (!scope?.customerId || c.customerId === scope.customerId) &&
          (!scope?.agentId || c.agentId === scope.agentId),
      ),
    ),
  get: (id) => respond(db.claims.find((c) => c.id === id) ?? null),
};

export const quoteService = {
  list: (scope) =>
    respond(
      db.quotes.filter(
        (q) =>
          (!scope?.customerId || q.customerId === scope.customerId) &&
          (!scope?.agentId || q.agentId === scope.agentId),
      ),
    ),
  get: (id) => respond(db.quotes.find((q) => q.id === id) ?? null),
  request: (payload) =>
    respond({ ok: true, quoteNumber: `QTE-2026-${Math.floor(Math.random() * 9000) + 1000}`, ...payload }),
};

export const paymentService = {
  list: (scope) => respond(db.payments.filter((p) => !scope?.customerId || p.customerId === scope.customerId)),
};

export const leadService = {
  list: (agentId) => respond(agentId ? db.leads.filter((l) => l.agentId === agentId) : db.leads),
  get: (id) => respond(db.leads.find((l) => l.id === id) ?? null),
};

export const followUpService = {
  list: (agentId) => respond(agentId ? db.followUps.filter((f) => f.agentId === agentId) : db.followUps),
};

export const commissionService = {
  list: (agentId) => respond(agentId ? db.commissions.filter((c) => c.agentId === agentId) : db.commissions),
};

export const documentService = {
  list: (customerId) => respond(customerId ? db.documents.filter((d) => d.customerId === customerId) : db.documents),
};

export const notificationService = {
  list: (scope) => respond(db.notifications.filter((n) => n.userScope === scope || n.userScope === "ALL")),
};

export const auditService = {
  list: () => respond(db.auditLogs),
};

export const reportService = {
  series: () => respond(db.monthlySeries),
};

export function nameOfCustomer(id) {
  return db.customers.find((c) => c.id === id)?.name ?? "—";
}
export function nameOfAgent(id) {
  return db.agents.find((a) => a.id === id)?.name ?? "Unassigned";
}
export function nameOfProduct(id) {
  return db.products.find((p) => p.id === id)?.name ?? "—";
}
export function nameOfCompany(id) {
  return db.companies.find((c) => c.id === id)?.name ?? "—";
}
export function policyByIdSync(id) {
  return db.policies.find((p) => p.id === id) ?? null;
}
export function policyNumberOf(id) {
  return db.policies.find((p) => p.id === id)?.policyNumber ?? "—";
}
