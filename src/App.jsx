import { useEffect,useState } from "react";
import { Route, Router, Routes, useLocation } from 'react-router-dom';
import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import Dashboard from "./pages/Dashboard.jsx";
import ProductManagement from "./pages/productmanage/ProductManagement"
import AddProduct from "./pages/productmanage/AddProduct.jsx";
import Header from "./components/header/header.jsx";
import SignInPage from "./pages/auth/signInPage";
import SignUpPage from "./pages/auth/signUpPage";
function App() {
  return(
    <div className="h-screen w-screen">
      {/* <ProductManagement></ProductManagement> */}
      {/* <Dashboard></Dashboard> */}
      {/* <AddProduct></AddProduct> */}
      <SignUpPage></SignUpPage>
    </div>
  );
}

export default App;


