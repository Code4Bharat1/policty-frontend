import { apiClient } from "./apiClient";

// In-memory entity registries for instantaneous UI lookups
const customerCache = new Map();
const agentCache = new Map();
const productCache = new Map();
const companyCache = new Map();
const policyCache = new Map();

function registerEntities(items, cache) {
  if (Array.isArray(items)) {
    items.forEach((item) => {
      if (item?.id) cache.set(item.id, item);
    });
  } else if (items?.id) {
    cache.set(items.id, items);
  }
}

export const catalogService = {
  categories: () => apiClient.get("/catalog/categories"),

  companies: () =>
    apiClient.get("/catalog/companies").then((res) => {
      registerEntities(res, companyCache);
      return res;
    }),

  company: (id) =>
    apiClient.get(`/catalog/companies/${id}`).then((res) => {
      registerEntities(res, companyCache);
      return res;
    }),

  createCompany: (data) =>
    apiClient.post("/catalog/companies", data).then((res) => {
      registerEntities(res, companyCache);
      return res;
    }),

  updateCompany: (id, data) =>
    apiClient.put(`/catalog/companies/${id}`, data).then((res) => {
      registerEntities(res, companyCache);
      return res;
    }),

  deleteCompany: (id) => apiClient.delete(`/catalog/companies/${id}`),

  products: (filters) =>
    apiClient.get("/catalog/products", { params: filters }).then((res) => {
      registerEntities(res, productCache);
      return res;
    }),

  product: (id) =>
    apiClient.get(`/catalog/products/${id}`).then((res) => {
      registerEntities(res, productCache);
      return res;
    }),

  createProduct: (data) =>
    apiClient.post("/catalog/products", data).then((res) => {
      registerEntities(res, productCache);
      return res;
    }),

  updateProduct: (id, data) =>
    apiClient.put(`/catalog/products/${id}`, data).then((res) => {
      registerEntities(res, productCache);
      return res;
    }),

  deleteProduct: (id) => apiClient.delete(`/catalog/products/${id}`),

  faqs: () => apiClient.get("/catalog/faqs"),
  createFaq: (data) => apiClient.post("/catalog/faqs", data),
  updateFaq: (id, data) => apiClient.put(`/catalog/faqs/${id}`, data),
  deleteFaq: (id) => apiClient.delete(`/catalog/faqs/${id}`),

  blogPosts: () => apiClient.get("/catalog/blogs"),
  blogPost: (id) => apiClient.get(`/catalog/blogs/${id}`),
  createBlogPost: (data) => apiClient.post("/catalog/blogs", data),
  updateBlogPost: (id, data) => apiClient.put(`/catalog/blogs/${id}`, data),
  deleteBlogPost: (id) => apiClient.delete(`/catalog/blogs/${id}`),

  testimonials: () => apiClient.get("/catalog/testimonials"),
  createTestimonial: (data) => apiClient.post("/catalog/testimonials", data),
  updateTestimonial: (id, data) => apiClient.put(`/catalog/testimonials/${id}`, data),
  deleteTestimonial: (id) => apiClient.delete(`/catalog/testimonials/${id}`),
};

export const customerService = {
  list: (params) =>
    apiClient.get("/customers", { params }).then((res) => {
      registerEntities(res?.data || res, customerCache);
      return res;
    }),

  get: (id) =>
    apiClient.get(`/customers/${id}`).then((res) => {
      registerEntities(res, customerCache);
      return res;
    }),

  create: (data) =>
    apiClient.post("/customers", data).then((res) => {
      registerEntities(res, customerCache);
      return res;
    }),

  update: (id, data) =>
    apiClient.put(`/customers/${id}`, data).then((res) => {
      registerEntities(res, customerCache);
      return res;
    }),

  delete: (id) => apiClient.delete(`/customers/${id}`),
};

export const agentService = {
  list: (params) =>
    apiClient.get("/agents", { params }).then((res) => {
      registerEntities(res?.data || res, agentCache);
      return res;
    }),

  get: (id) =>
    apiClient.get(`/agents/${id}`).then((res) => {
      registerEntities(res, agentCache);
      return res;
    }),

  create: (data) =>
    apiClient.post("/agents", data).then((res) => {
      registerEntities(res, agentCache);
      return res;
    }),

  update: (id, data) =>
    apiClient.put(`/agents/${id}`, data).then((res) => {
      registerEntities(res, agentCache);
      return res;
    }),

  delete: (id) => apiClient.delete(`/agents/${id}`),

  performance: () => apiClient.get("/agents/performance"),
};

export const policyService = {
  list: (scope) =>
    apiClient.get("/policies", { params: scope }).then((res) => {
      registerEntities(res?.data || res, policyCache);
      return res;
    }),

  get: (id) =>
    apiClient.get(`/policies/${id}`).then((res) => {
      registerEntities(res, policyCache);
      return res;
    }),

  renewals: (scope) => apiClient.get("/policies/renewals", { params: scope }),

  create: (data) =>
    apiClient.post("/policies", data).then((res) => {
      registerEntities(res, policyCache);
      return res;
    }),

  update: (id, data) =>
    apiClient.put(`/policies/${id}`, data).then((res) => {
      registerEntities(res, policyCache);
      return res;
    }),

  renew: (id, data) => apiClient.put(`/policies/${id}/renew`, data),

  updateStatus: (id, status) => apiClient.put(`/policies/${id}/status`, { status }),

  delete: (id) => apiClient.delete(`/policies/${id}`),
};

