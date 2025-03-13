import React, { useState, useEffect } from "react";
import axios from "axios";
import ChartS from "../components/charts/ChartS";
import ChartWithLegend from "../components/charts/ChartWithLegend";
import ChartXL from "../components/charts/ChartXL";
import TableOne from "../components/tables/TableOne";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch data pesanan dari API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Proses data untuk chart dan persentase (2 minggu terakhir)
  const getTwoWeeksData = () => {
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - 6); // 7 hari terakhir (minggu ini)
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 13); // 7 hari sebelumnya (minggu lalu)
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(thisWeekStart.getDate() - 1);

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(thisWeekStart);
      date.setDate(thisWeekStart.getDate() + i);
      return date.toLocaleDateString("id-ID", { weekday: "long" });
    });

    // Filter pesanan minggu ini
    const thisWeekOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= thisWeekStart && orderDate <= today;
    });

    // Filter pesanan minggu lalu
    const lastWeekOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= lastWeekStart && orderDate <= lastWeekEnd;
    });

    // Hitung total order dan pendapatan
    const thisWeekOrderCount = thisWeekOrders.reduce(
      (sum, order) => sum + order.items.length,
      0
    );
    const lastWeekOrderCount = lastWeekOrders.reduce(
      (sum, order) => sum + order.items.length,
      0
    );
    const thisWeekRevenue = thisWeekOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const lastWeekRevenue = lastWeekOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Hitung persentase perubahan
    const orderPercentChange =
      lastWeekOrderCount === 0
        ? thisWeekOrderCount > 0
          ? 100
          : 0
        : ((thisWeekOrderCount - lastWeekOrderCount) / lastWeekOrderCount) *
          100;

    const revenuePercentChange =
      lastWeekRevenue === 0
        ? thisWeekRevenue > 0
          ? 100
          : 0
        : ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;

    // Data harian untuk chart
    const dailyOrders = days.map((day, index) => {
      const dayStart = new Date(thisWeekStart);
      dayStart.setDate(thisWeekStart.getDate() + index);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      return thisWeekOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dayStart && orderDate <= dayEnd;
      }).length;
    });

    const dailyRevenue = days.map((day, index) => {
      const dayStart = new Date(thisWeekStart);
      dayStart.setDate(thisWeekStart.getDate() + index);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      return thisWeekOrders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dayStart && orderDate <= dayEnd;
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
    });

    // Data tambahan untuk ChartXL
    const dailyCustomers = days.map((day, index) => {
      const dayStart = new Date(thisWeekStart);
      dayStart.setDate(thisWeekStart.getDate() + index);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const uniqueCustomers = new Set(
        thisWeekOrders
          .filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= dayStart && orderDate <= dayEnd;
          })
          .map((order) => order.user?._id)
      );
      return uniqueCustomers.size;
    });

    const dailyProductsSold = days.map((day, index) => {
      const dayStart = new Date(thisWeekStart);
      dayStart.setDate(thisWeekStart.getDate() + index);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      return thisWeekOrders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dayStart && orderDate <= dayEnd;
        })
        .reduce(
          (sum, order) =>
            sum + order.items.reduce((acc, item) => acc + item.quantity, 0),
          0
        );
    });

    // Placeholder untuk stok produk (ganti dengan API stok jika ada)
    const dailyStock = days.map(() => 0);

    return {
      days,
      dailyOrders,
      dailyRevenue,
      thisWeekOrderCount,
      lastWeekOrderCount,
      orderPercentChange,
      thisWeekRevenue,
      lastWeekRevenue,
      revenuePercentChange,
      dailyCustomers,
      dailyProductsSold,
      dailyStock,
    };
  };

  const data = getTwoWeeksData();
  const totalOrders = data.thisWeekOrderCount;
  const totalRevenue = data.thisWeekRevenue;
  const orderPercent = Math.abs(data.orderPercentChange).toFixed(2);
  const revenuePercent = Math.abs(data.revenuePercentChange).toFixed(2);
  const orderLevelUp = data.orderPercentChange >= 0;
  const revenueLevelUp = data.revenuePercentChange >= 0;

  const smallChartOptions = {
    chart: { type: "line", sparkline: { enabled: true } },
    stroke: { curve: "smooth", width: 2 },
    tooltip: { enabled: false },
  };

  const largeChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: data.days,
    },
    legend: { position: "top" },
  };

  const xlChartData = [
    { name: "Customers", data: data.dailyCustomers },
    { name: "Stock Produk", data: data.dailyStock },
    { name: "Pendapatan", data: data.dailyRevenue },
    { name: "Jumlah Produk Terjual", data: data.dailyProductsSold },
  ];

  const xlChartOptions = {
    chart: { type: "line", toolbar: { show: true } },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: data.days,
    },
    legend: { position: "top" },
    dataLabels: { enabled: false },
  };

  const smallChartData = [{ name: "Orders", data: data.dailyOrders }];
  const largeChartData = [{ name: "Pendapatan", data: data.dailyRevenue }];

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      <div className="col-span-3">
        {/* Card 1 - Chart with Legend */}
        <ChartWithLegend
          title="Total Pembelian"
          time="1 Minggu Terakhir"
          total={`Rp${totalRevenue.toLocaleString("id-ID")}`}
          percent={`${revenuePercent}%`}
          comparedTo={
            revenueLevelUp
              ? "lebih tinggi dari minggu lalu"
              : "lebih rendah dari minggu lalu"
          }
          levelUp={revenueLevelUp}
          chartData={largeChartData}
          chartOptions={largeChartOptions}
        />
      </div>
      {/* Card 2 - Chart without Legend */}
      <ChartS
        title="Total Order"
        time="1 Minggu Terakhir"
        total={totalOrders.toLocaleString("id-ID")}
        percent={`${orderPercent}%`}
        comparedTo={
          orderLevelUp
            ? "daripada 1 minggu yang lalu"
            : "kurang dari 1 minggu yang lalu"
        }
        levelUp={orderLevelUp}
      />
      {/* Card 3 - Super Big Chart with Legend */}
      <div className="col-span-4">
        <ChartXL
          title="Laporan Mingguan"
          time="1 Minggu Terakhir"
          options={[
            "Customers",
            "Stock Produk",
            "Pendapatan",
            "Jumlah Produk Terjual",
          ]}
          chartData={xlChartData}
          chartOptions={xlChartOptions}
        />
      </div>
      <div className="col-span-4">
        <TableOne />
      </div>
    </div>
  );
};

export default Dashboard;
