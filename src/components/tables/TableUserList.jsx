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

  // Sort icon component similar to TableHistory
  const SortIcon = ({ isActive, direction }) => {
    if (!isActive) return <span className="ml-1 text-gray-300">↕</span>;
    return direction === "asc" ? (
      <span className="ml-1 text-gray-600">↑</span>
    ) : (
      <span className="ml-1 text-gray-600">↓</span>
    );
  };

  return (
    <div className="overflow-x-auto p-6">
      <table className="w-full border-collapse text-left text-gray-700">
        <thead>
          <tr className="border-b border-gray-300 text-gray-500 text-sm">
            <th
              className="p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => onSortChange("name")}
            >
              NAMA
              <SortIcon isActive={sortField === "name"} direction={sortOrder} />
            </th>
            <th className="p-4">NO HP</th>
            <th
              className="p-4 cursor-pointer hover:bg-gray-100"
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
              <td colSpan="4" className="p-4 text-center text-gray-500">
                Tidak ada data pengguna
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item._id || index}
                className="border-b border-gray-200 text-sm hover:bg-gray-50"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-500 font-semibold">
                        {item.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.email}</p>
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
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onView(item)}
                      className="text-[#003D47] cursor-pointer hover:underline"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="text-[#003D47] cursor-pointer hover:underline"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="text-[#003D47] cursor-pointer hover:underline"
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

      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium disabled:opacity-50"
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
                ? "bg-gray-100 text-gray-700 font-bold"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {pageIndex + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableUserList;