import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch, AUTH_UNAUTHORIZED_EVENT } from "../services/api";

const AuthContext = createContext();

const isValidToken = (token) =>
  Boolean(token && token !== "null" && token !== "undefined");

const normalizeUser = (userData) => ({
  id: userData.id || userData._id,
  name: userData.name,
  role: userData.role,
  identifier: userData.identifier,
  email: userData.email,
  department: userData.department,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [logout]);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");

      if (!isValidToken(storedToken)) {
        logout();
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch("/auth/me");
        const normalizedUser = normalizeUser(data.user);

        localStorage.setItem("user", JSON.stringify(normalizedUser));
        setToken(storedToken);
        setUser(normalizedUser);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [logout]);

  const login = (userData, jwtToken) => {
    const normalizedUser = normalizeUser(userData);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    setToken(jwtToken);
    setUser(normalizedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}