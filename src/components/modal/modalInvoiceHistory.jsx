import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";

// Fungsi helper tidak memerlukan perubahan untuk dark mode
const getFormattedDate = (dateInput) => {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Tanggal Tidak Valid";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatAddress = (address) => {
  if (!address) return "N/A";
  const parts = [
    address.streetAddress,
    address.city,
    address.province,
    address.postalCode,
  ].filter(Boolean);
  return parts.join(", ") || "Alamat tidak lengkap";
};

// Komponen PDF tidak terpengaruh oleh dark mode HTML
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 9, lineHeight: 1.3 },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingBottom: 8,
    marginBottom: 15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  companyInfo: { width: "60%", fontSize: 9 },
  invoiceInfo: { width: "35%", textAlign: "right", fontSize: 9 },
  logoPlaceholder: { fontSize: 14, fontWeight: "bold", marginBottom: 3 },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 9,
    textAlign: "center",
    color: "#555555",
    marginBottom: 10,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
  },
  tableHeader: { backgroundColor: "#f2f2f2", fontWeight: "bold" },
  tableCell: {
    padding: 4,
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    flexGrow: 1,
    textAlign: "left",
    wordBreak: "break-word",
  },
  tableCellHeader: {
    padding: 5,
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    flexGrow: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCellAmount: { textAlign: "right" },
  tableCellCenter: { textAlign: "center" },
  colNo: { width: "5%" },
  colTanggal: { width: "12%" },
  colNamaPembeli: { width: "15%" },
  colJenisBibit: { width: "18%" },
  colAlamat: { width: "20%" },
  colJumlah: { width: "8%" },
  colHargaSatuan: { width: "11%" },
  colHargaTotal: { width: "11%", borderRightWidth: 0 },
  totalSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#333333",
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 10,
    width: "70%",
    textAlign: "right",
    paddingRight: 8,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
    width: "30%",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#777777",
  },
});

const MyDocument = ({ startDate, endDate, orders }) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate >= start && orderDate <= end && order.status !== "Cancelled"
    );
  });
  const totalInvoice = filteredOrders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (itemSum, item) =>
          itemSum + item.quantity * (item.discountedPrice || item.price || 0),
        0
      ),
    0
  );
  let itemNo = 0;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.headerTop}>
            <View style={styles.companyInfo}>
              <Text style={styles.logoPlaceholder}>UPTD Aneka Usaha</Text>
              <Text>
                Jalan Pleret Raya, Kel. Sumber, Kec. Banjarsari, Kota Surakarta
              </Text>
              <Text>Telp: 085713561686</Text>
            </View>
            <View style={styles.invoiceInfo}>
              <Text>
                Nomor Laporan: LAP-
                {new Date().toISOString().slice(0, 10).replace(/-/g, "")}
              </Text>
              <Text>Tanggal Cetak: {getFormattedDate(new Date())}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.title}>Laporan Penjualan Bibit Ikan</Text>
        <Text style={styles.subtitle}>
          Periode: {getFormattedDate(startDate)} - {getFormattedDate(endDate)}
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellHeader, styles.colNo]}>No</Text>
            <Text style={[styles.tableCellHeader, styles.colTanggal]}>
              Tanggal
            </Text>
            <Text style={[styles.tableCellHeader, styles.colNamaPembeli]}>
              Nama Pembeli
            </Text>
            <Text style={[styles.tableCellHeader, styles.colJenisBibit]}>
              Jenis Bibit
            </Text>
            <Text style={[styles.tableCellHeader, styles.colAlamat]}>
              Alamat
            </Text>
            <Text style={[styles.tableCellHeader, styles.colJumlah]}>
              Jumlah
            </Text>
            <Text style={[styles.tableCellHeader, styles.colHargaSatuan]}>
              Harga Satuan
            </Text>
            <Text style={[styles.tableCellHeader, styles.colHargaTotal]}>
              Harga Total
            </Text>
          </View>
          {filteredOrders.length > 0 ? (
            filteredOrders.flatMap((order) =>
              order.items.map((item, index) => {
                itemNo++;
                const buyerName =
                  order.shippingAddress?.recipientName ||
                  order.user?.name ||
                  "N/A";
                const addressString = formatAddress(order.shippingAddress);
                return (
                  <View
                    key={`${order._id}-${itemNo}`}
                    style={styles.tableRow}
                    wrap={false}
                  >
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colNo,
                        styles.tableCellCenter,
                      ]}
                    >
                      {itemNo}
                    </Text>
                    <Text style={[styles.tableCell, styles.colTanggal]}>
                      {getFormattedDate(order.createdAt)}
                    </Text>
                    <Text style={[styles.tableCell, styles.colNamaPembeli]}>
                      {buyerName}
                    </Text>
                    <Text style={[styles.tableCell, styles.colJenisBibit]}>
                      {item.product?.name || "N/A"}
                    </Text>
                    <Text style={[styles.tableCell, styles.colAlamat]}>
                      {addressString}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colJumlah,
                        styles.tableCellCenter,
                      ]}
                    >
                      {item.quantity} {item.satuan || ""}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colHargaSatuan,
                        styles.tableCellAmount,
                      ]}
                    >
                      Rp{" "}
                      {(item.discountedPrice || item.price || 0).toLocaleString(
                        "id-ID"
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colHargaTotal,
                        styles.tableCellAmount,
                      ]}
                    >
                      Rp{" "}
                      {(
                        (item.quantity || 0) *
                        (item.discountedPrice || item.price || 0)
                      ).toLocaleString("id-ID")}
                    </Text>
                  </View>
                );
              })
            )
          ) : (
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  { width: "100%", textAlign: "center", fontStyle: "italic" },
                ]}
              >
                Tidak ada data penjualan pada periode ini.
              </Text>
            </View>
          )}
        </View>
        {filteredOrders.length > 0 && (
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total Keseluruhan Penjualan:
              </Text>
              <Text style={styles.totalValue}>
                Rp {totalInvoice.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        )}
        <Text style={styles.footer} fixed>
          Laporan ini dicetak secara otomatis oleh sistem pada tanggal{" "}
          {getFormattedDate(new Date())}.
        </Text>
      </Page>
    </Document>
  );
};

