import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => {
  return (
    <nav className="admin-nav">
      <ul>
        <li>
          <Link to="/admin/dashboard">User Approval</Link>
        </li>
        <li>
          <Link to="/admin/users">User Management</Link>
        </li>
        <li>
          <Link to="/admin/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
