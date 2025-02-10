import React, { useState } from "react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../modal/modalDelete";

const TableUserList = ({ data, rowsPerPage, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get data for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const handleDeleteClick = (item) => {
      setSelectedItem(item);
      setIsModalOpen(true);
    }
    
    const confirmDelete = () => {
      onDelete(selectedItem);
      setIsModalOpen(false);
    }

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleView = (item) => {
    // Navigate to the ViewPage with the selected user's details
    navigate("/view", { state: { user: item } });
  };

  const handleEdit = (item) => {
    onEdit(item);
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">NAMA</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">NO HP</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">
                TANGGAL REGISTRASI
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-t`}
              >
                <td className="px-6 py-4">
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
                <td className="px-6 py-4">{item.phone}</td>
                <td className="px-6 py-4">{item.registeredDate}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleView(item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="text-red-500 hover:text-red-700"
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

      {isModalOpen && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          itemName={selectedItem?.name}
        />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium"
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
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {pageIndex + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableUserList;
