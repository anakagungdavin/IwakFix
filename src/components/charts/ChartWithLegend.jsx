import React from "react";
import ReactApexChart from "react-apexcharts";

const ChartWithLegend = ({ title, 
    time, 
    total, 
    percent,
    chartData, 
    chartOptions, 
    levelUp, 
    levelDown, 
    comparedTo }) => {
  return (
    <div className="p-6 rounded-2xl shadow-md shadow-sky-50 bg-white flex flex-col md:flex-row items-center justify-between">
      {/* Text Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{time}</p>
        <p className="text-3xl font-bold text-gray-900">{total}</p>
        <div className="flex items-center text-sm text-gray-500">
            {levelUp && (
              <svg
                className="fill-green-500"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" />
              </svg>
            )}
            {levelDown && (
              <svg
                className="fill-red-500"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z" />
              </svg>
            )}
            <span className="ml-1 text-green-500">{percent}%</span>
            <span className="ml-1">{comparedTo}</span>
            </div>
      </div>
      {/* Chart Section */}
      <div className="w-full md:w-3/4">
        <ReactApexChart options={chartOptions} series={chartData} type="line" height={150} />
      </div>
    </div>
  );
};

export default ChartWithLegend;