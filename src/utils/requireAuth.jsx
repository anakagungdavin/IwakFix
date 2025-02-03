import React from "react";
import Dashboard from "../pages/Dashboard";

const RequireAuth = ({children}) => {
    //const accessToken = sessionStorage.getItem("authToken");
    //console.log(accessToken);
    //if (!accessToken) {
    //return <Navigate to="/" />;
    //}
    return <Dashboard>{children}</Dashboard>
}
export default RequireAuth