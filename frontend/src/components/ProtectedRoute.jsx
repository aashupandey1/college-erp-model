import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRole,
}) {
    const { loading, isAuthenticated, user } = useAuth();

    if (loading) {
        return <h2>Loading...</h2>;
    }

    // Login nahi hua
    if (!isAuthenticated) {
        return (
            <Navigate
                to={`/login/${allowedRole || "admin"}`}
                replace
            />
        );
    }

    // Role match nahi hua
    if (allowedRole && user?.role !== allowedRole) {
        return <Navigate to={`/${user?.role || "admin"}`} replace />;
    }
    return children;
}