import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import styles from "./Signup.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "law_enforcement",
  });
  const [error, setError] = useState("");

  const passwordsMatch =
    formData.password && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const submitData = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
      };
      await api.post("/api/auth/signup", submitData);
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles["signup-container"]}>
      <div className={styles["background-image"]}></div>
      <div className={styles["background-overlay"]}></div>
      <h1 className={styles["system-title"]}>Evidence Management System</h1>
      <div className={styles["signup-form"]}>
        <h2 className={styles["signup-title"]}>Sign Up</h2>
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
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles["password-input-container"]}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter your password again"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className={styles["toggle-password"]}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.confirmPassword && (
              <p
                className={`${styles["password-validation-message"]} ${
                  passwordsMatch ? styles["success"] : styles["error"]
                }`}
              >
                {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
              </p>
            )}
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="law_enforcement">Law Enforcement</option>
              <option value="legal_personnel">Legal Personnel</option>
            </select>
          </div>

          <button
            type="submit"
            className={`${styles["submit-button"]} ${
              isLoading ? styles["loading"] : ""
            } ${!passwordsMatch ? styles["disabled"] : ""}`}
            disabled={isLoading || !passwordsMatch}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          {error && <p className={styles["error-message"]}>{error}</p>}
        </form>

        <div className={styles["login-link"]}>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
