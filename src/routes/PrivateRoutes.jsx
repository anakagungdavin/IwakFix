// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = () => {
//     const token = localStorage.getItem("token");
//     return token ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Cek apakah user punya token

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
