import React from "react";
import styles from "./LoadingPage.module.css";

const LoadingPage = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.content}>
        <div className={styles.logo}>EMS</div>
        <div className={styles.spinnerContainer}>
          {/* <div className={styles.spinner}></div> */}
          <div className={styles.spinnerInner}></div>
        </div>
        <h2 className={styles.title}>Evidence Management System</h2>
        <div className={styles.progressBar}>
          <div className={styles.progress}></div>
        </div>
        <p className={styles.message}>Preparing your dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
