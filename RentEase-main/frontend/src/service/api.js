// API Base Configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/** Flatten DRF validation payloads into readable strings */
export function formatApiErrors(errorData) {
  if (!errorData || typeof errorData !== "object") return null;
  if (typeof errorData.detail === "string") return errorData.detail;
  if (typeof errorData.error === "string") return errorData.error;

  const collect = (value, acc) => {
    if (Array.isArray(value)) {
      value.forEach((item) => collect(item, acc));
      return;
    }
    if (value && typeof value === "object") {
      Object.values(value).forEach((item) => collect(item, acc));
      return;
    }
    if (value !== null && value !== undefined && String(value).trim()) {
      acc.push(String(value));
    }
  };

  const acc = [];
  Object.entries(errorData).forEach(([key, val]) => {
    if (key === "detail" || key === "error") return;
    collect(val, acc);
  });
  return acc.length ? acc.join(" ") : null;
}

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  const isFormData = options.body instanceof FormData;

  if (token && isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    throw new Error("Session expired. Please login again.");
  }
  
  const config = {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    let message = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      const flattened = formatApiErrors(errorData);
      message = flattened || message;
    } catch {
      // Keep default message when the response body is not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default apiCall;
