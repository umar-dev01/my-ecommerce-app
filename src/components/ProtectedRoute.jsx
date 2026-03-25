import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/Login" />;
  }
  return children;
}
export default ProtectedRoute;
