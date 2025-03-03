// import { Outlet, Navigate } from "react-router-dom";

// const PrivateRoute = () => {
//   const isAuthenticated = !!localStorage.getItem("token"); // Cek apakah user punya token

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;

// import { Navigate, Outlet } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// const PrivateRoute = ({ allowedRoles }) => {
//   const { user } = useContext(AuthContext);

//   if (!user) return <Navigate to="/login" />;
//   if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

//   return <Outlet />;
// };

// export default PrivateRoute;

import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("Token:", token);
  console.log("Role:", role);
  console.log("Allowed Roles:", allowedRoles);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoute;


