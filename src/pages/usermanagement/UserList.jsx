import React, { useState, useEffect } from "react";
import axios from "axios";
import TableUserList from "../../components/tables/TableUserList";
import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  const fetchData = async (pageNum, sortBy, order) => {
    setLoading(true);
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await axios.get(`${apiUrl}/api/users/customers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: pageNum,
          limit: 5,
          sortBy,
          sortOrder: order,
        },
      });
      console.log("Fetched customers:", response.data.data);
      const { data, totalPages } = response.data;
      if (!Array.isArray(data)) {
        throw new Error("Data dari API bukan array");
      }
      setCustomers(data);
      setTotalPages(totalPages || 1);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Gagal mengambil data"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, sortField, sortOrder);
  }, [page, sortField, sortOrder]);

  const handleEdit = (user) => {
    navigate(`/customers/edit/${user._id}`, { state: { user } });
  };

  const handleView = (user) => {
    console.log("Viewing user with ID:", user._id);
    const url = `/customers/view/${user._id}`;
    console.log("Navigating to:", url);
    navigate(url, { state: { user }, replace: true });
    setTimeout(() => {
      console.log("Current URL after navigate:", window.location.pathname);
    }, 100);
  };

  const handleDelete = async (user) => {
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      await axios.delete(`${apiUrl}/api/users/customers/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchData(page, sortField, sortOrder);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Gagal menghapus data"
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSortChange = (field) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  // Perubahan: Styling untuk state loading di dark mode
  if (loading)
    return (
      <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        Loading...
      </div>
    );
  // Perubahan: Styling untuk state error di dark mode
  if (error)
    return (
      <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-red-500 dark:text-red-400">
        Error: {error}
      </div>
    );

  return (
    // Perubahan: Latar belakang utama dan warna teks
    <div className="p-6 space-y-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Breadcrumb pageName="User List" />
      <h1 className="text-2xl font-bold text-black dark:text-white">
        Customer List
      </h1>
      {customers.length === 0 ? (
        // Perubahan: Warna teks untuk pesan "tidak ada data"
        <p className="text-gray-500 dark:text-gray-400">
          Tidak ada data customer tersedia.
        </p>
      ) : (
        <TableUserList
          data={customers}
          rowsPerPage={5}
          currentPage={page}
          totalPages={totalPages}
          sortField={sortField}
          sortOrder={sortOrder}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
    </div>
  );
};

export default UserList;
