import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStatus } from "../../pages/productmanage/AddProduct";
import DeleteModal from "../modal/modalDelete";
import ModalView from "../modal/modalViewProduk"; // Ensure this path is correct
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { getProducts, deleteProduct } from "../../services/api";

const TableMeneProduk = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log("API Response:", response); // Debug log

        // Check if response.products exists and is an array
        if (!response?.products || !Array.isArray(response.products)) {
          throw new Error(
            "Data produk tidak ditemukan atau respons tidak valid"
          );
        }

        const formattedProducts = response.products.map((item) => {
          // Calculate total stock from the stocks array
          const totalStock = Array.isArray(item.stocks)
            ? item.stocks.reduce((sum, stock) => sum + (stock.stock || 0), 0)
            : 0;

          const statusData = getStatus(totalStock, item.isPublished);
          return {
            ...item,
            stock: totalStock, // Override stock with the total
            status: statusData.label,
            statusColor: statusData.jenis, // Use jenis for className as per getStatus
            image:
              item.images && item.images.length > 0 ? item.images[0] : null,
          };
        });

        setData(formattedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error.message, error.stack);
        setData([]);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(selectedItem._id);
      setData(data.filter((item) => item._id !== selectedItem._id));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete product:", error.message, error.stack);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleEditClick = (id) => {
    navigate(`/product-management/edit/${id}`);
  };

  return (
    <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }} className="text-left">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black">
                Produk
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                Stok
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((packageItem, key) => (
              <tr key={key}>
                {/* Kolom Nama & Image (Harga Removed) */}
                <td className="border-b border-[#eee] py-5 px-4 pl-9">
                  <h5 className="font-medium text-black">{packageItem.name}</h5>
                  {packageItem.image && (
                    <img
                      src={packageItem.image}
                      alt={packageItem.name}
                      className="w-16 h-16 object-cover mt-2 rounded-md"
                    />
                  )}
                </td>

                {/* Kolom Stok (Total Stock) */}
                <td className="border-b border-[#eee] py-5 px-4">
                  {packageItem.stock?.toLocaleString("id-ID") || 0}
                </td>

                {/* Kolom Status */}
                <td className="border-b border-[#eee] py-5 px-4">
                  <p
                    className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
                      packageItem.statusColor || ""
                    }`}
                  >
                    {packageItem.status}
                  </p>
                </td>

                <td className="border-b border-[#eee] py-5 px-4">
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => handleViewDetails(packageItem)}
                      className="text-[#003D47] cursor-pointer hover:underline"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditClick(packageItem._id)}
                      className="text-[#003D47] cursor-pointer hover:underline"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(packageItem)}
                      className="text-[#003D47] cursor-pointer hover:underline"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && selectedItem && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          item={selectedItem}
        />
      )}
      {isViewOpen && selectedItem && (
        <ModalView
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default TableMeneProduk;
