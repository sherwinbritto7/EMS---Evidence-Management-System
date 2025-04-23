import React, { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import api from "../utils/axios";
import styles from "./AdminDashboard.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [allUsers, setAllUsers] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get("/api/admin/pending-users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPendingUsers(response.data);
    } catch (error) {
      console.log("Error fetching pending users:", error);
      toast.error("Failed to fetch pending users");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get("/api/admin/all-users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const nonAdminUsers = response.data.filter(
        (user) => user.role !== "admin"
      );
      setAllUsers(nonAdminUsers);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await api.get("/api/admin/users/count", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTotalUsers(response.data.total);
    } catch (error) {
      toast.error("Failed to fetch total users count");
    }
  };

  // Optimized function to fetch all user data in parallel
  const refreshUserData = async () => {
    await Promise.all([
      fetchTotalUsers(),
      fetchPendingUsers(),
      fetchAllUsers(),
    ]);
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(
        `/api/admin/approve-user/${userId}`,
        { status: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("User approved successfully!");
      refreshUserData();
    } catch (error) {
      toast.error("Error approving user");
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.put(
        `/api/admin/approve-user/${userId}`,
        { status: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("User rejected and removed from system");
      refreshUserData();
    } catch (error) {
      toast.error("Error rejecting user");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("User deleted successfully");
      refreshUserData();
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.innerContainer}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <LogoutButton />
        <div className={styles.header}>
          <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Pending Approvals</div>
            <div className={styles.statValue}>{pendingUsers.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Total Users</div>
            <div className={styles.statValue}>{totalUsers}</div>
          </div>
        </div>

        <div className={styles.contentSection}>
          <h2>User Management</h2>
          <div className={styles.userList}>
            {pendingUsers.map((user) => (
              <div key={user._id} className={styles.userCard}>
                <div className={styles.userInfo}>
                  <span className={styles.username}>{user.username}</span>
                  <span className={styles.userRole}>{user.role}</span>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.actionButton} ${styles.primaryButton}`}
                    onClick={() => handleApprove(user._id)}
                  >
                    Approve
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.secondaryButton}`}
                    onClick={() => handleReject(user._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.contentSection}>
          <h2>All Users</h2>
          <div className={styles.userList}>
            {allUsers.map((user) => (
              <div key={user._id} className={styles.userCard}>
                <div className={styles.userInfo}>
                  <span className={styles.username}>{user.username}</span>
                  <span className={styles.userRole}>{user.role}</span>
                  <span className={styles.userStatus}>
                    {user.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <button
                  className={`${styles.actionButton} ${styles.secondaryButton}`}
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
