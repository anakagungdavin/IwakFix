// import InformasiCust from "./profile/informasi";

// const CustProfile = () => {
//     return (
//       <div className="min-h-screen bg-gray-100 p-8">
//         <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg flex gap-8">
//           {/* Sidebar */}
//           <div className="w-1/4 bg-white shadow-md p-6 rounded-lg">
//             <div className="flex flex-col items-center">
//               <img
//                 src="https://via.placeholder.com/80"
//                 alt="User Avatar"
//                 className="w-20 h-20 rounded-full border-4 border-gray-300"
//               />
//               <p className="mt-3 text-gray-600">Hello,</p>
//               <h2 className="text-lg font-semibold">Jimin Park</h2>
//             </div>
//             <div className="mt-6">
//               <ul className="space-y-4">
//                 <li className="flex items-center gap-2 text-[#003D47] font-semibold p-3 bg-[#003D47] text-white rounded-md">
//                   <i className="fas fa-user"></i> Informasi Profile
//                 </li>
//                 <li className="flex items-center gap-2 text-gray-600 p-3 hover:bg-gray-200 rounded-md cursor-pointer">
//                   <i className="fas fa-box"></i> Pesanan Saya
//                 </li>
//                 <li className="flex items-center gap-2 text-gray-600 p-3 hover:bg-gray-200 rounded-md cursor-pointer">
//                   <i className="fas fa-map-marker-alt"></i> Alamat
//                 </li>
//                 <li className="text-red-500 font-semibold p-3 hover:bg-red-100 rounded-md cursor-pointer">
//                   Log Out
//                 </li>
//               </ul>
//             </div>
//           </div>
          
  
//           {/* Profile Form
//           <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-6">Profile Saya</h2>
//             <div className="relative flex flex-col items-center">
//               <img
//                 src="https://via.placeholder.com/80"
//                 alt="Profile"
//                 className="w-24 h-24 rounded-full border-4 border-gray-300"
//               />
//               <button className="absolute bottom-2 right-8 bg-gray-800 text-white p-2 rounded-full">
//                 <i className="fas fa-pencil-alt text-sm"></i>
//               </button>
//             </div>
  
//             {/* Form */}
//             {/* <div className="mt-6 space-y-4">
//               <div>
//                 <label className="block text-gray-700 font-medium">Nama</label>
//                 <input
//                   type="text"
//                   value="Jimin Park"
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#003D47] outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 font-medium">No Telephone</label>
//                 <input
//                   type="text"
//                   value="000000000000000"
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#003D47] outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 font-medium">Email</label>
//                 <input
//                   type="email"
//                   value="robertfox@example.com"
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#003D47] outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 font-medium">Kata Sandi</label>
//                 <input
//                   type="password"
//                   value="••••••••••••"
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#003D47] outline-none"
//                 />
//               </div>
//             </div> */}
  
//             {/* Edit Profile Button */}
//             {/* <div className="mt-6 text-right">
//               <button className="bg-[#003D47] text-white px-6 py-2 rounded-lg flex items-center gap-2">
//                 <i className="fas fa-pencil-alt"></i> Edit Profile
//               </button>
//             </div> */}
//           {/* </div>  */}
//         </div>
//       </div>
//     );
//   };
  
//   export default CustProfile;

import { useState } from "react";
import InformasiCust from "./profile/informasi";
import Alamat from "./profile/alamat";

const CustProfile = () => {
  const [activeMenu, setActiveMenu] = useState("Profile Saya");

  const menuItems = [
    { name: "Profile Saya", icon: "fas fa-user" },
    { name: "Pesanan Saya", icon: "fas fa-box" },
    { name: "Alamat", icon: "fas fa-map-marker-alt" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg flex gap-8">
        {/* Sidebar */}
        <div className="w-1/4 bg-white shadow-md p-6 rounded-lg">
          <div className="flex flex-col items-center">
            <img
              // src="https://via.placeholder.com/80"
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-gray-300"
            />
            <p className="mt-3 text-gray-600">Hello,</p>
            <h2 className="text-lg font-semibold">Jimin Park</h2>
          </div>
          <div className="mt-6">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`flex items-center gap-2 p-3 rounded-md cursor-pointer font-semibold ${
                    activeMenu === item.name
                      ? "bg-[#003D47] text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <i className={item.icon}></i> {item.name}
                </li>
              ))}
              <li className="text-red-500 font-semibold p-3 hover:bg-red-100 rounded-md cursor-pointer">
                Log Out
              </li>
            </ul>
          </div>
        </div>

        {/* Profile Form */}
        <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">{activeMenu}</h2>
          {activeMenu === "Profile Saya" && <InformasiCust />}
          {activeMenu === "Pesanan Saya" && <p>Halaman Pesanan Saya</p>}
          {activeMenu === "Alamat" && <Alamat/>}
        </div>
      </div>
    </div>
  );
};

export default CustProfile;
