import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const returnPath = `${location.pathname}${location.search || ""}`;
    return <Navigate to="/login" replace state={{ from: returnPath }} />;
  }

  return children;
};

export default ProtectedRoute;
