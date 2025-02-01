import React from "react";
import ChartS from "../components/charts/ChartS";
import ChartWithLegend from "../components/charts/ChartWithLegend";
import ChartXL from "../components/charts/ChartXL";
import TableOne from "../components/tables/TableOne";

const Dashboard = () => {
  const smallChartOptions = {
    chart: { type: "line", sparkline: { enabled: true } },
    stroke: { curve: "smooth", width: 2 },
    tooltip: { enabled: false },
  };

  const smallChartData = [{ name: "Orders", data: [25, 30, 35, 40, 50, 45, 60] }];

  const largeChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    },
    legend: { position: "top" },
  };

  const largeChartData = [{ name: "Pendapatan", data: [50, 60, 55, 70, 80, 75, 90] }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      <div className="col-span-3">
{      /* Card 1 - Chart with Legend */}
      <ChartWithLegend 
        title="Total Pembelian"
        time="1 Minggu Terakhir"
        total="$350K"
        percent="8.56%"
        comparedTo = "lebih tinggi dari minggu lalu"
        levelUp
        chartData={largeChartData}
        chartOptions={largeChartOptions}
      />
      </div>
      {/* Card 2 - Chart without Legend */}
      <ChartS 
        title="Total Order"
        time="1 Minggu Terakhir"
        total="25.7K"
        percent="8.56"
        comparedTo="daripada 1 minggu yang lalu"
        levelUp
      />
      {/* Card 3 - Super Big Chart with Legend */}
      <div className="col-span-4">
        <ChartXL
          title="Laporan Mingguan"
          time="1 Minggu Terakhir"
          options={["Customers", "Stock Produk", "Pendapatan", "Jumlah Produk Terjual"]}
        />
      </div>
      <div className="col-span-4">
        <TableOne/>
      </div>
    </div>
  );
};

export default Dashboard;
