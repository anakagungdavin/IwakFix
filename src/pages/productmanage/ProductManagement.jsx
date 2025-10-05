import React, { useState, useEffect } from "react";
import Breadcrumb from "../../breadcrumb/breadcrumb";
import TableMeneProduk from "../../components/tables/TableProdukMene";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { Plus, Download } from "lucide-react";
// Pastikan path ini benar dan Anda sudah menambahkan fungsinya di api.jsx
import { getStockReportData } from "../../services/api";

// --- BAGIAN PDF & EXCEL (Kode asli Anda dipertahankan sepenuhnya) ---
const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    paddingTop: 25,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 40,
    lineHeight: 1.4,
  },
  headerText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
    color: "#2c3e50",
    fontFamily: "Helvetica-Bold",
  },
  subtitleText: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginVertical: 8,
  },
  tableRow: { flexDirection: "row", backgroundColor: "#ffffff" },
  tableHeaderRow: { flexDirection: "row", backgroundColor: "#f0f2f5" },
  tableCol: {
    borderStyle: "solid",
    borderColor: "#cccccc",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 4,
    overflow: "hidden",
  },
  tableCell: { fontSize: 8, textAlign: "left" },
  tableCellHeader: {
    fontSize: 8,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  tableCellCenter: { textAlign: "center" },
  tableCellRight: { textAlign: "right" },
  colNo: { width: "4%" },
  colNama: { width: "20%" },
  colJenis: { width: "12%" },
  colUkuran: { width: "10%" },
  colHarga: { width: "11%" },
  colDiskon: { width: "7%" },
  colHargaAkhir: { width: "12%" },
  colStok: { width: "8%" },
  colSatuan: { width: "8%" },
  colPublished: { width: "8%" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#888888",
    fontSize: 7,
  },
});

