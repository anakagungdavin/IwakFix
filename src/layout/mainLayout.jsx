// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/sidebar";
// import { useState } from "react";

// const MainLayout = ({children}) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     // <div className="flex">
//     //   <Sidebar></Sidebar>
//     //   <Outlet></Outlet>
//     // </div>
//         <div className="dark:bg-boxdark-2 dark:text-bodydark">
//       {/* Page Wrapper Start */}
//       <div className="flex h-screen overflow-hidden">
//         {/* Sidebar Start */}
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         {/* Sidebar End */}

//         {/* Content Area Start */}
//         <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

//           {/* Main Content Start */}
//           <main>
//             <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
//               {children}
//             </div>
//           </main>
//           {/* Main Content End */}
//         </div>
//         {/* Content Area End */}
//       </div>
//       {/* Page Wrapper End */}
//     </div>
//   );
// };

// export default MainLayout;
// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/sidebar";

// const MainLayout = () => {
//   return (
//     <>
//       <Sidebar />
//       <Outlet />
//     </>
//   );
// };

// export default MainLayout;
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

const MainLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto", 
          padding: "20px",
          // backgroundColor: "#f4f5f7",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

