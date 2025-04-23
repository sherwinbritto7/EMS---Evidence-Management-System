import React, { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import api from "../utils/axios";
import styles from "./LegalPersonnelDashboard.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PINATA_GATEWAY_URL } from "../config/pinataConfig";

const LegalPersonnelDashboard = () => {
  const [caseNumber, setCaseNumber] = useState("");
  const [evidences, setEvidences] = useState([]);
  const [allEvidences, setAllEvidences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCases();
  }, []);

  const fetchAllCases = async () => {
    try {
      const response = await api.get("/api/evidence/cases");
      setAllEvidences(response.data);
      setEvidences(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cases:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!caseNumber.trim()) {
      setEvidences(allEvidences);
      return;
    }
    const filtered = allEvidences.filter((evidence) =>
      evidence.caseNumber.toLowerCase().includes(caseNumber.toLowerCase())
    );
    setEvidences(filtered);
  };

  const handleDownload = async (ipfsHash, fileName) => {
    try {
      const response = await fetch(`${PINATA_GATEWAY_URL}/${ipfsHash}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || `evidence-${ipfsHash}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Evidence downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download evidence");
      console.error("Download error:", error);
    }
  };

  const handleDelete = async (caseNumber) => {
    try {
      await api.delete(`/api/evidence/delete/${caseNumber}`);
      setEvidences((currentEvidences) =>
        currentEvidences.filter((item) => item.caseNumber !== caseNumber)
      );
      setAllEvidences((currentEvidences) =>
        currentEvidences.filter((item) => item.caseNumber !== caseNumber)
      );
      toast.success("Evidence deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete evidence");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.innerContainer}>
        <ToastContainer position="top-right" autoClose={3000} />
        <LogoutButton />
        <div className={styles.header}>
          <h1>Legal Personnel Dashboard</h1>
        </div>
        <div className={styles.searchSection}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter Case Number"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
            />
            <button type="submit">Search Evidence</button>
          </form>
        </div>
        <div className={styles.evidenceList}>
          {loading ? (
            <div className={styles.loading}>Loading cases...</div>
          ) : evidences.length > 0 ? (
            evidences.map((item) => (
              <div key={item._id} className={styles.evidenceCard}>
                <h3>Case: {item.caseNumber}</h3>
                <p>{item.description}</p>
                <p>Uploaded: {new Date(item.date).toLocaleDateString()}</p>
                <div className={styles.evidenceActions}>
                  <button
                    onClick={() => handleDownload(item.ipfsHash, item.fileName)}
                  >
                    Download Evidence
                  </button>
                  <button onClick={() => handleDelete(item.caseNumber)}>
                    Delete Evidence
                  </button>
                  <a
                    href={`${PINATA_GATEWAY_URL}/${item.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on IPFS
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <h3>No cases found</h3>
              <p>Try searching with a different case number</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPersonnelDashboard;
