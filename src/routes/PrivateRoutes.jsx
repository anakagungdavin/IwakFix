import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // Detailed logging for debugging
  console.log("PrivateRoute - Token:", token || "null");
  console.log("PrivateRoute - Role:", role || "null");
  console.log("PrivateRoute - Allowed Roles:", allowedRoles);
  console.log("PrivateRoute - Current Path:", location.pathname);

  // Check for no token
  if (!token) {
    console.log("PrivateRoute - No token, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // Redirect admin to /admin-dashboard if accessing /profile
  if (role === "admin" && location.pathname === "/profile") {
    console.log(
      "PrivateRoute - Admin accessing /profile, redirecting to /admin-dashboard"
    );
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Check if role is allowed
  if (!role || !allowedRoles.includes(role)) {
    console.log(
      `PrivateRoute - Role ${
        role || "null"
      } not in allowed roles ${allowedRoles}, redirecting to /unauthorized`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized, render child routes
  console.log("PrivateRoute - Authorized, rendering Outlet");
  return <Outlet />;
};

export default PrivateRoute;
