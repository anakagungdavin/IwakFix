import React, { useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import historyPembelian from "../../dummyData/dataSet";

const getFormattedDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

const parseDate = (dateStr) => {
    const months = {
        "Januari": "01", "Februari": "02", "Maret": "03", "April": "04",
        "Mei": "05", "Juni": "06", "Juli": "07", "Agustus": "08",
        "September": "09", "Oktober": "10", "November": "11", "Desember": "12"
    };
    
    const parts = dateStr.split(" ");
    if (parts.length !== 3) return null;
    const day = parts[0].padStart(2, "0");
    const month = months[parts[1]];
    const year = parts[2];

    return new Date(`${year}-${month}-${day}`);
};

// const styles = StyleSheet.create({
//     page: { padding: 30 },
//     title: { fontSize: 20, textAlign: "center", marginBottom: 10 },
//     subtitle: { fontSize: 12, textAlign: "center", marginBottom: 10 },
//     table: { display: "table", width: "100%", marginBottom: 10 },
//     row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#000" },
//     cell: { flex: 1, padding: 5 },
// });

const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: "Helvetica" },
    header: { backgroundColor: "#1A9882", padding: 10, borderRadius: 5, color: "white", textAlign: "center", marginBottom: 20 },
    title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
    subtitle: { fontSize: 12, textAlign: "center", marginBottom: 10 },
    table: { display: "table", width: "100%", borderCollapse: "collapse", marginBottom: 20 },
    row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd", padding: 5 },
    headerRow: { backgroundColor: "#2388FF", fontWeight: "bold" },
    cell: { flex: 1, textAlign: "center", padding: 5 },
    totalSection: { textAlign: "right", fontSize: 16, fontWeight: "bold", padding: 10, backgroundColor: "#2388FF", color: "white", borderRadius: 5 }
});

const MyDocument = ({ startDate, endDate }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={{ fontSize: 14 }}>IWAK.</Text>
                <Text>Jl. Contoh No. 123, Indonesia</Text>
                <Text>Email: contoh@email.com</Text>
            </View>
            <Text style={styles.title}>Laporan Penjualan Ikan</Text>
            <Text style={styles.subtitle}>Di cetak pada: {getFormattedDate(new Date())}</Text>
            <Text style={styles.subtitle}>Laporan penjualan pada: {getFormattedDate(startDate)} - {getFormattedDate(endDate)}</Text>
            <View style={styles.table}>
                {/* <View style={[styles.row, { backgroundColor: "#ddd" }]}> */}
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.cell}>Item</Text>
                    <Text style={styles.cell}>Jumlah</Text>
                    <Text style={styles.cell}>Harga</Text>
                    <Text style={styles.cell}>Total</Text>
                </View>
                {historyPembelian
                    .filter(item => {
                        const itemDate = parseDate(item.date);
                        return itemDate && itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
                    })
                        
                        
                    .map((item, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.cell}>{item.orderDetails.productName}</Text>
                            <Text style={styles.cell}>{item.orderDetails.quantity}</Text>
                            <Text style={styles.cell}>Rp {item.orderDetails.pricePerUnit}</Text>
                            <Text style={styles.cell}>Rp {(item.orderDetails.quantity * item.orderDetails.pricePerUnit).toFixed(3)}</Text>
                        </View>
                    ))}
            </View>
            <View style={styles.totalSection}>
                <Text>Invoice Total: Rp {historyPembelian.reduce((sum, item) => sum + item.orderDetails.quantity * item.orderDetails.pricePerUnit, 0).toFixed(3)}</Text>
            </View>  
        </Page>
    </Document>
);

const SalesReportModal = ({ onClose }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✖</button>
                <h2 className="text-2xl font-bold text-center mb-4">Laporan Penjualan Ikan</h2>
                <p className="text-center text-gray-600">Di cetak pada: <strong>{getFormattedDate(new Date())}</strong></p>
                
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

                <p className="text-center text-gray-600 mb-6">Laporan penjualan pada: <strong>{startDate && endDate ? `${getFormattedDate(startDate)} - ${getFormattedDate(endDate)}` : "Pilih rentang waktu"}</strong></p>
                
                <div className="flex justify-center mt-6">
                    {startDate && endDate && (
                        <PDFDownloadLink document={<MyDocument startDate={startDate} endDate={endDate} />} fileName="Laporan_Penjualan_Ikan.pdf">
                            {({ loading }) => (
                                <button className="bg-[#E9FAF7] text-[#1A9882] px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700">
                                    {loading ? "Membuat PDF..." : "Download PDF"}
                                </button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesReportModal;
