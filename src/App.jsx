
// // import { RouterProvider } from "react-router-dom";
// // import router from "./routes/Routes";

// // function App() {
// //   return <RouterProvider router={router} />;
// // }

// // export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
// import SignInPage from "./pages/auth/signInPage";
// import SignUpPage from "./pages/auth/signUpPage";
// import Dashboard from "./pages/Dashboard";
// import PrivateRoute from "./routes/PrivateRoutes";
// import ProductManagement from "./pages/productmanage/ProductManagement";
// import AddProduct from "./pages/productmanage/AddProduct";
// import ViewProduct from "./pages/productmanage/viewProduct";
// import HistoryPage from "./pages/transaksi/historyPage";
// import ErrorPage from "./components/errorPage";
// import MainLayout from "./layout/mainLayout";
// import EditProduct from "./pages/productmanage/EditProduct";
// import UserList from "./pages/usermanagement/UserList";
// import UserProfile from "./pages/usermanagement/UserProfile";
// import EditProfile from "./pages/usermanagement/EditUserProfile";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Redirect ke /login jika belum login */}
//         <Route path="/" element={<Navigate to="/login" />} />
        
//         {/* Halaman Auth */}
//         <Route path="/login" element={<SignInPage />} />
//         <Route path="/register" element={<SignUpPage />} />

//         {/* Halaman yang membutuhkan autentikasi */}
//         <Route element={<PrivateRoute />}>
//           {/* <Route path="/dashboard" element={<Dashboard />} /> */}
//           <Route element={<MainLayout/>}>
//             <Route path="/dashboard" element={<Dashboard/>}/>
//             <Route path="/product-management" element={<ProductManagement />} />
//             <Route path="/product-management/add" element={<AddProduct />} />
//             <Route path="/product-management/edit/:id" element={<EditProduct />} />
//             <Route path="/product-management/view" element={<ViewProduct />} />
//             <Route path="/riwayat-transaksi" element={<HistoryPage />} />
//             <Route path="/customers" element={<UserList/>}/>
//             <Route path="/customers/edit/:id" element={<EditProfile/>}/>
//             {/* <Route path="/customers/user-profile" element={<UserProfile/>}/> */}
//           </Route>
//         </Route>
//         <Route path="*" element={<ErrorPage />} />
//       </Routes>
//     </Router>
//   );
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
import UserList from "./pages/usermanagement/UserList";
import UserProfile from "./pages/usermanagement/UserProfile";
import EditProfile from "./pages/usermanagement/EditUserProfile";
import DashboardCust from "./pages/customer/DashboardCust"
import AboutPage from "./pages/customer/About";
import TokoPage from "./pages/customer/Toko";
import ProfilePage from "./pages/customer/ProfilePage";
import ProfileCustEdit from "./pages/customer/ProfileCustEdit";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect ke /login jika belum login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Halaman Auth */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />

        {/* Role-based protected routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route element={<MainLayout />}>
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/product-management/add" element={<AddProduct />} />
            <Route path="/product-management/edit/:id" element={<EditProduct />} />
            <Route path="/product-management/view" element={<ViewProduct />} />
            <Route path="/riwayat-transaksi" element={<HistoryPage />} />
            <Route path="/customers" element={<UserList />} />
            <Route path="/customers/edit/:id" element={<EditProfile />} />
            <Route path="/customers/view" element={<UserProfile/>}/>
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
          {/* <Route path="/customer-dashboard" element={<DashboardCust />} /> */}
          <Route path="/customer-dashboard" element={<DashboardCust/>}/>
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/shop" element={<TokoPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/profile/edit" element={<ProfileCustEdit/>}/>

        </Route>

        {/* Jika akses ditolak */}
        <Route path="/unauthorized" element={<h1>403 - Unauthorized</h1>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
