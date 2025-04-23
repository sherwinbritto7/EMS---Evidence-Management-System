/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import api from "../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./LawEnforcementDashboard.module.css";
import { PINATA_API_KEY, PINATA_SECRET_KEY } from "../config/pinataConfig";
import axios from "axios";
import Web3 from "web3";
import CaseManagement from "../contracts/CaseManagement.json";

const LawEnforcementDashboard = () => {
  const [evidence, setEvidence] = useState({
    caseNumber: "",
    description: "",
    file: null,
    date: new Date().toISOString().split("T")[0],
  });
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    initWeb3();
  }, []);

  useEffect(() => {
    if (contract) {
      loadTransactions();
    }
  }, [contract]);

  const initWeb3 = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = CaseManagement.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          CaseManagement.abi,
          deployedNetwork.address
        );

        setWeb3(web3Instance);
        setContract(contractInstance);
        setAccount(accounts[0]);
      } catch (error) {
        toast.error("Please connect to MetaMask");
      }
    } else {
      toast.error("Please install MetaMask");
    }
  };

  const loadTransactions = async () => {
    const count = await contract.methods.getTransactionCount().call();
    const txList = [];

    for (let i = 0; i < count; i++) {
      const tx = await contract.methods.getTransaction(i).call();
      txList.push({
        caseNumber: tx[0],
        sender: tx[1],
        receiver: tx[2],
        fileHash: tx[3],
      });
    }

    setTransactions(txList);
  };
  const handleHashClick = (hash) => {
    window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, "_blank");
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEvidence({ ...evidence, file });
    toast.info(`Selected file: ${file.name}`);
  };
  const formatAddress = (address) => {
    return (
      <div className={styles["address-container"]}>
        <span className={styles["address-text"]}>{address}</span>
        <button
          className={styles["copy-button"]}
          onClick={() => {
            navigator.clipboard.writeText(address);
            toast.success("Address copied!");
          }}
        >
          Copy
        </button>
      </div>
    );
  };
  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    return response.data.IpfsHash;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ipfsHash = await uploadToPinata(evidence.file);

      await contract.methods
        .addCase(evidence.caseNumber, ipfsHash)
        .send({ from: account });

      await contract.methods
        .addTransaction(
          evidence.caseNumber,
          "0x0000000000000000000000000000000000000000",
          ipfsHash
        )
        .send({ from: account });

      const formData = new FormData();
      formData.append("file", evidence.file);
      formData.append("caseNumber", evidence.caseNumber);
      formData.append("description", evidence.description);
      formData.append("date", evidence.date);
      formData.append("ipfsHash", ipfsHash);
      formData.append("fileName", evidence.file.name);

      await api.post("/api/evidence/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(`Evidence uploaded successfully! IPFS Hash: ${ipfsHash}`);
      loadTransactions();

      setEvidence({
        caseNumber: "",
        description: "",
        file: null,
        date: new Date().toISOString().split("T")[0],
      });
      document.querySelector('input[type="file"]').value = "";
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles.innerContainer}>
        {" "}
        <ToastContainer />
        <LogoutButton />
        <div className={styles.header}>
          <h1 className={styles["dashboard-title"]}>
            Law Enforcement Dashboard
          </h1>
          <p className={styles["wallet-address"]}>
            Connected Wallet: {account}
          </p>
        </div>
        <div className={styles["content-section"]}>
          <h2>Upload Evidence</h2>
          <form onSubmit={handleSubmit} className={styles["evidence-form"]}>
            <div className={styles["form-group"]}>
              <input
                type="text"
                placeholder="Case Number"
                value={evidence.caseNumber}
                onChange={(e) =>
                  setEvidence({ ...evidence, caseNumber: e.target.value })
                }
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <textarea
                placeholder="Evidence Description"
                value={evidence.description}
                onChange={(e) =>
                  setEvidence({ ...evidence, description: e.target.value })
                }
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <input type="file" onChange={handleFileChange} required />
            </div>
            <button type="submit" className={styles["submit-button"]}>
              Upload Evidence
            </button>
          </form>
        </div>
        <div className={styles["transaction-section"]}>
          <h2>Transaction History</h2>
          <div className={styles["transaction-list"]}>
            <table>
              <thead>
                <tr>
                  <th>Case Number</th>
                  <th>Sender</th>

                  <th>File Hash</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.caseNumber}</td>
                    <td>{formatAddress(tx.sender)}</td>

                    <td>
                      <span
                        className={styles["hash-link"]}
                        onClick={() => handleHashClick(tx.fileHash)}
                      >
                        File Hash
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawEnforcementDashboard;
