// src/components/cards/StatCard.jsx
import React from "react";
import { FaChartBar } from "react-icons/fa";

const StatCard = ({
  title,
  value,
  icon,
  bgColor = "bg-slate-700", // Default background color jika tidak disediakan
  textColor = "text-white", // Default text color
}) => {
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div
      className={`
        ${bgColor} ${textColor} 
        p-5 sm:p-6 rounded-xl shadow-lg 
        flex flex-col justify-start 
        min-h-[140px] sm:min-h-[150px] 
        transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
      `}
      // Penyesuaian:
      // - Rounded lebih besar: rounded-xl
      // - Padding mungkin sedikit lebih besar: p-5 sm:p-6
      // - Efek hover modern: transform hover:scale-105 hover:shadow-xl
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {displayValue}
          </span>
          {/* Ikon bisa dibuat sedikit lebih besar dan warnanya disesuaikan */}
          <div className="p-2 bg-black bg-opacity-10 rounded-full">
            {" "}
            {/* Latar belakang ikon transparan */}
            {icon ? (
              React.cloneElement(icon, {
                className: "text-xl sm:text-2xl opacity-80", // Sesuaikan opacity atau warna ikon
              })
            ) : (
              <FaChartBar className="text-xl sm:text-2xl opacity-80" />
            )}
          </div>
        </div>
        <p className="text-sm sm:text-base font-medium opacity-90">{title}</p>{" "}
        {/* Opacity untuk judul */}
      </div>
    </div>
  );
};

export default StatCard;
