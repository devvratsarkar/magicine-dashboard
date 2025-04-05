import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
    const [permissions, setPermissions] = useState(() => {
        const storedPermissions = localStorage.getItem("permissions");
        return storedPermissions ? JSON.parse(storedPermissions) : {};
    });

    const [role, setRole] = useState(() => localStorage.getItem("role") || "");
    const [loading, setLoading] = useState(true);

    const fetchPermissions = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("Token is missing. Clearing permissions and role.");
            resetPermissions();
            setLoading(false);
            return;
        }

        try {
            console.log("Fetching user permissions...");
            const response = await axios.get(`${API_BASE_URL}/get-user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (response?.data?.http_status_code === 200) {
                const userPermissions = response.data.data.userPermissions || {};
                const userRole = response.data?.data?.role || "";

                if (!userRole) {
                    console.warn("Role is missing in the API response.");
                }

                setPermissions(userPermissions);
                setRole(userRole);
                localStorage.setItem("permissions", JSON.stringify(userPermissions));
                localStorage.setItem("role", userRole);
            } else {
                throw new Error("Invalid API response.");
            }
        } catch (err) {
            resetPermissions();
        } finally {
            setLoading(false);
        }
    };

    const resetPermissions = () => {
        console.log("Resetting permissions and role.");
        setPermissions({});
        setRole("");
        localStorage.removeItem("permissions");
        localStorage.removeItem("role");
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    return (
        <PermissionsContext.Provider
            value={{ permissions, setPermissions, role, setRole, loading, refreshPermissions: fetchPermissions }}
        >
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => useContext(PermissionsContext);
