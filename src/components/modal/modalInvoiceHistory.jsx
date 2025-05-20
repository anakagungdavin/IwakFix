import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";

// Register font untuk tampilan formal (opsional, jika Anda punya font khusus)
Font.register({
  family: "Times-Roman",
  src: "http://localhost:3000/fonts/Times-Roman.ttf", // Ganti dengan path font Anda jika ada
});

const getFormattedDate = (date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Desain formal untuk invoice
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyInfo: {
    width: "50%",
  },
  invoiceInfo: {
    width: "40%",
    textAlign: "right",
  },
  logoPlaceholder: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    color: "#555555",
    marginBottom: 5,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000000",
    marginVertical: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  tableHeader: {
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    flex: 1,
    textAlign: "center",
  },
  tableCellLast: {
    padding: 8,
    flex: 1,
    textAlign: "center",
  },
  totalSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    width: "50%",
    textAlign: "right",
    paddingRight: 10,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    width: "30%",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#555555",
  },
});

const MyDocument = ({ startDate, endDate, orders }) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= start && orderDate <= end;
  });

  const totalInvoice = filteredOrders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce(
        (itemSum, item) => itemSum + item.quantity * item.price,
        0
      )
    );
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.companyInfo}>
              <Text style={styles.logoPlaceholder}>UPTD Aneka Usaha</Text>
              <Text>
                Jalan Pleret Raya, Kelurahan Sumber, Kecamatan Banjarsari, Kota
                Surakarta
              </Text>
              <Text>Telp: 085713561686</Text>
            </View>
            <View style={styles.invoiceInfo}>
              <Text>Nomor Invoice: INV-{new Date().getTime()}</Text>
              <Text>Tanggal Cetak: {getFormattedDate(new Date())}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Sejarah Pembelian Bibit Ikan</Text>
        <Text style={styles.subtitle}>
          Periode: {getFormattedDate(startDate)} - {getFormattedDate(endDate)}
        </Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Tanggal</Text>
            <Text style={styles.tableCell}>Item</Text>
            <Text style={styles.tableCell}>Jumlah</Text>
            <Text style={styles.tableCell}>Harga Satuan</Text>
            <Text style={styles.tableCellLast}>Total</Text>
          </View>
          {filteredOrders.flatMap((order) =>
            order.items.map((item, index) => (
              <View key={`${order._id}-${index}`} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {getFormattedDate(order.createdAt)}
                </Text>
                <Text style={styles.tableCell}>
                  {item.product?.name || "Unknown Product"}
                </Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>
                  Rp {item.price.toLocaleString("id-ID")}
                </Text>
                <Text style={styles.tableCellLast}>
                  Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Penjualan:</Text>
            <Text style={styles.totalValue}>
              Rp {totalInvoice.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Function to generate Excel data
const generateExcelData = (startDate, endDate, orders) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= start && orderDate <= end;
  });

  // Create Excel data array
  const excelData = [];

  // Add headers
  excelData.push(["UPTD Aneka Usaha - Laporan Penjualan Ikan", "", "", "", ""]);
  excelData.push([
    "Jalan Pleret Raya, Kelurahan Sumber, Kecamatan Banjarsari, Kota Surakarta",
    "",
    "",
    "",
    "",
  ]);
  excelData.push(["Telp: 085713561686", "", "", "", ""]);
  excelData.push([
    `Periode: ${getFormattedDate(startDate)} - ${getFormattedDate(endDate)}`,
    "",
    "",
    "",
    "",
  ]);
  excelData.push([""]); // Empty row for spacing

  // Add table headers
  excelData.push([
    "Tanggal",
    "Item",
    "Jumlah",
    "Harga Satuan (Rp)",
    "Total (Rp)",
  ]);

  // Add data rows
  filteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      excelData.push([
        getFormattedDate(order.createdAt),
        item.product?.name || "Unknown Product",
        item.quantity,
        item.price,
        item.quantity * item.price,
      ]);
    });
  });

  // Add total row
  const totalInvoice = filteredOrders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce(
        (itemSum, item) => itemSum + item.quantity * item.price,
        0
      )
    );
  }, 0);

  excelData.push([""]); // Empty row for spacing
  excelData.push(["", "", "", "Total Penjualan:", totalInvoice]);

  return excelData;
};

