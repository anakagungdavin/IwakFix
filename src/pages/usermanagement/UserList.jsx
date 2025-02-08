import React from "react";
import TableUserList from "../../components/tables/TableUserList";
import Breadcrumb from '../../breadcrumb/breadcrumb';
import { useNavigate } from 'react-router';

const UserList = () => {
  const navigate = useNavigate();
  const data = Array.from({ length: 50 }, (_, index) => ({
    name: `Robert Fox ${index + 1}`,
    email: `robert${index + 1}@gmail.com`,
    phone: `(201) 555-0124`,
    date: `6 April 2023`,
  }));

  const handleEdit = (item) => {
    alert(`Editing: ${item.name}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting: ${item.name}`);
  };

  const handleView = (item) => {
    alert(`Viewing: ${item.name}`);
  };

  return (
    <div className="p-6 space-y-4">
    <Breadcrumb pageName="User List" />
      <h1 className="text-2xl font-bold">User List with Pagination</h1>
      <TableUserList
        data={data}
        rowsPerPage={5}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserList;
