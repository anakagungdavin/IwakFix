import React from "react";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";
import EditProfileCust from "../../components/Customer/profile/editProfile";
const ProfileCustEdit = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white shadow-md">
                <HeaderCust />
            </div>

            {/* Content */}
            <EditProfileCust />

            {/* Footer */}
            <FooterCust />
        </div>
    )
}

export default ProfileCustEdit;