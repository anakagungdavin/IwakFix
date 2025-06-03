// ProductManagement.jsx
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
  // Font, // Font bisa dihapus jika tidak mendaftarkan font kustom secara eksplisit
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { FileText, FileSpreadsheet, Plus, Download } from "lucide-react"; // Tambahkan ikon Plus dan Download

// --- BAGIAN PDF & EXCEL (Kode PDF dan Excel Anda tidak berubah, hanya styling tombol) ---
const pdfStyles = StyleSheet.create({
  // ... (style PDF Anda tetap sama)
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
    fontFamily: "Helvetica-Bold", // Langsung definisikan di sini
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
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f0f2f5", // Warna header tabel yang lebih lembut
  },
  tableCol: {
    borderStyle: "solid",
    borderColor: "#cccccc",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 4, // Padding konsisten
    overflow: "hidden",
  },
  tableCell: {
    fontSize: 8,
    textAlign: "left",
  },
  tableCellHeader: {
    fontSize: 8,
    textAlign: "center",
    fontFamily: "Helvetica-Bold", // Untuk teks header tebal
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
  // ... (fungsi getFormattedDate tetap sama)
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Komponen Dokumen PDF (Kode ini tidak berubah banyak, hanya pastikan styling konsisten)
const ProductListDocument = ({ products }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page} orientation="landscape">
      <Text style={pdfStyles.headerText}>Laporan Daftar Produk</Text>
      <Text style={pdfStyles.subtitleText}>
        Tanggal Cetak: {getFormattedDate(new Date())}
      </Text>
      <View style={pdfStyles.table}>
        {/* Header Tabel */}
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
        {/* Baris Data Tabel */}
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

// Fungsi generateExcelData dan downloadExcel tetap sama
const generateExcelData = (products) => {
  // ... (fungsi Anda tetap sama)
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
  // ... (fungsi Anda tetap sama)
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

const ProductManagement = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProductsForReport = async () => {
    // ... (fungsi fetchProductsForReport tetap sama)
    if (!token) {
      const msg = "Token tidak ditemukan. Silakan login kembali.";
      setReportError(msg);
      alert(msg);
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
      setAllProducts(response.data); // Simpan semua produk ke state
      return response.data;
    } catch (err) {
      console.error("Error fetching products for report:", err);
      const message =
        err.response?.data?.message ||
        "Gagal mengambil data produk untuk laporan.";
      setReportError(message);
      alert(message);
      return null;
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDownloadPdfClick = async () => {
    // Fungsi ini sekarang hanya trigger fetch jika data belum ada,
    // PDFDownloadLink akan menangani pembuatan dokumen saat diklik.
    if (allProducts.length === 0 && !loadingReport && !reportError) {
      await fetchProductsForReport();
    } else if (!allProducts.length && !loadingReport && !reportError) {
      alert("Tidak ada data produk untuk dicetak atau gagal mengambil data.");
    }
    // Jika allProducts sudah ada, PDFDownloadLink akan langsung menggunakan data tersebut.
  };

  return (
    <>
      {/* Menggunakan dark mode class dari template Anda jika ada */}
      <div className="bg-gray-100 dark:bg-gray-800 min-h-screen py-6">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
          <Breadcrumb pageName="Manajemen Produk" />

          <div className="grid grid-cols-1">
            {" "}
            {/* Mengubah menjadi 1 kolom untuk tata letak tombol */}
            <div className="col-span-1">
              {" "}
              {/* Menggunakan col-span-1 karena hanya 1 kolom utama */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
                {" "}
                {/* Penambahan padding, bg, dan shadow */}
                {/* Tombol Tambah Produk */}
                <button
                  onClick={() => navigate("add")}
                  className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-[#003D47] text-white hover:bg-[#002c33] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm transition-colors duration-150 cursor-pointer"
                >
                  <Plus size={20} className="mr-2" />
                  Tambah Produk
                </button>
                {/* Grup Tombol Cetak */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  {loadingReport && (
                    <span className="text-sm text-gray-600 dark:text-gray-300 animate-pulse self-center">
                      Memuat data laporan...
                    </span>
                  )}

                  {/* Tombol Cetak PDF */}
                  {/* Kondisi untuk PDFDownloadLink atau button biasa */}
                  {allProducts.length > 0 && !loadingReport && !reportError ? (
                    <PDFDownloadLink
                      document={<ProductListDocument products={allProducts} />}
                      fileName={`Laporan_Produk_${new Date()
                        .toISOString()
                        .slice(0, 10)}.pdf`}
                      className="w-full sm:w-auto cursor-pointer" // Menambahkan cursor-pointer ke link <a> itu sendiri
                      onClick={() => {
                        /* Optional */
                      }}
                    >
                      {({ loading: pdfLoading }) => (
                        <div // Mengganti button dengan div agar tidak ada nested button dan styling tetap dari link
                          // Kelas-kelas styling tombol dipindahkan ke div atau langsung ke className PDFDownloadLink jika memungkinkan
                          className="w-full bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-700 dark:hover:bg-red-600 dark:text-red-100 font-medium px-5 py-2.5 rounded-lg shadow-sm border border-red-200 dark:border-red-600 flex items-center justify-center transition-colors duration-150"
                          // Hapus disabled di sini karena PDFDownloadLink yang mengontrolnya
                        >
                          <Download size={18} className="mr-2" />
                          {pdfLoading || loadingReport
                            ? "Memuat PDF..."
                            : "Download PDF"}{" "}
                          {/* Sesuaikan kondisi loading */}
                        </div>
                      )}
                    </PDFDownloadLink>
                  ) : (
                    <button
                      onClick={handleDownloadPdfClick}
                      disabled={loadingReport}
                      className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-700 dark:hover:bg-red-600 dark:text-red-100 font-medium px-5 py-2.5 rounded-lg shadow-sm border border-red-200 dark:border-red-600 flex items-center justify-center transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Download size={18} className="mr-2" />
                      Download PDF
                    </button>
                  )}

                  {/* Tombol Cetak Excel */}
                  <button
                    onClick={async () => {
                      let productsToExport = allProducts;
                      if (
                        productsToExport.length === 0 &&
                        !loadingReport &&
                        !reportError
                      ) {
                        productsToExport = await fetchProductsForReport();
                      }
                      if (productsToExport && productsToExport.length > 0) {
                        downloadExcel(productsToExport);
                      } else if (!loadingReport && !reportError) {
                        // Pesan error sudah ditangani oleh fetchProductsForReport jika gagal
                        alert(
                          "Tidak ada data produk untuk diekspor atau gagal mengambil data."
                        );
                      }
                    }}
                    disabled={loadingReport}
                    className="w-full sm:w-auto bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-700 dark:hover:bg-green-600 dark:text-green-100 font-medium px-5 py-2.5 rounded-lg shadow-sm border border-green-200 dark:border-green-600 flex items-center justify-center transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Download size={18} className="mr-2" />{" "}
                    {/* Mengganti ikon */}
                    Download Excel
                  </button>
                </div>
              </div>
              {reportError &&
                !loadingReport && ( // Tampilkan error jika ada dan tidak sedang loading
                  <p className="text-red-500 text-sm mt-2 text-right px-4">
                    Error: {reportError}
                  </p>
                )}
            </div>
            <div className="col-span-1">
              {" "}
              {/* Menggunakan col-span-1 */}
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <TableMeneProduk />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
