import { useState } from "react";

const products = [
  { id: 1, name: "Gurame", price: 10000, oldPrice: 15000, image: "/gurame.png", sales: 200 },
  { id: 2, name: "Mas", price: 25000, oldPrice: 30000, image: "/mas.png", sales: 500 },
  { id: 3, name: "Gabus", price: 30000, oldPrice: 35000, image: "/gabus.png", sales: 300 },
  { id: 4, name: "Patin", price: 20000, oldPrice: 25000, image: "/patin.png", sales: 100 },
  { id: 5, name: "Nila", price: 18000, oldPrice: 23000, image: "/nila.png", sales: 400 },
];

const FishStore = () => {
  const [sortBy, setSortBy] = useState("terlaris");
  const [page, setPage] = useState(1);
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "terlaris") return b.sales - a.sales;
    if (sortBy === "terbaru") return b.id - a.id;
    if (sortBy === "harga-tinggi") return b.price - a.price;
    if (sortBy === "harga-rendah") return a.price - b.price;
    return 0;
  });

  const calculateDiscount = (oldPrice, price) => {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded ${sortBy === "terlaris" && "bg-[#003D47] text-white"}`} onClick={() => setSortBy("terlaris")}>Terlaris</button>
                    <button className={`px-4 py-2 rounded ${sortBy === "terbaru" && "bg-[#003D47] text-white"}`} onClick={() => setSortBy("terbaru")}>Terbaru</button>
                    <select className={`border rounded px-3 py-2 ${
                            sortBy === "harga-rendah" || sortBy === "harga-tinggi" || sortBy === "paling-sesuai"
                            ? "bg-[#003D47] text-white"
                            : "bg-white text-black"
                            }`} value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                        >
                        <option value="paling-sesuai">Paling Sesuai</option>
                        <option value="harga-rendah">Harga Termurah</option>
                        <option value="harga-tinggi">Harga Termahal</option>
                    </select>
                </div>
                <span className="text-gray-600">Menampilkan {sortedProducts.length} hasil</span>
            </div>

            {/* Grid Produk 5 Kolom */}
            <div className="grid grid-cols-5 gap-4">
                {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg shadow h-[250px] flex flex-col justify-between">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <div className="flex justify-center items-center gap-2">
                            <p className="text-sm text-gray-400 line-through">Rp{product.oldPrice.toLocaleString()}</p>
                            <span className="text-red-500 text-sm">-{calculateDiscount(product.oldPrice, product.price)}%</span>
                        </div>
                        <p className="text-lg font-bold text-[#003D47] ">Rp{product.price.toLocaleString()}/kg</p>
                    </div>
                </div>
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-6">
                {[1, 2, 3].map((num) => (
                <button
                    key={num}
                    className={`px-4 py-2 rounded ${page === num ? "bg-[#003D47] text-white" : "bg-gray-200"}`}
                    onClick={() => setPage(num)}
                >
                    {num}
                </button>
                ))}
                <button className="bg-gray-300 px-4 py-2 rounded">Next</button>
            </div>
        </div>
    </div>
  );
};

export default FishStore;
