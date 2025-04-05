import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { usePermissions } from "./PermissionContext";
import { useGetUserProfileQuery } from "../redux/features/commonApiCall";

const RouteGuard = ({ children, requiredPermissions = [] }) => {
    const { permissions, role, loading } = usePermissions();
    const location = useLocation();



    const { data, refetch } = useGetUserProfileQuery()

    if (loading) {
        return <Loader />;
    }

    if (data?.data?.status == false) {
        toast.error("Your account is Inactivated by admin");
        localStorage.clear()
        return <Navigate to="/" />;
    }

    // If user is an admin, allow access to all routes
    if (role === "Admin") {
        return children;
    }

    // Check if user has the required permissions
    const hasPermission = requiredPermissions.every((permission) => {

        const categoryPermissions = permissions[permission.category] || [];
        return categoryPermissions.includes(permission.action);
    });

    if (!hasPermission) {
        toast.error("You don't have permission to access this module.");
        return <Navigate to="/dashboard" state={{ from: location }} />;
    }

    return children;
};

export default RouteGuard;