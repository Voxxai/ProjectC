import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Login from "../pages/Login";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.email 
            ? <Outlet /> : <Navigate to={'/Login'} state={{ from: location }} replace />
    );
}

export default RequireAuth;