
// import { RouterProvider } from "react-router-dom";
// import router from "./routes/Routes";

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import SignInPage from "./pages/auth/signInPage";
import SignUpPage from "./pages/auth/signUpPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoutes";
import ProductManagement from "./pages/productmanage/ProductManagement";
import AddProduct from "./pages/productmanage/AddProduct";
import ViewProduct from "./pages/productmanage/viewProduct";
import HistoryPage from "./pages/transaksi/historyPage";
import ErrorPage from "./components/errorPage";
import MainLayout from "./layout/mainLayout";
import EditProduct from "./pages/productmanage/EditProduct";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect ke /login jika belum login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Halaman Auth */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />

        {/* Halaman yang membutuhkan autentikasi */}
        <Route element={<PrivateRoute />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route element={<MainLayout/>}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/product-management/add" element={<AddProduct />} />
            <Route path="/product-management/edit/:id" element={<EditProduct />} />
            <Route path="/product-management/view" element={<ViewProduct />} />
            <Route path="/riwayat-transaksi" element={<HistoryPage />} />
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
