import * as db from "@/data/mock";
import { apiClient } from "./apiClient";

const LATENCY = 150;

function respond(data) {
  return new Promise((resolve) => setTimeout(() => resolve(data), LATENCY));
}

// Wrapper that calls the live API with fallback to mock data on error
async function withFallback(apiPromise, mockFallback) {
  try {
    return await apiPromise;
  } catch (error) {
    console.warn("[Service] Backend call failed, using mock data:", error.message);
    return typeof mockFallback === "function" ? mockFallback() : mockFallback;
  }
}

export const catalogService = {
  categories: () =>
    withFallback(apiClient.get("/catalog/categories"), () => respond(db.categories)),

  companies: () =>
    withFallback(apiClient.get("/catalog/companies"), () => respond(db.companies)),

  company: (id) =>
    withFallback(
      apiClient.get(`/catalog/companies/${id}`),
      () => respond(db.companies.find((c) => c.id === id) ?? null)
    ),

  products: (filters) =>
    withFallback(
      apiClient.get("/catalog/products", { params: filters }),
      () => {
        let list = db.products;
        if (filters?.q) {
          const q = filters.q.toLowerCase();
          list = list.filter(
            (p) =>
              p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
          );
        }
        if (filters?.category && filters.category !== "all")
          list = list.filter((p) => p.category === filters.category);
        if (filters?.companyId && filters.companyId !== "all")
          list = list.filter((p) => p.companyId === filters.companyId);
        if (filters?.maxPremium)
          list = list.filter((p) => p.minPremium <= filters.maxPremium);
        return respond(list);
      }
    ),

  product: (id) =>
    withFallback(
      apiClient.get(`/catalog/products/${id}`),
      () => respond(db.products.find((p) => p.id === id) ?? null)
    ),

  faqs: () => withFallback(apiClient.get("/catalog/faqs"), () => respond(db.faqs)),

  blogPosts: () =>
    withFallback(apiClient.get("/catalog/blogs"), () => respond(db.blogPosts)),

  blogPost: (id) =>
    withFallback(
      apiClient.get(`/catalog/blogs/${id}`),
      () => respond(db.blogPosts.find((b) => b.id === id) ?? null)
    ),

  testimonials: () =>
    withFallback(apiClient.get("/catalog/testimonials"), () => respond(db.testimonials)),
};

export const customerService = {
  list: (agentId) =>
    withFallback(
      apiClient.get("/customers", { params: { agentId } }),
      () => respond(agentId ? db.customers.filter((c) => c.agentId === agentId) : db.customers)
    ),

  get: (id) =>
    withFallback(
      apiClient.get(`/customers/${id}`),
      () => respond(db.customers.find((c) => c.id === id) ?? null)
    ),
};

export const agentService = {
  list: () => withFallback(apiClient.get("/agents"), () => respond(db.agents)),

  get: (id) =>
    withFallback(
      apiClient.get(`/agents/${id}`),
      () => respond(db.agents.find((a) => a.id === id) ?? null)
    ),

  performance: () =>
    withFallback(
      apiClient.get("/agents/performance"),
      () =>
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
              commission: db.commissions
                .filter((c) => c.agentId === a.id)
                .reduce((s, c) => s + c.amount, 0),
            };
          })
        )
    ),
};

export const policyService = {
  list: (scope) =>
    withFallback(
      apiClient.get("/policies", { params: scope }),
      () =>
        respond(
          db.policies.filter(
            (p) =>
              (!scope?.customerId || p.customerId === scope.customerId) &&
              (!scope?.agentId || p.agentId === scope.agentId)
          )
        )
    ),

  get: (id) =>
    withFallback(
      apiClient.get(`/policies/${id}`),
      () => respond(db.policies.find((p) => p.id === id) ?? null)
    ),

  renewals: (scope) =>
    withFallback(
      apiClient.get("/policies/renewals", { params: scope }),
      () =>
        respond(
          db.policies.filter(
            (p) =>
              (p.status === "Expiring Soon" || p.status === "Expired") &&
              (!scope?.customerId || p.customerId === scope.customerId) &&
              (!scope?.agentId || p.agentId === scope.agentId)
          )
        )
    ),
};

export const claimService = {
  list: (scope) =>
    withFallback(
      apiClient.get("/claims", { params: scope }),
      () =>
        respond(
          db.claims.filter(
            (c) =>
              (!scope?.customerId || c.customerId === scope.customerId) &&
              (!scope?.agentId || c.agentId === scope.agentId)
          )
        )
    ),

  get: (id) =>
    withFallback(
      apiClient.get(`/claims/${id}`),
      () => respond(db.claims.find((c) => c.id === id) ?? null)
    ),
};

export const quoteService = {
  list: (scope) =>
    withFallback(
      apiClient.get("/quotes", { params: scope }),
      () =>
        respond(
          db.quotes.filter(
            (q) =>
              (!scope?.customerId || q.customerId === scope.customerId) &&
              (!scope?.agentId || q.agentId === scope.agentId)
          )
        )
    ),

  get: (id) =>
    withFallback(
      apiClient.get(`/quotes/${id}`),
      () => respond(db.quotes.find((q) => q.id === id) ?? null)
    ),

  request: (payload) =>
    withFallback(
      apiClient.post("/quotes/request", payload),
      () =>
        respond({
          ok: true,
          quoteNumber: `QTE-2026-${Math.floor(Math.random() * 9000) + 1000}`,
          ...payload,
        })
    ),
};

export const paymentService = {
  list: (scope) =>
    withFallback(
      apiClient.get("/payments", { params: scope }),
      () => respond(db.payments.filter((p) => !scope?.customerId || p.customerId === scope.customerId))
    ),
};

export const leadService = {
  list: (agentId) =>
    withFallback(
      apiClient.get("/leads", { params: { agentId } }),
      () => respond(agentId ? db.leads.filter((l) => l.agentId === agentId) : db.leads)
    ),

  get: (id) =>
    withFallback(
      apiClient.get(`/leads/${id}`),
      () => respond(db.leads.find((l) => l.id === id) ?? null)
    ),
};

export const followUpService = {
  list: (agentId) =>
    withFallback(
      apiClient.get("/follow-ups", { params: { agentId } }),
      () => respond(agentId ? db.followUps.filter((f) => f.agentId === agentId) : db.followUps)
    ),
};

export const commissionService = {
  list: (agentId) =>
    withFallback(
      apiClient.get("/commissions", { params: { agentId } }),
      () => respond(agentId ? db.commissions.filter((c) => c.agentId === agentId) : db.commissions)
    ),
};

export const documentService = {
  list: (customerId) =>
    withFallback(
      apiClient.get("/documents", { params: { customerId } }),
      () => respond(customerId ? db.documents.filter((d) => d.customerId === customerId) : db.documents)
    ),
};

export const notificationService = {
  list: (scope) =>
    withFallback(
      apiClient.get("/notifications", { params: { scope } }),
      () => respond(db.notifications.filter((n) => n.userScope === scope || n.userScope === "ALL"))
    ),
};

export const auditService = {
  list: () =>
    withFallback(
      apiClient.get("/reports/audit-logs"),
      () => respond(db.auditLogs)
    ),
};

export const reportService = {
  series: () =>
    withFallback(
      apiClient.get("/reports/series"),
      () => respond(db.monthlySeries)
    ),
};

// Synchronous formatters and lookup helpers
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
