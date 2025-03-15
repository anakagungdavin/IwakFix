import React from "react";
import { useLocation } from "react-router-dom";
import ProductDetails from "../../components/Customer/productDetails";
import HeaderCust from "../../components/Customer/headerCust";
import ProductOverview from "../../components/Customer/ProductOverview";
import ProductRecommendations from "../../components/Customer/productRecommendation";
import FooterCust from "../../components/Customer/footerCust";

const ProductPage = () => {
  const location = useLocation();
  const fish = location.state?.fish || null;

  return (
    <div>
        <HeaderCust/>
        <ProductOverview fish={fish} />
        <ProductDetails fish={fish} />
        <ProductRecommendations />
        <FooterCust/>
    </div>
  );
};

export default ProductPage;
