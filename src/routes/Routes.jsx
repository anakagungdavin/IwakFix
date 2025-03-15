import { createBrowserRouter, Navigate } from "react-router-dom";
import SignInPage from "../pages/auth/signInPage";
import SignUpPage from "../pages/auth/signUpPage";
import MainLayout from "../layout/mainLayout";
import Dashboard from "../pages/Dashboard";
import ProductManagement from "../pages/productmanage/ProductManagement";
import AddProduct from "../pages/productmanage/AddProduct";
import ErrorPage from "../components/errorPage";
import EditProduct from "../pages/productmanage/EditProduct";
import ViewProduct from "../pages/productmanage/viewProduct";
import HistoryPage from "../pages/transaksi/historyPage";
import OTPVerification from "../components/forms/auth/OTPVerification";
import PrivateRoute from "../routes/PrivateRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <MainLayout />,
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <SignInPage />,
  },
  {
    path: "/register",
    element: <SignUpPage />,
  },
  {
    path: "/otp-verification", // Add new route for OTP verification
    element: <OTPVerification />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <MainLayout />,
      },
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "product-management",
        element: <ProductManagement />,
      },
      {
        path: "product-management/add",
        element: <AddProduct />,
      },
      {
        path: "product-management/edit",
        element: <EditProduct />,
      },
      {
        path: "product-management/view",
        element: <ViewProduct />,
      },
      {
        path: "riwayat-transaksi",
        element: <HistoryPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
