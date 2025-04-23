import React, { useState } from "react";
import axios from "axios";
import "./CreateAdmin.css";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/create-admin", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormData({ username: "", password: "" });
      alert("Admin created successfully");
    } catch (error) {
      alert("Error creating admin account");
    }
  };

  return (
    <div className="create-admin">
      <h2>Create New Admin Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
};

export default CreateAdmin;