// Function to download Excel file
const downloadExcel = (startDate, endDate, orders) => {
  const excelData = generateExcelData(startDate, endDate, orders);

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

  // Generate Excel file
  XLSX.writeFile(
    workbook,
    `Laporan_Penjualan_Ikan_${startDate}_${endDate}.xlsx`
  );
};

const SalesReportModal = ({ onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://iwak.onrender.com/api/orders/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Get current date for default endDate
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setEndDate(formattedDate);

    // Set default startDate to 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 bg-white-100 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center h-40">
            <div className="w-12 h-12 border-4 border-t-[#1A9882] border-b-[#1A9882] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Loading orders...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-md mx-auto">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✖
          </button>
          <div className="flex flex-col items-center justify-center h-40">
            <div className="text-red-500 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-auto relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2 z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-left mb-3 sm:mb-4 mt-1">
          Laporan Penjualan Ikan
        </h2>

        <p className="text-left text-gray-600 text-sm sm:text-base">
          Dicetak pada: <strong>{getFormattedDate(new Date())}</strong>
        </p>

        <div className="flex flex-col sm:flex-row justify-left items-left gap-3 mt-4">
          <div className="w-full sm:w-auto">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Mulai:
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Akhir:
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <p className="text-left text-gray-600 text-sm sm:text-base my-4">
          Laporan penjualan pada:{" "}
          <strong>
            {startDate && endDate
              ? `${getFormattedDate(startDate)} - ${getFormattedDate(endDate)}`
              : "Pilih rentang waktu"}
          </strong>
        </p>

        <div className="flex flex-col sm:flex-row justify-left gap-3 sm:gap-4 mt-6 px-2">
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
                fileName="Laporan_Penjualan_Ikan.pdf"
                className="w-full sm:w-auto"
              >
                {({ loading }) => (
                  <button className="w-full bg-[#E9FAF7] text-[#1A9882] px-4 sm:px-6 py-2 rounded-lg shadow-lg hover:bg-[#D8EFEC] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                    </svg>
                    {loading ? "Membuat PDF..." : "Download PDF"}
                  </button>
                )}
              </PDFDownloadLink>

              <button
                onClick={() => downloadExcel(startDate, endDate, orders)}
                className="w-full sm:w-auto bg-[#E9F0FF] text-[#3182CE] px-4 sm:px-6 py-2 rounded-lg shadow-lg hover:bg-[#D8E4FF] flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                Download Excel
              </button>
            </>
          )}
        </div>

        {startDate && endDate && orders.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <p className="font-medium mb-2 text-center">Preview Laporan:</p>
            <div className="border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tanggal
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Jumlah
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Harga
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders
                    .filter((order) => {
                      const orderDate = new Date(order.createdAt);
                      const start = new Date(startDate);
                      start.setHours(0, 0, 0, 0);
                      const end = new Date(endDate);
                      end.setHours(23, 59, 59, 999);
                      return orderDate >= start && orderDate <= end;
                    })
                    .slice(0, 5)
                    .flatMap((order) =>
                      order.items.map((item, index) => (
                        <tr
                          key={`${order._id}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {getFormattedDate(order.createdAt)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {item.product?.name || "Unknown Product"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            Rp {item.price.toLocaleString("id-ID")}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            Rp{" "}
                            {(item.quantity * item.price).toLocaleString(
                              "id-ID"
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
              {orders
                .filter((order) => {
                  const orderDate = new Date(order.createdAt);
                  const start = new Date(startDate);
                  start.setHours(0, 0, 0, 0);
                  const end = new Date(endDate);
                  end.setHours(23, 59, 59, 999);
                  return orderDate >= start && orderDate <= end;
                })
                .flatMap((order) => order.items).length > 5 && (
                <div className="p-2 text-center text-sm text-gray-500">
                  Showing 5 of{" "}
                  {
                    orders
                      .filter((order) => {
                        const orderDate = new Date(order.createdAt);
                        const start = new Date(startDate);
                        start.setHours(0, 0, 0, 0);
                        const end = new Date(endDate);
                        end.setHours(23, 59, 59, 999);
                        return orderDate >= start && orderDate <= end;
                      })
                      .flatMap((order) => order.items).length
                  }{" "}
                  items. Download the report to see all data.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReportModal;
