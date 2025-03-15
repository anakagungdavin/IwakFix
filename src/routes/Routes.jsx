import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import Dashboard from "../pages/Dashboard";
//import ProductManagement from "../pages/productmanage/ProductManagement";
import AddProduct from "../pages/productmanage/AddProduct";
import ErrorPage from "../components/errorPage";
import EditProduct from "../pages/productmanage/EditProduct";
import ViewProduct from "../pages/productmanage/viewProduct";
import UserList from "../pages/usermanagement/UserList";
import HistoryPage from "../pages/transaksi/historyPage";
import UserProfile from "../pages/usermanagement/UserProfile";
import EditUserProfile from "../pages/usermanagement/EditUserProfile";
import ProductPage from "../pages/customer/ProductPage";
import DashboardCust from "../pages/customer/DashboardCust";
import CheckoutPage from "../pages/customer/CheckoutPage";
import AboutPage from "../pages/customer/About";
import CartPage from "../pages/customer/CartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardCust />,
  },
  {
    path: "/customer/product/:id",
    element: <ProductPage />,
  },
  {
    path: "/customer/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
]);

export default router;
