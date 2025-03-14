import React from "react";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";
import CustProfile from "../../components/Customer/profileCust";
const ProfilePage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white shadow-md">
                <HeaderCust />
            </div>

            {/* Content */}
            <CustProfile />

            {/* Footer */}
            <FooterCust />
        </div>
    )
}

export default ProfilePage;