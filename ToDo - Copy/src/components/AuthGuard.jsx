import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthGuard({ children }) {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/signin" replace />;
}

export default AuthGuard;
