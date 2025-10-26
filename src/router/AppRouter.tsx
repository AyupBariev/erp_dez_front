import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Reports from "../pages/Reports/Reports";
import Orders from "../pages/Orders/Orders";
import AssignOrders from "../pages/AssignOrders/AssignOrders";
import Layout from "../components/layout/Layout";
import SIManagement from "../pages/SIManagement/SIManagement.tsx";

export default function AppRouter() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            {isAuthenticated ? (
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reports" element={<Reports />} />

                    <Route path="/orders" element={<Orders />} />
                    <Route path="/assign-orders" element={<AssignOrders />} />

                    <Route path="/si-management" element={<SIManagement />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>
            ) : (
                <Route path="*" element={<Navigate to="/login" />} />
            )}
        </Routes>
    );
}
