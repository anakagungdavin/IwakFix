import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import ChartS from "../components/charts/ChartS";
import ChartWithLegend from "../components/charts/ChartWithLegend";
import ChartXL from "../components/charts/ChartXL";
import TableOne from "../components/tables/TableOne";
import PendingOrdersTable from "../components/tables/PendingOrdersTable";
import ConfirmedOrdersTable from "../components/tables/ConfirmedOrdersTable";
import {
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

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
    if (!loading) setLoading(true);
    setError(null);
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

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
  }, [token, loading]);

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setError("Token autentikasi tidak ditemukan");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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

  // Count orders that need shipping (Paid status)
  const ordersNeedingShipping = useMemo(
    () => allOrders.filter((order) => order.status === "Paid"),
    [allOrders]
  );

  // Count shipped orders
  const shippedOrders = useMemo(
    () => allOrders.filter((order) => order.status === "Shipped"),
    [allOrders]
  );

  // Count total customers
  const totalCustomers = useMemo(() => {
    const uniqueCustomers = new Set(
      allOrders
        .filter((order) => order.user?._id)
        .map((order) => order.user._id)
    );
    return uniqueCustomers.size;
  }, [allOrders]);

  // Count low stock products (stock < 10)
  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock < 10),
    [products]
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

  const largeChartSeriesData = [
    { name: "Pendapatan", data: chartStats.dailyRevenue },
  ];

  const formatCurrency = (amount) => {
    if (windowWidth < 640 && amount > 999999) {
      return `Rp${(amount / 1000000).toFixed(1)}M`;
    }
    return `Rp${amount.toLocaleString("id-ID")}`;
  };

  // Alert/Notification Component
  const AlertBadge = ({ type, count, text, icon: Icon }) => {
    const getAlertStyles = () => {
      switch (type) {
        case "warning":
          return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200";
        case "danger":
          return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200";
        case "success":
          return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200";
        case "info":
          return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
        default:
          return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200";
      }
    };

    if (count === 0) return null;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getAlertStyles()}`}
      >
        <Icon className="h-4 w-4" />
        <span className="font-semibold">{count}</span>
        <span>{text}</span>
      </div>
    );
  };

  if (loading && allOrders.length === 0)
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );

  if (error && allOrders.length === 0)
    return (
      <div className="p-4 md:p-6 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <p className="text-red-800 dark:text-red-200 font-medium">
              {error}
            </p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header with Alerts */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola bisnis Anda dengan mudah
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <AlertBadge
            type="warning"
            count={pendingOrders.length}
            text="pesanan tertunda"
            icon={ExclamationTriangleIcon}
          />
          <AlertBadge
            type="info"
            count={ordersNeedingShipping.length}
            text="perlu dikirim"
            icon={TruckIcon}
          />
          <AlertBadge
            type="danger"
            count={lowStockProducts.length}
            text="stok menipis"
            icon={ExclamationTriangleIcon}
          />
          <AlertBadge
            type="success"
            count={shippedOrders.length}
            text="pesanan terkirim"
            icon={CheckCircleIcon}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4 md:p-6">
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Pesanan
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {allOrders.length}
                </p>
              </div>
              <ShoppingCartIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Produk
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.length}
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pelanggan
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalCustomers}
                </p>
              </div>
              <UsersIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pendapatan
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(
                    allOrders.reduce((sum, order) => sum + order.totalAmount, 0)
                  )}
                </p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div> */}

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
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
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
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
                chartData={chartStats.dailyOrders}
                chartOptions={smallChartOptions}
              />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
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
          </div>
        </div>

        {/* Tables Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <ClockIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  Pesanan Tertunda
                </h2>
                {pendingOrders.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                    {pendingOrders.length}
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 md:p-6">
              <PendingOrdersTable
                pendingOrdersData={pendingOrders}
                onOrderStatusChange={fetchData}
                isLoading={loading && pendingOrders.length === 0}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <TruckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  Manajemen Pengiriman
                </h2>
                {ordersNeedingShipping.length + shippedOrders.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {ordersNeedingShipping.length + shippedOrders.length}
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 md:p-6">
              <ConfirmedOrdersTable
                ordersData={paidAndShippedOrders}
                onOrderStatusChange={fetchData}
                isLoading={loading && paidAndShippedOrders.length === 0}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4 md:p-6">
              <TableOne />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
