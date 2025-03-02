import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ChartXL = ({ title, time, options, chartData, chartOptions }) => {
  const [selectedOption, setSelectedOption] = useState("Customers");

  // Map data dari chartData berdasarkan selectedOption
  const chartDataMapped = chartData.find(
    (data) => data.name === selectedOption
  ) || {
    name: selectedOption,
    data: [0, 0, 0, 0, 0, 0, 0], // Fallback jika data tidak ditemukan
  };

  const updatedChartData = [
    { name: selectedOption, data: chartDataMapped.data },
  ];

  const updatedChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: {
      categories: chartOptions.xaxis.categories, // Gunakan kategori dari props
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
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Chart Section */}
      <ReactApexChart
        options={updatedChartOptions}
        series={updatedChartData}
        type="line"
        height={250}
      />
    </div>
  );
};

export default ChartXL;