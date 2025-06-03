// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast"; // <<==== IMPORT TOASTER DI SINI ====>>

// <<==== IMPORT PAGE TRACKER ====>>
import PageTracker from "./components/PageTracker";

// Halaman Auth
import SignInPage from "./pages/auth/signInPage";
import SignUpPage from "./pages/auth/signUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import ResendVerificationPage from "./pages/auth/ResendVerificationPage";
import AuthMessagePage from "./pages/auth/AuthMessagePage";

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

// Halaman Customer
import DashboardCust from "./pages/customer/DashboardCust";
import AboutPage from "./pages/customer/About";
import TokoPage from "./pages/customer/Toko";
import ProfilePage from "./pages/customer/ProfilePage";
import ProfileCustEdit from "./pages/customer/ProfileCustEdit";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import ProductPage from "./pages/customer/ProductPage";
import ChangeAddress from "./components/Customer/ChangeAddress";

// <<==== IMPORT HALAMAN ADMINISTRASI DATABASE ====>>
import DatabaseAdminPage from "./pages/admin/DatabaseAdminPage";

function App() {
  return (
    // Anda bisa membungkus Router dengan React.Fragment (<> </>) jika Toaster di luar Router,
    // atau letakkan Toaster di dalam Router sebelum Routes jika Anda lebih suka.
    // Untuk kesederhanaan, meletakkannya di dalam Router sebelum Routes juga umum.
    <Router>
      {/* <<==== RENDER TOASTER DI SINI, DI DALAM ROUTER, SEBELUM ROUTES ====>> */}
      <Toaster
        position="top-center" // Contoh posisi
        reverseOrder={false}
        gutter={8} // Jarak antar toast
        containerClassName="" // Kelas untuk container
        containerStyle={{}} // Style inline untuk container
        toastOptions={{
          // Opsi default
          className: "", // Kelas untuk setiap toast
          duration: 5000, // Default 5 detik
          style: {
            background: "#333", // Warna latar belakang toast
            color: "#fff", // Warna teks toast
            fontSize: "15px",
          },
          // Opsi default per jenis
          success: {
            duration: 3000,
            // theme: { // 'theme' tidak ada di opsi default, gunakan style atau className
            //   primary: 'green',
            //   secondary: 'black',
            // },
            iconTheme: {
              // Opsi untuk ikon sukses
              primary: "#10B981", // Warna ikon (hijau)
              secondary: "#fff", // Warna background ikon
            },
            style: {
              background: "#10B981", // Hijau untuk sukses
              color: "#fff",
            },
          },
          error: {
            duration: 5000, // Error tampil lebih lama
            iconTheme: {
              primary: "#EF4444", // Warna ikon (merah)
              secondary: "#fff",
            },
            style: {
              background: "#EF4444", // Merah untuk error
              color: "#fff",
            },
          },
          loading: {
            style: {
              background: "#3B82F6", // Biru untuk loading
              color: "#fff",
            },
          },
        }}
      />

      {/* <<==== RENDER PAGE TRACKER DI SINI, DI DALAM ROUTER ====>> */}
      <PageTracker />

      <Routes>
        {/* Redirect dari root ke customer dashboard */}
        <Route path="/" element={<Navigate to="/customer-dashboard" />} />

        {/* Halaman Auth */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/auth-message" element={<AuthMessagePage />} />
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
            <Route path="/admin/database" element={<DatabaseAdminPage />} />
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