const generateExcelData = (startDate, endDate, orders) => {
  // ... Fungsi ini tidak berubah karena tidak menghasilkan UI
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate >= start && orderDate <= end && order.status !== "Cancelled"
    );
  });
  const excelData = [];
  excelData.push(["UPTD Aneka Usaha - Laporan Penjualan Bibit Ikan"]);
  excelData.push([
    "Jalan Pleret Raya, Kel. Sumber, Kec. Banjarsari, Kota Surakarta",
  ]);
  excelData.push(["Telp: 085713561686"]);
  excelData.push([
    `Periode: ${getFormattedDate(startDate)} - ${getFormattedDate(endDate)}`,
  ]);
  excelData.push([]);
  const tableHeaders = [
    "No",
    "Tanggal",
    "Nama Pembeli",
    "Jenis Bibit",
    "Alamat",
    "Jumlah",
    "Harga Satuan (Rp)",
    "Harga Total (Rp)",
  ];
  excelData.push(tableHeaders);
  let colWidths = tableHeaders.map((header) => header.length);
  let itemNo = 0;
  const dataRowsForExcel = [];
  filteredOrders.forEach((order) => {
    const buyerName =
      order.shippingAddress?.recipientName || order.user?.name || "N/A";
    const addressString = formatAddress(order.shippingAddress);
    order.items.forEach((item) => {
      itemNo++;
      const rowValues = [
        itemNo,
        getFormattedDate(order.createdAt),
        buyerName,
        item.product?.name || "N/A",
        addressString,
        `${item.quantity} ${item.satuan || ""}`,
        item.discountedPrice || item.price || 0,
        (item.quantity || 0) * (item.discountedPrice || item.price || 0),
      ];
      dataRowsForExcel.push(rowValues);
      rowValues.forEach((cell, index) => {
        let cellStringRepresentation;
        if (index === 6 || index === 7) {
          cellStringRepresentation = `Rp ${Number(cell).toLocaleString(
            "id-ID"
          )}`;
        } else {
          cellStringRepresentation = String(cell);
        }
        colWidths[index] = Math.max(
          colWidths[index] || 0,
          cellStringRepresentation.length
        );
      });
    });
  });
  excelData.push(...dataRowsForExcel);
  const totalInvoice = filteredOrders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce(
        (itemSum, item) =>
          itemSum + item.quantity * (item.discountedPrice || item.price || 0),
        0
      )
    );
  }, 0);
  excelData.push([]);
  const totalRowData = [
    "",
    "",
    "",
    "",
    "",
    "",
    "Total Keseluruhan Penjualan:",
    totalInvoice,
  ];
  excelData.push(totalRowData);
  totalRowData.forEach((cell, index) => {
    if (cell === null || cell === undefined || String(cell).trim() === "")
      return;
    let cellStringRepresentation;
    if (index === 7) {
      cellStringRepresentation = `Rp ${Number(cell).toLocaleString("id-ID")}`;
    } else {
      cellStringRepresentation = String(cell);
    }
    if (colWidths[index] !== undefined) {
      colWidths[index] = Math.max(
        colWidths[index],
        cellStringRepresentation.length
      );
    } else {
      colWidths[index] = cellStringRepresentation.length;
    }
  });
  const finalCalculatedWidths = colWidths.map((width) => ({ wch: width + 2 }));
  return { data: excelData, widths: finalCalculatedWidths };
};

