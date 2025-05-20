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

// Modified MyDocument component with improved customer name handling
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

  // Fix: Properly check if customerName exists in the filtered orders
  // Use a more robust approach to get customer name
  let customerName = "-";

  if (filteredOrders.length > 0) {
    // Check if customerName exists directly on the order
    if (filteredOrders[0].customerName) {
      customerName = filteredOrders[0].customerName;
    }
    // Check if there's a customer object with a name property
    else if (filteredOrders[0].customer && filteredOrders[0].customer.name) {
      customerName = filteredOrders[0].customer.name;
    }
    // Try to find customer name in any other potential location
    else if (filteredOrders[0].user && filteredOrders[0].user.name) {
      customerName = filteredOrders[0].user.name;
    }
  }

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
              <Text>Nama Pelanggan: {customerName}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Riwayat Transaksi Bibit Ikan</Text>
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
          {filteredOrders.length > 0 ? (
            filteredOrders.flatMap((order) =>
              order.items && order.items.length > 0 ? (
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
              ) : (
                <View key={order._id} style={styles.tableRow}>
                  <Text style={styles.tableCellLast}>
                    No items in this order
                  </Text>
                </View>
              )
            )
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLast}>
                No orders found in this period
              </Text>
            </View>
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

const CustReportModal = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isOpen) return; // Only fetch when modal is open

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/orders/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Log the first order to help with debugging
        if (response.data && response.data.length > 0) {
          console.log("First order data:", response.data[0]);
        }

        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, isOpen]);

  // Add this check - if not open, don't render anything
  if (!isOpen) return null;

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p>Loading orders...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-red-500">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold p-2"
          aria-label="Close"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">
          Laporan Penjualan Ikan
        </h2>
        <p className="text-center text-gray-600">
          Dicetak pada: <strong>{getFormattedDate(new Date())}</strong>
        </p>

        <div className="flex justify-center space-x-4 mt-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <p className="text-center text-gray-600 mb-6">
          Laporan penjualan pada:{" "}
          <strong>
            {startDate && endDate
              ? `${getFormattedDate(startDate)} - ${getFormattedDate(endDate)}`
              : "Pilih rentang waktu"}
          </strong>
        </p>

        <div className="flex justify-center mt-6">
          {startDate && endDate ? (
            <PDFDownloadLink
              document={
                <MyDocument
                  startDate={startDate}
                  endDate={endDate}
                  orders={orders}
                />
              }
              fileName="Riwayat_Transaksi_Ikan.pdf"
            >
              {({ loading }) => (
                <button className="bg-[#003D47] hover:bg-[#002A33] text-white px-6 py-2 rounded-lg shadow-lg transition duration-200">
                  {loading ? "Membuat PDF..." : "Download PDF"}
                </button>
              )}
            </PDFDownloadLink>
          ) : (
            <button
              className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg shadow-lg cursor-not-allowed"
              disabled
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustReportModal;
