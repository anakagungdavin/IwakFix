// MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

const MainLayout = () => {
  // Check user role - implement based on your auth system
  const userRole = localStorage.getItem("userRole"); // or from your auth context
  const isAdmin = userRole === "admin";

  return (
    <div
      style={{
        display: "flex",
        height: "100",
        width: "100",
        overflow: "hidden",
      }}
    >
      {isAdmin && <Sidebar />}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
