import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Abhi loading ho rahi (localStorage check)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Logged in nahi? Login page pe bhejo
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in — page dikhao
  return children;
}

export default ProtectedRoute;