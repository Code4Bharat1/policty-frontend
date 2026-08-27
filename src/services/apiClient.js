const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function performTokenRefresh() {
  const currentRefreshToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem("policycare.refreshToken")
      : null;

  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ refreshToken: currentRefreshToken || undefined }),
  });

  if (!res.ok) {
    throw new Error("Refresh token expired");
  }

  const json = await res.json();
  const newToken = json?.data?.accessToken || json?.data?.token;
  const newRefreshToken = json?.data?.refreshToken;

  if (typeof window !== "undefined" && newToken) {
    window.localStorage.setItem("policycare.token", newToken);
    if (newRefreshToken) {
      window.localStorage.setItem("policycare.refreshToken", newRefreshToken);
    }
  }

  return newToken;
}

export async function request(endpoint, options = {}, isRetry = false) {
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
      credentials: "include",
    });
  } catch (netErr) {
    throw new Error(`Network connection error: ${netErr.message}`);
  }

  // Handle 401 Unauthorized with Silent Auto-Refresh
  const isAuthEndpoint =
    endpoint.includes("/auth/login") ||
    endpoint.includes("/auth/register") ||
    endpoint.includes("/auth/refresh-token") ||
    endpoint.includes("/auth/verify-registration");

  if (response.status === 401 && !isRetry && !isAuthEndpoint && typeof window !== "undefined") {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await performTokenRefresh();
        isRefreshing = false;
        onRefreshed(newToken);
        return request(endpoint, options, true);
      } catch (refreshErr) {
        isRefreshing = false;
        refreshSubscribers = [];
        window.localStorage.removeItem("policycare.token");
        window.localStorage.removeItem("policycare.refreshToken");
        window.localStorage.removeItem("policycare.session");
        if (window.location.pathname !== "/login") {
          window.location.href = `/login?session_expired=true`;
        }
        throw new Error("Your session has expired. Please sign in again.");
      }
    } else {
      // Queue concurrent requests until refresh completes
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (newToken) {
            resolve(request(endpoint, options, true));
          } else {
            reject(new Error("Session expired"));
          }
        });
      });
    }
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