const downloadExcel = (startDate, endDate, orders) => {
  // ... Fungsi ini tidak berubah karena tidak menghasilkan UI
  if (!startDate || !endDate) {
    alert("Silakan pilih rentang tanggal terlebih dahulu.");
    return;
  }
  const { data: excelData, widths: calculatedWidths } = generateExcelData(
    startDate,
    endDate,
    orders
  );
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);
  if (worksheet && calculatedWidths && calculatedWidths.length > 0) {
    worksheet["!cols"] = calculatedWidths;
  }
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");
  XLSX.writeFile(
    workbook,
    `Laporan_Penjualan_Ikan_${startDate.replace(/-/g, "")}_${endDate.replace(
      /-/g,
      ""
    )}.xlsx`
  );
};

const SalesReportModal = ({ onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
        const response = await axios.get(`${apiUrl}/api/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal mengambil data pesanan");
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchOrders();
    } else {
      setError("Token tidak ditemukan. Silakan login kembali.");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setEndDate(formattedToday);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
  }, []);

  const handleDownloadPdf = () => {
    if (!startDate || !endDate) {
      alert("Silakan pilih rentang tanggal terlebih dahulu.");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };
  const handleDownloadExcel = () => {
    if (!startDate || !endDate) {
      alert("Silakan pilih rentang tanggal terlebih dahulu.");
      return;
    }
    setIsGenerating(true);
    try {
      downloadExcel(startDate, endDate, orders);
    } catch (e) {
      console.error("Gagal membuat Excel:", e);
      alert("Gagal membuat file Excel.");
    } finally {
      setIsGenerating(false);
    }
  };

  // PERUBAHAN: Style untuk state loading di dark mode
  if (loading)
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[100]">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-11/12 max-w-xs mx-auto text-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Memuat data pesanan...
          </p>
        </div>
      </div>
    );

  // PERUBAHAN: Style untuk state error di dark mode
  if (error)
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[100]">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-11/12 max-w-md mx-auto text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            aria-label="Close"
          >
            {" "}
            ✖{" "}
          </button>
          <div className="text-red-500 dark:text-red-400">
            <svg
              className="w-16 h-16 mx-auto mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="text-lg font-semibold">Terjadi Kesalahan</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );

  const filteredOrdersForPreview = orders.filter((order) => {
    if (!startDate || !endDate) return false;
    const orderDate = new Date(order.createdAt);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const endD = new Date(endDate);
    endD.setHours(23, 59, 59, 999);
    return (
      orderDate >= start && orderDate <= endD && order.status !== "Cancelled"
    );
  });
  const displayedItemsForPreview = filteredOrdersForPreview
    .flatMap((order) =>
      order.items.map((item) => ({
        ...item,
        orderId: order._id,
        orderCreatedAt: order.createdAt,
        buyerName:
          order.shippingAddress?.recipientName || order.user?.name || "N/A",
        shippingFullAddress: formatAddress(order.shippingAddress),
      }))
    )
    .slice(0, 5);
  const totalItemsInFilteredRange = filteredOrdersForPreview.reduce(
    (acc, order) => acc + order.items.length,
    0
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-[60] p-2 sm:p-4">
      {/* PERUBAHAN: Latar belakang, warna teks, dan scrollbar untuk dark mode */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-5 sm:p-6 w-full max-w-5xl mx-auto relative overflow-y-auto max-h-[95vh] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white p-1.5 z-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Tutup"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 text-left mb-4 sm:mb-5">
          Laporan Penjualan Ikan
        </h2>

        {/* PERUBAHAN: Form inputs untuk dark mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tanggal Mulai:
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tanggal Akhir:
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <p className="text-left text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
          Laporan untuk periode:{" "}
          <strong className="text-gray-700 dark:text-gray-200">
            {startDate && endDate
              ? `${getFormattedDate(startDate)} - ${getFormattedDate(endDate)}`
              : "Pilih rentang waktu"}
          </strong>
        </p>

        {/* PERUBAHAN: Tombol download untuk dark mode */}
        <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-4 mb-6">
          {startDate && endDate && (
            <>
              <PDFDownloadLink
                document={
                  <MyDocument
                    startDate={startDate}
                    endDate={endDate}
                    orders={orders}
                  />
                }
                fileName={`Laporan_Penjualan_Ikan_${startDate.replace(
                  /-/g,
                  ""
                )}_${endDate.replace(/-/g, "")}.pdf`}
                className="w-full sm:w-auto"
                onClick={handleDownloadPdf}
              >
                {({ loading: pdfLoading }) => (
                  <button
                    disabled={isGenerating || pdfLoading}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900/80 dark:text-red-300 font-medium px-4 sm:px-5 py-2.5 rounded-lg shadow-sm border border-red-200 dark:border-red-700 flex items-center justify-center transition-colors duration-150 disabled:opacity-70"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    {isGenerating || pdfLoading
                      ? "Memproses..."
                      : "Download PDF"}
                  </button>
                )}
              </PDFDownloadLink>
              <button
                onClick={handleDownloadExcel}
                disabled={isGenerating}
                className="w-full sm:w-auto bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/50 dark:hover:bg-green-900/80 dark:text-green-300 font-medium px-4 sm:px-5 py-2.5 rounded-lg shadow-sm border border-green-200 dark:border-green-700 flex items-center justify-center transition-colors duration-150 disabled:opacity-70"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                {isGenerating ? "Memproses..." : "Download Excel"}
              </button>
            </>
          )}
        </div>

        {/* --- Area Preview dengan Dark Mode --- */}
        {startDate &&
          endDate &&
          orders.length > 0 &&
          displayedItemsForPreview.length > 0 && (
            <div className="mt-6">
              <p className="font-medium mb-2 text-gray-700 dark:text-gray-200">
                Preview Laporan (5 item pertama):
              </p>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        {[
                          "No",
                          "Tanggal",
                          "Nama Pembeli",
                          "Jenis Bibit",
                          "Alamat",
                          "Jumlah",
                          "Harga Satuan",
                          "Harga Total",
                        ].map((header, idx) => (
                          <th
                            key={header}
                            scope="col"
                            className={`px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                              idx === 0 ? "w-10 text-center" : ""
                            } ${idx === 5 ? "text-center" : ""} ${
                              idx === 6 || idx === 7 ? "text-right" : ""
                            } `}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                      {displayedItemsForPreview.map((item, index) => (
                        <tr
                          key={`${item.orderId}-${item.product?._id || index}`}
                          className="hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                            {index + 1}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {getFormattedDate(item.orderCreatedAt)}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[150px] whitespace-pre-wrap break-words">
                            {item.buyerName}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[150px] whitespace-pre-wrap break-words">
                            {item.product?.name || "N/A"}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[200px] whitespace-pre-wrap break-words">
                            {item.shippingFullAddress}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                            {item.quantity} {item.satuan || ""}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                            Rp{" "}
                            {(
                              item.discountedPrice ||
                              item.price ||
                              0
                            ).toLocaleString("id-ID")}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-100 font-medium text-right">
                            Rp{" "}
                            {(
                              (item.quantity || 0) *
                              (item.discountedPrice || item.price || 0)
                            ).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalItemsInFilteredRange > 5 && (
                  <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                    Menampilkan 5 dari {totalItemsInFilteredRange} item. Unduh
                    laporan untuk data lengkap.
                  </div>
                )}
              </div>
            </div>
          )}
        {startDate &&
          endDate &&
          displayedItemsForPreview.length === 0 &&
          !loading && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              Tidak ada data penjualan untuk periode yang dipilih.
            </p>
          )}
      </div>
    </div>
  );
};

export default SalesReportModal;
