import React, { useEffect, useState } from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "../commondata/PermissionContext";
import Loader from "../layouts/layoutcomponents/loader";

const ProtectedRoute = ({ children }) => {
    const [isTokenValid, setIsTokenValid] = useState(null); // Track token validity
    const navigate = useNavigate();
    const { permissions, role, loading: permissionsLoading } = usePermissions(); // Permissions context

    // Function to check if the token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;

        try {
            const [header, payload] = token.split('.');
            if (!header || !payload) return true;

            const decodedPayload = JSON.parse(
                atob(payload.replace(/_/g, '/').replace(/-/g, '+'))
            );
            const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
            return Date.now() > expirationTime;
        } catch (e) {
            console.error("Error decoding token:", e);
            return true;
        }
    };

    // Check token validity
    useEffect(() => {
        const tokenData = localStorage.getItem("token");
        if (tokenData && isTokenExpired(tokenData)) {
            localStorage.removeItem("token");
            setIsTokenValid(false);
        } else {
            setIsTokenValid(!!tokenData);
        }
    }, []);

    // Redirect if token is invalid
    useEffect(() => {
        if (isTokenValid === false) {
            navigate("/login"); // Redirect to login
        }
    }, [isTokenValid, navigate]);

    // Loader while permissions are being fetched or token validity is being checked
    if (isTokenValid === null || permissionsLoading) {
        return <Loader />;
    }

    // Redirect if permissions or role are not available
    if (!role || Object.keys(permissions).length === 0) {
        return <Navigate to="/login" />;
    }

    // Render children or nested routes if everything is valid
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
