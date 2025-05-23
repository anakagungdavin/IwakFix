// src/App.jsx (atau path yang sesuai di proyek Anda)
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Halaman Auth
import SignInPage from "./pages/auth/signInPage";
import SignUpPage from "./pages/auth/signUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ResetPasswordPage from "./pages/auth/ResetPassword";
// import VerifyEmailPage from "./pages/auth/VerifyEmailPage"; // Rute ini akan redirect dari backend, jadi komponennya tidak langsung digunakan di sini
import ResendVerificationPage from "./pages/auth/ResendVerificationPage";
import AuthMessagePage from "./pages/auth/AuthMessagePage"; // <<==== TAMBAHKAN IMPORT INI

// Layouts dan Komponen lainnya
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoutes";
import ProductManagement from "./pages/productmanage/ProductManagement";
import AddProduct from "./pages/productmanage/AddProduct";
import ViewProduct from "./pages/productmanage/viewProduct";
import HistoryPage from "./pages/transaksi/historyPage";
import ErrorPage from "./components/errorPage";
import MainLayout from "./layout/mainLayout";
import EditProduct from "./pages/productmanage/EditProduct";
import UserList from "./pages/usermanagement/UserList";
import UserProfile from "./pages/usermanagement/UserProfile";
import EditProfile from "./pages/usermanagement/EditUserProfile";
import DashboardCust from "./pages/customer/DashboardCust";
import AboutPage from "./pages/customer/About";
import TokoPage from "./pages/customer/Toko";
import ProfilePage from "./pages/customer/ProfilePage";
import ProfileCustEdit from "./pages/customer/ProfileCustEdit";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import ProductPage from "./pages/customer/ProductPage";
import ChangeAddress from "./components/Customer/ChangeAddress";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect dari root ke customer dashboard */}
        <Route path="/" element={<Navigate to="/customer-dashboard" />} />

        {/* Halaman Auth */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Rute ini tidak lagi merender komponen langsung karena backend akan redirect */}
        {/* Jika Anda masih memiliki komponen VerifyEmailPage dan ingin menggunakannya untuk tujuan lain, Anda bisa uncomment impornya */}
        {/* Tapi untuk alur verifikasi via redirect, element={null} atau hapus rute ini sudah cukup jika tidak ada logika lain */}
        <Route path="/verify-email/:token" element={null} />

        {/* Rute baru untuk menampilkan pesan dari backend setelah redirect */}
        <Route path="/auth-message" element={<AuthMessagePage />} />

        {/* Opsional: Rute untuk kirim ulang email verifikasi */}
        <Route
          path="/resend-verification"
          element={<ResendVerificationPage />}
        />

        {/* Rute yang bisa diakses publik (tidak perlu login) */}
        <Route path="/customer-dashboard" element={<DashboardCust />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/shop" element={<TokoPage />} />
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Admin Routes (membutuhkan login sebagai 'admin') */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route element={<MainLayout />}>
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/product-management/add" element={<AddProduct />} />
            <Route
              path="/product-management/edit/:id"
              element={<EditProduct />}
            />
            <Route path="/product-management/view" element={<ViewProduct />} />
            <Route path="/riwayat-transaksi" element={<HistoryPage />} />
            <Route path="/customers" element={<UserList />} />
            <Route path="/customers/edit/:id" element={<EditProfile />} />
            <Route path="/customers/view/:id" element={<UserProfile />} />
          </Route>
        </Route>

        {/* Customer Routes (membutuhkan login sebagai 'customer') */}
        <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileCustEdit />} />
          <Route path="/change-address" element={<ChangeAddress />} />
        </Route>

        {/* Halaman Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-3xl font-bold text-red-600">
                403 - Akses Ditolak
              </h1>
            </div>
          }
        />
        {/* Halaman Error */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
