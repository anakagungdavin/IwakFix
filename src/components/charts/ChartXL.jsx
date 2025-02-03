import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ChartXL = ({ title, time, options }) => {
  const [selectedOption, setSelectedOption] = useState("Customers");

  const chartDataMap = {
    Customers: [24, 30, 20, 35, 50, 40, 60],
    "Stock Produk": [15, 25, 30, 20, 40, 45, 50],
    Pendapatan: [10, 20, 15, 25, 30, 35, 40],
    "Jumlah Produk Terjual": [50, 60, 55, 70, 80, 75, 90],
  };

  const chartData = [{ name: selectedOption, data: chartDataMap[selectedOption] }];
  const chartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: {
      categories: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    },
    legend: { position: "top" },
  };

  return (
    <div className="p-6 rounded-2xl shadow-md shadow-sky-50 bg-white flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{time}</p>
      </div>

      {/* Dropdown for Chart Options */}
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="p-2 border rounded-lg"
      >
        {Object.keys(chartDataMap).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Chart Section */}
      <ReactApexChart options={chartOptions} series={chartData} type="line" height={250} />
    </div>
  );
};

export default ChartXL;