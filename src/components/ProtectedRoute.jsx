import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center p-2">
        <div className="w-4 h-4 border-4 border-dashed rounded-full animate-spin border-white mx-auto"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
