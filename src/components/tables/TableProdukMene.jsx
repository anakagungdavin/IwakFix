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

        if (!response?.products || !Array.isArray(response.products)) {
          throw new Error(
            "Data produk tidak ditemukan atau respons tidak valid"
          );
        }

        const formattedProducts = response.products.map((item) => {
          const totalStock = Array.isArray(item.stocks)
            ? item.stocks.reduce((sum, stock) => sum + (stock.stock || 0), 0)
            : 0;

          const statusData = getStatus(totalStock, item.isPublished);
          return {
            ...item,
            stock: totalStock,
            status: statusData.label,
            statusColor: statusData.jenis,
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
    // Perubahan: Latar belakang, border, dan warna teks kontainer
    <div className="rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            {/* Perubahan: Ganti inline style dengan class Tailwind untuk header */}
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              {/* Perubahan: Warna teks header */}
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-gray-200">
                Produk
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-gray-200">
                Stok
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-gray-200">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((packageItem, key) => (
              <tr key={key}>
                {/* Perubahan: Border dan warna teks pada sel */}
                <td className="border-b border-gray-200 dark:border-gray-700 py-5 px-4 pl-9">
                  <h5 className="font-medium text-black dark:text-white">
                    {packageItem.name}
                  </h5>
                  {packageItem.image && (
                    <img
                      src={packageItem.image}
                      alt={packageItem.name}
                      className="w-16 h-16 object-cover mt-2 rounded-md"
                    />
                  )}
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 py-5 px-4 text-black dark:text-gray-300">
                  {packageItem.stock?.toLocaleString("id-ID") || 0}
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 py-5 px-4">
                  <p
                    className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
                      packageItem.statusColor || ""
                    }`}
                  >
                    {packageItem.status}
                  </p>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 py-5 px-4">
                  <div className="flex items-center space-x-3.5">
                    {/* Perubahan: Warna ikon pada dark mode */}
                    <button
                      onClick={() => handleViewDetails(packageItem)}
                      className="text-[#003D47] dark:text-yellow-400 cursor-pointer hover:underline"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditClick(packageItem._id)}
                      className="text-[#003D47] dark:text-yellow-400 cursor-pointer hover:underline"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(packageItem)}
                      className="text-[#003D47] dark:text-yellow-400 cursor-pointer hover:underline"
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