const getFormattedDate = (dateInput) => {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  if (isNaN(date)) return "Invalid Date";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const ProductListDocument = ({ products }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page} orientation="landscape">
      <Text style={pdfStyles.headerText}>Laporan Daftar Produk</Text>
      <Text style={pdfStyles.subtitleText}>
        Tanggal Cetak: {getFormattedDate(new Date())}
      </Text>
      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableHeaderRow}>
          <View style={[pdfStyles.tableCol, pdfStyles.colNo]}>
            <Text style={pdfStyles.tableCellHeader}>No</Text>
          </View>
          <View style={[pdfStyles.tableCol, pdfStyles.colNama]}>
            <Text style={pdfStyles.tableCellHeader}>Nama Produk</Text>
          </View>
          <View style={[pdfStyles.tableCol, pdfStyles.colJenis]}>
            <Text style={pdfStyles.tableCellHeader}>Jenis</Text>
          </View>
          <View style={[pdfStyles.tableCol, pdfStyles.colUkuran]}>
            <Text style={pdfStyles.tableCellHeader}>Ukuran</Text>
          </View>
          <View style={[pdfStyles.tableCol, pdfStyles.colHarga]}>
            <Text style={pdfStyles.tableCellHeader}>Harga (Rp)</Text>
          </View>
          <View style={[pdfStyles.tableCol, pdfStyles.colDiskon]}>
            <Text style={pdfStyles.tableCellHeader}>Diskon (%)</Text>
          </View>
          <View style={[pdfStyles.tableCol, pdfStyles.colHargaAkhir]}>
            <Text style={pdfStyles.tableCellHeader}>Harga Akhir (Rp)</Text>
          </View>
          <View style={[pdfStyles.tableCol, pdfStyles.colStok]}>
            <Text style={pdfStyles.tableCellHeader}>Stok</Text>
          </View>
          <View style={[pdfStyles.tableCol, pdfStyles.colSatuan]}>
            <Text style={pdfStyles.tableCellHeader}>Satuan</Text>
          </View>
          <View style={[pdfStyles.tableCol, pdfStyles.colPublished]}>
            <Text style={pdfStyles.tableCellHeader}>Published</Text>
          </View>
        </View>
        {products.flatMap((product, productIndex) =>
          product.stocks && product.stocks.length > 0 ? (
            product.stocks.map((stockItem, stockIndex) => {
              const hargaAsli = stockItem.price || 0;
              const diskon = stockItem.discount || 0;
              const hargaAkhir = hargaAsli * (1 - diskon / 100);
              return (
                <View
                  style={pdfStyles.tableRow}
                  key={`${product._id}-${stockIndex}-${stockItem.jenis}-${stockItem.size}`}
                  wrap={false}
                >
                  <View style={[pdfStyles.tableCol, pdfStyles.colNo]}>
                    <Text
                      style={[pdfStyles.tableCell, pdfStyles.tableCellCenter]}
                    >
                      {productIndex + 1}.{stockIndex + 1}
                    </Text>
                  </View>
                  <View style={[pdfStyles.tableCol, pdfStyles.colNama]}>
                    <Text style={pdfStyles.tableCell}>{product.name}</Text>
                  </View>
                  <View style={[pdfStyles.tableCol, pdfStyles.colJenis]}>
                    <Text style={pdfStyles.tableCell}>
                      {stockItem.jenis || "-"}
                    </Text>
                  </View>
                  <View style={[pdfStyles.tableCol, pdfStyles.colUkuran]}>
                    <Text style={pdfStyles.tableCell}>
                      {stockItem.size || "-"}
                    </Text>
                  </View>
                  <View style={[pdfStyles.tableCol, pdfStyles.colHarga]}>
                    <Text
                      style={[pdfStyles.tableCell, pdfStyles.tableCellRight]}
                    >
                      {hargaAsli.toLocaleString("id-ID")}
                    </Text>
                  </View>
                  <View style={[pdfStyles.tableCol, pdfStyles.colDiskon]}>
                    <Text
                      style={[pdfStyles.tableCell, pdfStyles.tableCellCenter]}
                    >
                      {diskon}
                    </Text>
                  </View>
                  <View style={[pdfStyles.tableCol, pdfStyles.colHargaAkhir]}>
                    <Text
                      style={[pdfStyles.tableCell, pdfStyles.tableCellRight]}
                    >
                      {hargaAkhir.toLocaleString("id-ID")}
                    </Text>
                  </View>
                  <View style={[pdfStyles.tableCol, pdfStyles.colStok]}>
                    <Text
                      style={[pdfStyles.tableCell, pdfStyles.tableCellCenter]}
                    >
                      {stockItem.stock || 0}
                    </Text>
                  </View>
                  <View style={[pdfStyles.tableCol, pdfStyles.colSatuan]}>
                    <Text style={pdfStyles.tableCell}>
                      {stockItem.satuan || "-"}
                    </Text>
                  </View>
                  <View style={[pdfStyles.tableCol, pdfStyles.colPublished]}>
                    <Text
                      style={[pdfStyles.tableCell, pdfStyles.tableCellCenter]}
                    >
                      {product.isPublished ? "Y" : "N"}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View
              style={pdfStyles.tableRow}
              key={`${product._id}-nostock`}
              wrap={false}
            >
              <View style={[pdfStyles.tableCol, pdfStyles.colNo]}>
                <Text style={[pdfStyles.tableCell, pdfStyles.tableCellCenter]}>
                  {productIndex + 1}
                </Text>
              </View>
              <View style={[pdfStyles.tableCol, pdfStyles.colNama]}>
                <Text style={pdfStyles.tableCell}>{product.name}</Text>
              </View>
              <View
                style={[
                  pdfStyles.tableCol,
                  { width: "51%", fontStyle: "italic" },
                ]}
              >
                <Text style={[pdfStyles.tableCell, pdfStyles.tableCellCenter]}>
                  Detail stok tidak tersedia
                </Text>
              </View>
              <View style={[pdfStyles.tableCol, pdfStyles.colStok]}>
                <Text style={[pdfStyles.tableCell, pdfStyles.tableCellCenter]}>
                  {product.stock || 0}
                </Text>
              </View>
              <View style={[pdfStyles.tableCol, pdfStyles.colSatuan]}>
                <Text style={[pdfStyles.tableCell, pdfStyles.tableCellCenter]}>
                  -
                </Text>
              </View>
              <View style={[pdfStyles.tableCol, pdfStyles.colPublished]}>
                <Text style={[pdfStyles.tableCell, pdfStyles.tableCellCenter]}>
                  {product.isPublished ? "Y" : "N"}
                </Text>
              </View>
            </View>
          )
        )}
      </View>
      <Text style={pdfStyles.footer} fixed>
        Laporan ini dihasilkan secara otomatis oleh sistem IWAK. Halaman{" "}
        <Text
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Text>
    </Page>
  </Document>
);

const generateExcelData = (products) => {
  const excelHeader = [];
  excelHeader.push(["Laporan Daftar Produk"]);
  excelHeader.push([`Tanggal Cetak: ${getFormattedDate(new Date())}`]);
  excelHeader.push([]);
  const tableData = [];
  const tableHeaders = [
    "No",
    "Nama Produk",
    "Jenis",
    "Ukuran",
    "Harga (Rp)",
    "Diskon (%)",
    "Harga Akhir (Rp)",
    "Stok",
    "Satuan",
    "Published",
  ];
  tableData.push(tableHeaders);
  let overallIndex = 0;
  products.forEach((product) => {
    if (product.stocks && product.stocks.length > 0) {
      product.stocks.forEach((stockItem) => {
        overallIndex++;
        const hargaAsli = stockItem.price || 0;
        const diskon = stockItem.discount || 0;
        const hargaAkhir = hargaAsli * (1 - diskon / 100);
        tableData.push([
          overallIndex,
          product.name,
          stockItem.jenis || "-",
          stockItem.size || "-",
          hargaAsli,
          diskon,
          hargaAkhir,
          stockItem.stock || 0,
          stockItem.satuan || "-",
          product.isPublished ? "Ya" : "Tidak",
        ]);
      });
    } else {
      overallIndex++;
      tableData.push([
        overallIndex,
        product.name,
        "-",
        "-",
        product.price || 0,
        product.discount || 0,
        (product.price || 0) * (1 - (product.discount || 0) / 100),
        product.stock || 0,
        "-",
        product.isPublished ? "Ya" : "Tidak",
      ]);
    }
  });
  return [...excelHeader, ...tableData];
};

const downloadExcel = (products) => {
  const excelDataArray = generateExcelData(products);
  const worksheet = XLSX.utils.aoa_to_sheet(excelDataArray);
  if (excelDataArray.length > 3) {
    const dataStartIndex = 3;
    const columnWidths = excelDataArray[dataStartIndex].map((_, colIndex) => {
      let maxLength = 0;
      for (let i = dataStartIndex; i < excelDataArray.length; i++) {
        const row = excelDataArray[i];
        if (row && row[colIndex] != null) {
          const cellLength = String(row[colIndex]).length;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        }
      }
      return { wch: maxLength + 2 };
    });
    worksheet["!cols"] = columnWidths;
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Produk");
  const hargaStartIndex = 4;
  const hargaAkhirIndex = 6;
  const stokIndex = 7;
  for (let R = 4; R < excelDataArray.length; ++R) {
    const hargaCellAddress = XLSX.utils.encode_cell({
      r: R,
      c: hargaStartIndex,
    });
    if (worksheet[hargaCellAddress]) {
      worksheet[hargaCellAddress].t = "n";
      worksheet[hargaCellAddress].z = "#,##0";
    }
    const hargaAkhirCellAddress = XLSX.utils.encode_cell({
      r: R,
      c: hargaAkhirIndex,
    });
    if (worksheet[hargaAkhirCellAddress]) {
      worksheet[hargaAkhirCellAddress].t = "n";
      worksheet[hargaAkhirCellAddress].z = "#,##0";
    }
    const stokCellAddress = XLSX.utils.encode_cell({ r: R, c: stokIndex });
    if (worksheet[stokCellAddress]) {
      worksheet[stokCellAddress].t = "n";
    }
  }
  XLSX.writeFile(
    workbook,
    `Laporan_Produk_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};

// --- KOMPONEN UTAMA ---
const ProductManagement = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState(null);
  const token = localStorage.getItem("token");

  // State untuk laporan STOK dengan rentang tanggal
  const [selectedProduct, setSelectedProduct] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [loadingStockReport, setLoadingStockReport] = useState(false);
  const [stockReportError, setStockReportError] = useState(null);

  const fetchProductsForReport = async () => {
    if (!token) {
      setReportError("Token tidak ditemukan. Silakan login kembali.");
      return null;
    }
    setLoadingReport(true);
    setReportError(null);
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await axios.get(`${apiUrl}/api/products/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllProducts(response.data);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Gagal mengambil data produk untuk laporan.";
      setReportError(message);
      return null;
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDownloadClick = async () => {
    if (allProducts.length === 0 && !loadingReport) {
      const fetchedProducts = await fetchProductsForReport();
      if (fetchedProducts && fetchedProducts.length > 0) {
        return fetchedProducts;
      } else {
        alert(
          "Tidak ada data produk untuk diekspor atau gagal mengambil data."
        );
        return null;
      }
    }
    return allProducts;
  };

  useEffect(() => {
    fetchProductsForReport();
  }, []);

  const handleGenerateStockReport = async () => {
    if (!selectedProduct || !startDate || !endDate) {
      alert("Silakan pilih produk dan tentukan rentang tanggal.");
      return;
    }

    setLoadingStockReport(true);
    setStockReportError(null);

    try {
      const reportData = await getStockReportData(
        selectedProduct,
        startDate,
        endDate
      );

      // 1. Persiapan Data (Sama seperti sebelumnya)
      const dataForSheet = [];
      const formattedStartDate = getFormattedDate(startDate);
      const formattedEndDate = getFormattedDate(endDate);

      dataForSheet.push(["UPTD ANEKA USAHA PERIKANAN"]);
      dataForSheet.push(["LAPORAN STOK PERSEDIAAN BENIH IKAN"]);
      dataForSheet.push([
        `Periode: ${formattedStartDate} - ${formattedEndDate}`,
      ]);
      dataForSheet.push([]);
      dataForSheet.push([reportData.productName || "N/A"]);

      const tableHeader = [
        "Tanggal",
        "Stok Ketersediaan Benih",
        "Stok Terjual",
        "Sisa Stok Ketersediaan",
        "Keterangan",
      ];
      dataForSheet.push(tableHeader);

      let totalAdded = 0;
      let totalSold = 0;

      const initialRow = [
        "",
        reportData.initialStock,
        "",
        reportData.initialStock,
        "Stok Awal Periode",
      ];
      dataForSheet.push(initialRow);
      totalAdded += reportData.initialStock;

      reportData.transactions.forEach((trx) => {
        const runningStock =
          (dataForSheet[dataForSheet.length - 1][3] || 0) +
          (trx.added || 0) -
          (trx.sold || 0);

        const formattedDate = new Date(trx.date)
          .toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-");

        const addedValue = trx.added || "";
        const soldValue = trx.sold || "";

        dataForSheet.push([
          formattedDate,
          addedValue,
          soldValue,
          runningStock,
          trx.note,
        ]);

        if (addedValue) totalAdded += addedValue;
        if (soldValue) totalSold += soldValue;
      });

      const finalStock =
        dataForSheet.length > 7
          ? dataForSheet[dataForSheet.length - 1][3]
          : reportData.initialStock;
      const totalRow = ["TOTAL", totalAdded, totalSold, finalStock, ""];
      dataForSheet.push(totalRow);

      // 2. Buat Worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(dataForSheet);
      worksheet["!cols"] = [
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 25 },
        { wch: 30 },
      ];

      // --- PERBAIKAN: Logika untuk Menambahkan Outline dan Bold ---

      const tableStartIndex = 5; // Baris header tabel (indeks 0-based)
      const tableEndIndex = dataForSheet.length - 1; // Baris total
      const totalColCount = tableHeader.length;

      // Definisikan style
      const thinBorder = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
      const headerStyle = { font: { bold: true }, border: thinBorder };
      const totalRowStyle = { font: { bold: true }, border: thinBorder };
      const cellStyle = { border: thinBorder };

      // Iterasi melalui setiap sel dalam rentang tabel untuk menerapkan style
      for (let R = tableStartIndex; R <= tableEndIndex; ++R) {
        for (let C = 0; C < totalColCount; ++C) {
          const cell_address = XLSX.utils.encode_cell({ c: C, r: R });
          if (!worksheet[cell_address]) continue; // Lewati jika sel kosong

          if (R === tableStartIndex) {
            // Jika ini baris header
            worksheet[cell_address].s = headerStyle;
          } else if (R === tableEndIndex) {
            // Jika ini baris total
            worksheet[cell_address].s = totalRowStyle;
          } else {
            // Untuk sel data biasa
            worksheet[cell_address].s = cellStyle;
          }
        }
      }
      // --- AKHIR PERBAIKAN ---

      // 3. Buat dan Unduh Workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Stok");
      XLSX.writeFile(
        workbook,
        `Laporan_Stok_${reportData.productName}_${startDate}_sd_${endDate}.xlsx`,
        { cellStyles: true }
      );
    } catch (err) {
      console.error("Error generating stock report:", err);
      const message =
        err.response?.data?.message || "Gagal membuat laporan stok.";
      setStockReportError(message);
      alert(message);
    } finally {
      setLoadingStockReport(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-screen py-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
        <Breadcrumb pageName="Manajemen Produk" />
        <div className="grid grid-cols-1 gap-8">
          <div className="col-span-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
              <button
                onClick={() => navigate("add")}
                className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-[#003D47] text-white hover:bg-[#002c33] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm cursor-pointer"
              >
                <Plus size={20} className="mr-2" />
                Tambah Produk
              </button>
              <div className="flex items-center justify-center gap-3">
                {allProducts.length > 0 && !loadingReport ? (
                  <PDFDownloadLink
                    document={<ProductListDocument products={allProducts} />}
                    fileName={`Laporan_Produk_${new Date()
                      .toISOString()
                      .slice(0, 10)}.pdf`}
                  >
                    {({ loading }) => (
                      <button
                        className="flex items-center w-full sm:w-auto justify-center px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-700 dark:hover:bg-red-600 dark:text-red-100 font-medium rounded-lg text-sm cursor-pointer"
                        disabled={loading}
                      >
                        <Download size={18} className="mr-2" />
                        {loading ? "Memuat..." : "PDF List Produk"}
                      </button>
                    )}
                  </PDFDownloadLink>
                ) : (
                  <button
                    onClick={handleDownloadClick}
                    className="flex items-center w-full sm:w-auto justify-center px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-700 dark:hover:bg-red-600 dark:text-red-100 font-medium rounded-lg text-sm cursor-pointer"
                    disabled={loadingReport}
                  >
                    <Download size={18} className="mr-2" />
                    {loadingReport ? "Memuat..." : "PDF List Produk"}
                  </button>
                )}
                <button
                  onClick={async () => {
                    const products = await handleDownloadClick();
                    if (products) downloadExcel(products);
                  }}
                  className="flex items-center w-full sm:w-auto justify-center px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-700 dark:hover:bg-green-600 dark:text-green-100 font-medium rounded-lg text-sm cursor-pointer"
                  disabled={loadingReport}
                >
                  <Download size={18} className="mr-2" />
                  Excel List Produk
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                Generate Laporan Stok Kustom
              </h3>
              <div className="flex flex-col lg:flex-row items-end gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="w-full lg:w-auto lg:flex-1">
                  <label className="text-xs text-gray-600 dark:text-gray-300">
                    Produk
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white cursor-pointer"
                  >
                    <option value="">Pilih Produk...</option>
                    {allProducts.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full lg:w-auto lg:flex-1">
                  <label className="text-xs text-gray-600 dark:text-gray-300">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white"
                  />
                </div>
                <div className="w-full lg:w-auto lg:flex-1">
                  <label className="text-xs text-gray-600 dark:text-gray-300">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white"
                  />
                </div>

                <div className="w-full lg:w-auto">
                  <button
                    onClick={handleGenerateStockReport}
                    disabled={loadingStockReport}
                    className="w-full flex items-center justify-center px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-blue-100 font-medium rounded-lg text-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Download size={18} className="mr-2" />
                    {loadingStockReport ? "Membuat..." : "Generate Laporan"}
                  </button>
                </div>
              </div>
              {stockReportError && (
                <p className="text-red-500 text-sm text-center w-full mt-2">
                  Error: {stockReportError}
                </p>
              )}
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
              <TableMeneProduk />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
