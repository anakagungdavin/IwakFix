import React from "react";
import FishStore from "../../components/Customer/TokoCust";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";

const TokoPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <HeaderCust />
      </div>

      {/* Content */}
      <FishStore />

      {/* Footer */}
      <FooterCust />
    </div>
  );
};

export default TokoPage;
