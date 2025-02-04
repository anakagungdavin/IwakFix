// import { useEffect,useState } from "react";
// import { Route, Router, Routes, useLocation } from 'react-router-dom';
// import Loader from "./common/Loader";
// import PageTitle from "./components/PageTitle";
// import Dashboard from "./pages/Dashboard.jsx";
// import ProductManagement from "./pages/productmanage/ProductManagement"
// import AddProduct from "./pages/productmanage/AddProduct.jsx";
// import Header from "./components/header/header.jsx";
// import SignInPage from "./pages/auth/signInPage";
// import SignUpPage from "./pages/auth/signUpPage";

// function App() {
//   return(
//     <div className="h-screen w-screen">
//       {/* <ProductManagement></ProductManagement> */}
//       {/* <Dashboard></Dashboard> */}
//       {/* <AddProduct></AddProduct> */}

//     </div>
//   );
// }

// export default App;


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/index";
import Dashboard from "./pages/Dashboard";
import ProductManagement from "./pages/productmanage/ProductManagement";

function App() {
    return (
      <Sidebar></Sidebar>
        // <Router>
        //     <div className="flex">
        //         <Sidebar />
        //         <div className="flex-1 p-10">
        //             <Routes>
        //                 <Route path="/dashboard" element={<Dashboard />} />
        //                 <Route path="/product-management" element={<ProductManagement />} />
        //                 <Route path="/customers" element={<h1>Customers</h1>} />
        //                 <Route path="/riwayat-transaksi" element={<h1>Riwayat Bukti Transaksi</h1>} />
        //                 <Route path="/tambah-produk" element={<h1>Tambah Produk</h1>} />
        //                 <Route path="/daftar-produk" element={<h1>Daftar Produk</h1>} />
        //             </Routes>
        //         </div>
        //     </div>
        // </Router>
    );
}

export default App;
