// import { useEffect,useState } from "react";
// import { Route, Router, RouterProvider, Routes, useLocation } from 'react-router-dom';
// import Loader from "./common/Loader";
// import PageTitle from "./components/PageTitle";
// import Dashboard from "./pages/Dashboard.jsx";
// import ProductManagement from "./pages/productmanage/ProductManagement"
// import Sidebar from "./components/sidebar/index.jsx";
// import router from "./routes/index.jsx";

// function App() {
//   return(
//     <div className="h-screen w-screen">
//       <RouterProvider router={router} />
//       {/* <ProductManagement></ProductManagement> */}
//       {/* // <Dashboard></Dashboard> */}
//       {/* <AddProduct></AddProduct> */}
    

//     </div>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";
// import { useLocation, Route, Routes } from "react-router-dom";

// import Loader from './common/Loader';
// import PageTitle from "./components/PageTitle";
// import MainLayout from "./layout/mainLayout";
// import Dashboard from "./pages/Dashboard";
// import ProductManagement from "./pages/productmanage/ProductManagement";

// function App () {
//   const [loading, setLoading] = useState(true);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   return loading ? (
//     <Loader />
//   ) : (
//     <MainLayout>
//       <Routes>
//         <Route
//           index
//           element={
//             <>
//               <PageTitle title="iwak. Dashboard" />
//               <Dashboard />
//             </>
//           }
//         />
//         <Route
//           path="/product-management"
//           element={
//             <>
//               <PageTitle title="Produk Menejemen" />
//               <ProductManagement/>
//             </>
//           }
//         />
//       </Routes>
//     </MainLayout>
//   );
// }

// export default App;
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import MainLayout from "./layout/mainLayout";
// import Dashboard from "./pages/Dashboard";
// import ProductManagement from "./pages/productmanage/ProductManagement";
// import AddProduct from "./pages/productmanage/AddProduct";
// import ErrorPage from "./components/errorPage";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<MainLayout />}>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="product-management" element={<ProductManagement />} />
//           <Route path="product-management/add" element={<AddProduct/>}/>
//         </Route>
//         <Route path="*" element={<ErrorPage/>}/>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
