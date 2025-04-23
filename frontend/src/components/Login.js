import React, { useState } from "react";
import api from "../utils/axios";
import styles from "./Login.module.css";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "./LoadingPage";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "admin",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);

      const roleRoutes = {
        admin: "/admin/dashboard",
        law_enforcement: "/law-enforcement/dashboard",
        legal_personnel: "/legal/dashboard",
      };

      toast.success("Login Successful! Welcome Back", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#4CAF50",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "8px",
          textAlign: "center",
        },
      });

      setTimeout(() => {
        navigate(roleRoutes[formData.role] || "/dashboard");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Invalid credentials. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "8px",
          textAlign: "center",
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className={styles["login-container"]}>
          <div className={styles["background-image"]}></div>
          <div className={styles["background-overlay"]}></div>
          <h1 className={styles["system-title"]}>Evidence Management System</h1>
          <div className={styles["login-form"]}>
            <h2 className={styles["login-title"]}>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles["form-group"]}>
                <label htmlFor="username">Username</label>
                <div className={styles["username-input-container"]}>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles["form-group"]}>
                <label htmlFor="password">Password</label>
                <div className={styles["password-input-container"]}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles["toggle-password"]}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className={styles["form-group"]}>
                <label htmlFor="role">Select Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="admin">Admin</option>
                  <option value="law_enforcement">Law Enforcement</option>
                  <option value="legal_personnel">Legal Personnel</option>
                </select>
              </div>

              <button
                type="submit"
                className={`${styles["submit-button"]} ${
                  isLoading ? styles.loading : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className={styles["signup-link"]}>
              <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
