import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import ChartS from "../components/charts/ChartS";
import ChartWithLegend from "../components/charts/ChartWithLegend";
import ChartXL from "../components/charts/ChartXL";
import TableOne from "../components/tables/TableOne";
import PendingOrdersTable from "../components/tables/PendingOrdersTable";
import ConfirmedOrdersTable from "../components/tables/ConfirmedOrdersTable";

const Dashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = useCallback(async () => {
    console.log("Dashboard: fetchData triggered");
    if (!loading) setLoading(true); // Set loading true only if not already loading
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const ordersResponse = await axios.get(`${apiUrl}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllOrders(ordersResponse.data);

      const productsResponse = await axios.get(`${apiUrl}/api/products/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(productsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  }, [token, loading]); // Added loading to dependencies to avoid re-triggering fetchData unnecessarily

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setError("Token autentikasi tidak ditemukan");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // fetchData will be called once on mount due to token, then by callbacks

  const pendingOrders = useMemo(
    () => allOrders.filter((order) => order.status === "Pending"),
    [allOrders]
  );

  const paidAndShippedOrders = useMemo(
    () =>
      allOrders.filter(
        (order) => order.status === "Paid" || order.status === "Shipped"
      ),
    [allOrders]
  );

  const getTwoWeeksData = useCallback(() => {
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - 6);
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 13);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(thisWeekStart.getDate() - 1);

    const getDayFormat = () =>
      windowWidth < 640 ? { weekday: "short" } : { weekday: "long" };

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(thisWeekStart);
      date.setDate(thisWeekStart.getDate() + i);
      return date.toLocaleDateString("id-ID", getDayFormat());
    });

    const thisWeekOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= thisWeekStart && orderDate <= today;
    });

    const lastWeekOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= lastWeekStart && orderDate <= lastWeekEnd;
    });

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

    const dailyOrdersData = days.map((_, index) => {
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

    const dailyRevenueData = days.map((_, index) => {
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

    const dailyCustomersData = days.map((_, index) => {
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

    const dailyProductsSoldData = days.map((_, index) => {
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

    const dailyStockData = days.map((_, index) => {
      const dayStart = new Date(thisWeekStart);
      dayStart.setDate(thisWeekStart.getDate() + index);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const totalInitialStock = products.reduce(
        (sum, product) => sum + product.stock,
        0
      );
      const dailySold = thisWeekOrders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dayStart && orderDate <= dayEnd;
        })
        .reduce(
          (sum, order) =>
            sum + order.items.reduce((acc, item) => acc + item.quantity, 0),
          0
        );
      return Math.max(0, totalInitialStock - dailySold);
    });

    return {
      days,
      dailyOrders: dailyOrdersData,
      dailyRevenue: dailyRevenueData,
      thisWeekOrderCount,
      lastWeekOrderCount,
      orderPercentChange,
      thisWeekRevenue,
      lastWeekRevenue,
      revenuePercentChange,
      dailyCustomers: dailyCustomersData,
      dailyProductsSold: dailyProductsSoldData,
      dailyStock: dailyStockData,
    };
  }, [allOrders, products, windowWidth]);

  const chartStats = useMemo(() => {
    if (allOrders.length === 0 && products.length === 0 && !loading) {
      // Return a default structure if data is empty but not loading
      return {
        days: Array(7).fill(""),
        dailyOrders: Array(7).fill(0),
        dailyRevenue: Array(7).fill(0),
        thisWeekOrderCount: 0,
        orderPercentChange: 0,
        thisWeekRevenue: 0,
        revenuePercentChange: 0,
        dailyCustomers: Array(7).fill(0),
        dailyProductsSold: Array(7).fill(0),
        dailyStock: Array(7).fill(0),
        orderLevelUp: true,
        revenueLevelUp: true,
        orderPercent: "0.00",
        revenuePercent: "0.00",
        totalOrders: 0,
        totalRevenue: 0,
      };
    }
    const data = getTwoWeeksData();
    return {
      ...data,
      totalOrders: data.thisWeekOrderCount,
      totalRevenue: data.thisWeekRevenue,
      orderPercent: Math.abs(data.orderPercentChange || 0).toFixed(2),
      revenuePercent: Math.abs(data.revenuePercentChange || 0).toFixed(2),
      orderLevelUp: (data.orderPercentChange || 0) >= 0,
      revenueLevelUp: (data.revenuePercentChange || 0) >= 0,
    };
  }, [allOrders, products, getTwoWeeksData, loading]);

  const getChartHeight = () => {
    if (windowWidth < 640) return 220;
    if (windowWidth < 1024) return 300;
    return 350;
  };

  const smallChartOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
      height: getChartHeight() / 2,
    },
    stroke: { curve: "smooth", width: 2 },
    tooltip: { enabled: false },
  };

  const largeChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: windowWidth > 768 },
      height: getChartHeight(),
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: chartStats.days,
      labels: {
        rotate: windowWidth < 640 ? -45 : 0,
        style: { fontSize: windowWidth < 640 ? "10px" : "12px" },
      },
    },
    legend: {
      position: windowWidth < 768 ? "bottom" : "top",
      fontSize: windowWidth < 640 ? "10px" : "12px",
      itemMargin: { horizontal: windowWidth < 640 ? 5 : 10, vertical: 0 },
    },
    grid: {
      padding: {
        left: windowWidth < 640 ? 5 : 10,
        right: windowWidth < 640 ? 5 : 10,
      },
    },
  };

  const xlChartData = [
    { name: "Customers", data: chartStats.dailyCustomers },
    { name: "Stock Produk", data: chartStats.dailyStock },
    { name: "Pendapatan", data: chartStats.dailyRevenue },
    { name: "Jumlah Produk Terjual", data: chartStats.dailyProductsSold },
  ];

  const xlChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: windowWidth > 768 },
      height: getChartHeight() * 1.2,
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: chartStats.days,
      labels: {
        rotate: windowWidth < 640 ? -45 : 0,
        style: { fontSize: windowWidth < 640 ? "10px" : "12px" },
      },
    },
    legend: {
      position: windowWidth < 768 ? "bottom" : "top",
      fontSize: windowWidth < 640 ? "10px" : "12px",
      horizontalAlign: windowWidth < 640 ? "center" : "right",
      itemMargin: {
        horizontal: windowWidth < 640 ? 5 : 10,
        vertical: windowWidth < 640 ? 5 : 0,
      },
    },
    dataLabels: { enabled: false },
    grid: {
      padding: {
        left: windowWidth < 640 ? 5 : 10,
        right: windowWidth < 640 ? 5 : 10,
      },
    },
    responsive: [{ breakpoint: 640, options: { legend: { show: false } } }],
  };

  // const smallChartSeriesData = [{ name: "Orders", data: chartStats.dailyOrders }]; // Jika ChartS butuh format series
  const largeChartSeriesData = [
    { name: "Pendapatan", data: chartStats.dailyRevenue },
  ];

  const formatCurrency = (amount) => {
    if (windowWidth < 640 && amount > 999999) {
      return `Rp${(amount / 1000000).toFixed(1)}M`;
    }
    return `Rp${amount.toLocaleString("id-ID")}`;
  };

  if (loading && allOrders.length === 0)
    return (
      // Tampilkan loading hanya jika data awal belum ada
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  if (error && allOrders.length === 0)
    return (
      // Tampilkan error hanya jika data awal gagal dimuat
      <div className="p-4 md:p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 p-3 md:p-4 lg:p-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <ChartWithLegend
          title="Total Pembelian"
          time="1 Minggu Terakhir"
          total={formatCurrency(chartStats.totalRevenue)}
          percent={`${chartStats.revenuePercent}%`}
          comparedTo={
            chartStats.revenueLevelUp
              ? "lebih tinggi dari minggu lalu"
              : "lebih rendah dari minggu lalu"
          }
          levelUp={chartStats.revenueLevelUp}
          chartData={largeChartSeriesData}
          chartOptions={largeChartOptions}
        />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <ChartS
          title="Total Order"
          time="1 Minggu Terakhir"
          total={chartStats.totalOrders.toLocaleString("id-ID")}
          percent={`${chartStats.orderPercent}%`}
          comparedTo={
            chartStats.orderLevelUp
              ? "daripada 1 minggu yang lalu"
              : "kurang dari 1 minggu yang lalu"
          }
          levelUp={chartStats.orderLevelUp}
          chartData={chartStats.dailyOrders} // Pastikan ChartS menerima array angka
          chartOptions={smallChartOptions}
        />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <ChartXL
          title="Laporan Mingguan"
          time="1 Minggu Terakhir"
          options={
            windowWidth < 640
              ? ["Customers", "Stock", "Revenue", "Terjual"]
              : [
                  "Customers",
                  "Stock Produk",
                  "Pendapatan",
                  "Jumlah Produk Terjual",
                ]
          }
          chartData={xlChartData}
          chartOptions={xlChartOptions}
        />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Pesanan Tertunda
        </h2>
        <div className="overflow-x-auto">
          <PendingOrdersTable
            pendingOrdersData={pendingOrders}
            onOrderStatusChange={fetchData}
            isLoading={loading && pendingOrders.length === 0}
          />
        </div>
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Manajemen Pengiriman
        </h2>
        <div className="overflow-x-auto">
          <ConfirmedOrdersTable
            ordersData={paidAndShippedOrders}
            onOrderStatusChange={fetchData}
            isLoading={loading && paidAndShippedOrders.length === 0}
          />
        </div>
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="overflow-x-auto">
          <TableOne />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