export const claimService = {
  list: (scope) => apiClient.get("/claims", { params: scope }),
  get: (id) => apiClient.get(`/claims/${id}`),
  submit: (payload) => apiClient.post("/claims", payload),
  update: (id, data) => apiClient.put(`/claims/${id}`, data),
  updateStatus: (id, status, remarks, approvedAmount) =>
    apiClient.put(`/claims/${id}/status`, { status, remarks, approvedAmount }),
  delete: (id) => apiClient.delete(`/claims/${id}`),
};

export const quoteService = {
  list: (scope) => apiClient.get("/quotes", { params: scope }),
  get: (id) => apiClient.get(`/quotes/${id}`),
  request: (payload) => apiClient.post("/quotes/request", payload),
};

export const paymentService = {
  list: (scope) => apiClient.get("/payments", { params: scope }),
  create: (payload) => apiClient.post("/payments", payload),
};

export const leadService = {
  list: (params) => apiClient.get("/leads", { params }),
  get: (id) => apiClient.get(`/leads/${id}`),
  create: (data) => apiClient.post("/leads", data),
  update: (id, data) => apiClient.put(`/leads/${id}`, data),
};

export const followUpService = {
  list: (params) => apiClient.get("/follow-ups", { params }),
  create: (data) => apiClient.post("/follow-ups", data),
  update: (id, data) => apiClient.put(`/follow-ups/${id}`, data),
};

export const commissionService = {
  list: (params) => apiClient.get("/commissions", { params }),
  pay: (id) => apiClient.put(`/commissions/${id}/pay`),
};

export const documentService = {
  list: (params) => apiClient.get("/documents", { params }),
  upload: (formData) => apiClient.post("/documents/upload", formData),
  downloadUrl: (id) => `/api/v1/documents/${id}/download`,
  delete: (id) => apiClient.delete(`/documents/${id}`),
};

export const notificationService = {
  list: (params) =>
    apiClient.get("/notifications", {
      params: typeof params === "string" ? { scope: params } : params,
    }),
  markRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllRead: () => apiClient.put("/notifications/read-all"),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
  broadcast: (data) => apiClient.post("/notifications/broadcast", data),
};

export const auditService = {
  list: (params) => apiClient.get("/audit-logs", { params }),
};

export const enquiryService = {
  submit: (data) => apiClient.post("/enquiries", data),
  list: (params) => apiClient.get("/enquiries", { params }),
  get: (id) => apiClient.get(`/enquiries/${id}`),
  update: (id, data) => apiClient.patch(`/enquiries/${id}`, data),
  delete: (id) => apiClient.delete(`/enquiries/${id}`),
};

export const cmsService = {
  createFaq: (data) => apiClient.post("/cms/faqs", data),
  updateFaq: (id, data) => apiClient.put(`/cms/faqs/${id}`, data),
  deleteFaq: (id) => apiClient.delete(`/cms/faqs/${id}`),

  createBlog: (data) => apiClient.post("/cms/blogs", data),
  updateBlog: (id, data) => apiClient.put(`/cms/blogs/${id}`, data),
  deleteBlog: (id) => apiClient.delete(`/cms/blogs/${id}`),

  createTestimonial: (data) => apiClient.post("/cms/testimonials", data),
  updateTestimonial: (id, data) => apiClient.put(`/cms/testimonials/${id}`, data),
  deleteTestimonial: (id) => apiClient.delete(`/cms/testimonials/${id}`),
};

export const settingsService = {
  get: () => apiClient.get("/settings"),
  update: (data) => apiClient.patch("/settings", data),
};

export const reportService = {
  series: () => apiClient.get("/reports/series"),
  summary: () => apiClient.get("/reports/summary"),
};

export const authService = {
  forgotPassword: (email) => apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => apiClient.post("/auth/reset-password", { token, password }),
  changePassword: (currentPassword, newPassword) =>
    apiClient.put("/auth/change-password", { currentPassword, newPassword }),
  acceptInvite: (token, password) => apiClient.post("/auth/accept-invite", { token, password }),
};

// Synchronous formatters and lookup helpers
export function nameOfCustomer(id) {
  if (!id) return "—";
  return customerCache.get(id)?.name || "—";
}
export function nameOfAgent(id) {
  if (!id) return "Unassigned";
  return agentCache.get(id)?.name || "Unassigned";
}
export function nameOfProduct(id) {
  if (!id) return "—";
  return productCache.get(id)?.name || "—";
}
export function nameOfCompany(id) {
  if (!id) return "—";
  return companyCache.get(id)?.name || "—";
}
export function policyByIdSync(id) {
  if (!id) return null;
  return policyCache.get(id) || null;
}
export function policyNumberOf(id) {
  if (!id) return "—";
  return policyCache.get(id)?.policyNumber || "—";
}
