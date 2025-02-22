import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import Dashboard from "../pages/Dashboard";
import ProductManagement from "../pages/productmanage/ProductManagement";
import AddProduct from "../pages/productmanage/AddProduct";
import ErrorPage from "../components/errorPage";
import EditProduct from "../pages/productmanage/EditProduct";
import ViewProduct from "../pages/productmanage/viewProduct";
import UserList from "../pages/usermanagement/UserList";
import HistoryPage from "../pages/transaksi/historyPage";
import UserProfile from "../pages/usermanagement/UserProfile";
import EditUserProfile from "../pages/usermanagement/EditUserProfile";

const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,  
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "product-management",
          element: <ProductManagement />,
        },
        {
            path: "product-management/add",
            element: <AddProduct/>,
        },
        {
          path: "product-management/edit",
          element: <EditProduct/>,
        },
        {
          path: "product-management/view",
          element: <ViewProduct/>,
        },
        {
          path: "customers",
          element: <UserList />,
        },
        {
          path: "view",
          element: <UserProfile />
        },
        {
          path: "view/edit",
          element: <EditUserProfile />
        },
        {
          path: "riwayat-transaksi",
          element: <HistoryPage/>,
        },
      ],
      errorElement: <ErrorPage />,
    },
  ],
);
  

export default router;
