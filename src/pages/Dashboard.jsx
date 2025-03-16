import React, { useState, useEffect } from "react";
import axios from "axios";
import ChartS from "../components/charts/ChartS";
import ChartWithLegend from "../components/charts/ChartWithLegend";
import ChartXL from "../components/charts/ChartXL";
import TableOne from "../components/tables/TableOne";
import PendingOrdersTable from "../components/tables/PendingOrdersTable";
import ConfirmedOrdersTable from "../components/tables/ConfirmedOrdersTable";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const token = localStorage.getItem("token");

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data pesanan dan produk dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        // Fetch pesanan
        const ordersResponse = await axios.get(`${apiUrl}/api/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersResponse.data);

        // Fetch produk
        const productsResponse = await axios.get(`${apiUrl}/api/products/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(productsResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
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

    // Get abbreviated day names for small screens
    const getDayFormat = () =>
      windowWidth < 640 ? { weekday: "short" } : { weekday: "long" };

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(thisWeekStart);
      date.setDate(thisWeekStart.getDate() + i);
      return date.toLocaleDateString("id-ID", getDayFormat());
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

    const dailyStock = days.map((day, index) => {
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

    console.log("Chart Data - Days:", days);
    console.log("Chart Data - Daily Orders:", dailyOrders);
    console.log("Chart Data - Daily Revenue:", dailyRevenue);
    console.log("Chart Data - Daily Customers:", dailyCustomers);
    console.log("Chart Data - Daily Products Sold:", dailyProductsSold);
    console.log("Chart Data - Daily Stock:", dailyStock);

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

  // Responsive chart options based on screen size
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
      categories: data.days,
      labels: {
        rotate: windowWidth < 640 ? -45 : 0,
        style: {
          fontSize: windowWidth < 640 ? "10px" : "12px",
        },
      },
    },
    legend: {
      position: windowWidth < 768 ? "bottom" : "top",
      fontSize: windowWidth < 640 ? "10px" : "12px",
      itemMargin: {
        horizontal: windowWidth < 640 ? 5 : 10,
        vertical: 0,
      },
    },
    grid: {
      padding: {
        left: windowWidth < 640 ? 5 : 10,
        right: windowWidth < 640 ? 5 : 10,
      },
    },
  };

  const xlChartData = [
    { name: "Customers", data: data.dailyCustomers },
    { name: "Stock Produk", data: data.dailyStock },
    { name: "Pendapatan", data: data.dailyRevenue },
    { name: "Jumlah Produk Terjual", data: data.dailyProductsSold },
  ];

  const xlChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: windowWidth > 768 },
      height: getChartHeight() * 1.2,
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: data.days,
      labels: {
        rotate: windowWidth < 640 ? -45 : 0,
        style: {
          fontSize: windowWidth < 640 ? "10px" : "12px",
        },
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
    responsive: [
      {
        breakpoint: 640,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  const smallChartData = [{ name: "Orders", data: data.dailyOrders }];
  const largeChartData = [{ name: "Pendapatan", data: data.dailyRevenue }];

  const formatCurrency = (amount) => {
    if (windowWidth < 640 && amount > 999999) {
      return `Rp${(amount / 1000000).toFixed(1)}M`;
    }
    return `Rp${amount.toLocaleString("id-ID")}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="p-4 md:p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 p-3 md:p-4 lg:p-6">
      {/* Main revenue chart - full width on mobile, 3/4 on desktop */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <ChartWithLegend
          title="Total Pembelian"
          time="1 Minggu Terakhir"
          total={formatCurrency(totalRevenue)}
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

      {/* Order stats card - full width on mobile, 1/4 on desktop */}
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
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
          chartData={smallChartData[0].data} // Kirim data langsung dari Dashboard
          showLegend={false}
          chartHeight={60} // Kembalikan ke nilai default seperti sebelumnya
        />
      </div>

      {/* Weekly report chart - full width across all devices */}
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

      {/* Pending orders table - full width across all devices */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Pesanan Tertunda
        </h2>
        <div className="overflow-x-auto">
          <PendingOrdersTable />
        </div>
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Pesanan Terkonfirmasi
        </h2>
        <div className="overflow-x-auto">
          <ConfirmedOrdersTable />
        </div>
      </div>

      {/* Orders table - full width across all devices */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="overflow-x-auto">
          <TableOne />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
