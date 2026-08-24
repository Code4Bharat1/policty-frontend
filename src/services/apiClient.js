const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function request(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("policycare.token")
      : null;

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (options.params) {
    const cleanParams = Object.entries(options.params).filter(
      ([_, v]) => v !== undefined && v !== null && v !== "" && v !== "all"
    );
    if (cleanParams.length > 0) {
      const q = new URLSearchParams(cleanParams).toString();
      url += (url.includes("?") ? "&" : "?") + q;
    }
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr) {
    throw new Error(`Network connection error: ${netErr.message}`);
  }

  let json;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const errorMsg =
      json?.message ||
      (json?.errors && json.errors[0]?.message) ||
      `API request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  if (json === null) return {};
  return json.data !== undefined ? json.data : json;
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "POST",
      body: typeof FormData !== "undefined" && body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "PUT",
      body: typeof FormData !== "undefined" && body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "PATCH",
      body: typeof FormData !== "undefined" && body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: "DELETE" }),
};
