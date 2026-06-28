const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

const isValidToken = (token) =>
  Boolean(token && token !== "null" && token !== "undefined");

/**
 * Common API Service
 * All frontend requests should go through this function.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (isValidToken(token)) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: "Something went wrong" };
  }

  if (!response.ok) {
    if (response.status === 401 && isValidToken(token)) {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    }
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};