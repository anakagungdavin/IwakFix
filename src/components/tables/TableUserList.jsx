import React, { useState } from "react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import DeleteModal from "../modal/modalDelete";

const TableUserList = ({
  data = [],
  rowsPerPage = 5,
  currentPage = 1,
  totalPages = 1,
  sortField,
  sortOrder,
  onPageChange,
  onSortChange,
  onEdit,
  onDelete,
  onView,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    onDelete(selectedItem);
    setIsModalOpen(false);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Perubahan: Menambahkan warna untuk dark mode pada ikon sort
  const SortIcon = ({ isActive, direction }) => {
    if (!isActive)
      return <span className="ml-1 text-gray-300 dark:text-gray-600">↕</span>;
    return direction === "asc" ? (
      <span className="ml-1 text-gray-600 dark:text-gray-300">↑</span>
    ) : (
      <span className="ml-1 text-gray-600 dark:text-gray-300">↓</span>
    );
  };

  return (
    // Perubahan: Menambahkan background, border, dan shadow pada kontainer utama
    <div className="overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse text-left text-gray-700 dark:text-gray-300">
        <thead>
          {/* Perubahan: Warna border dan teks header */}
          <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
            <th
              className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onSortChange("name")}
            >
              NAMA
              <SortIcon isActive={sortField === "name"} direction={sortOrder} />
            </th>
            <th className="p-4">NO HP</th>
            <th
              className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onSortChange("registrationDate")}
            >
              TANGGAL REGISTRASI
              <SortIcon
                isActive={sortField === "registrationDate"}
                direction={sortOrder}
              />
            </th>
            <th className="p-4">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="p-4 text-center text-gray-500 dark:text-gray-400"
              >
                Tidak ada data pengguna
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item._id || index}
                // Perubahan: Warna border dan hover pada baris tabel
                className="border-b border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* Perubahan: Warna avatar untuk dark mode */}
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <span className="text-blue-500 dark:text-blue-300 font-semibold">
                        {item.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-black dark:text-white">
                        {item.name}
                      </p>
                      {/* Perubahan: Warna teks email */}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">{item.phoneNumber}</td>
                <td className="p-4">
                  {new Date(item.registrationDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4">
                  {/* Perubahan: Warna ikon action untuk dark mode */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onView(item)}
                      className="text-[#003D47] dark:text-yellow-400 cursor-pointer hover:underline"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="text-[#003D47] dark:text-yellow-400 cursor-pointer hover:underline"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="text-[#003D47] dark:text-yellow-400 cursor-pointer hover:underline"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          itemName={selectedItem?.name}
        />
      )}

      {/* Perubahan: Styling paginasi untuk dark mode */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <button
            key={pageIndex}
            onClick={() => handlePageChange(pageIndex + 1)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === pageIndex + 1
                ? "bg-blue-600 text-white font-bold"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {pageIndex + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableUserList;
