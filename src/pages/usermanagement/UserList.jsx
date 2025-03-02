import React from "react";
import TableUserList from "../../components/tables/TableUserList";
import Breadcrumb from '../../breadcrumb/breadcrumb';
import { useNavigate } from 'react-router';
import customers from "../../dummyData/customers";

const UserList = () => {
  const navigate = useNavigate();

  const handleEdit = (user) => {
    // navigate("/view/edit", { state: { user } });
    navigate("/edit", { state: { user } });

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
      <h1 className="text-2xl font-bold">Customer List</h1>
      <TableUserList
        data={customers}
        rowsPerPage={5}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserList;