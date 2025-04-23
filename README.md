# 🔐 Evidence Management System (Blockchain + IPFS)

A decentralized web application that allows authorized users to upload and retrieve digital evidence. Files are stored on IPFS via Pinata, and their references are recorded on a local Ethereum blockchain powered by Ganache.

## 🧰 Features

- Upload evidence files to IPFS with an associated identifier.
- Retrieve files using their identifier.
- Record file metadata and transaction hash on Ethereum (Ganache).
- Frontend built with React.
- Smart contracts written and managed with Truffle.
- Interact with contracts using MetaMask and Web3.js.

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Ganache](https://trufflesuite.com/ganache/) (GUI or CLI)
- [Truffle](https://trufflesuite.com/truffle/)
- [MetaMask](https://metamask.io/) browser extension
- [IPFS Pinata](https://pinata.cloud/) account with API key & secret

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/evidence-management-system.git
cd evidence-management-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root directory:

```env
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_API_KEY=your_pinata_secret_api_key
REACT_APP_CONTRACT_ADDRESS=your_smart_contract_address (optional if set dynamically)
```

> ⚠️ Never commit your `.env` file to GitHub.

---

## 🔨 Running the Project

### Step 1: Start Ganache
- Open Ganache.
- Start a new workspace or quickstart Ethereum chain.
- Copy the RPC URL (usually `http://127.0.0.1:7545`).

### Step 2: Compile and Deploy Contracts
```bash
truffle compile
truffle migrate --network development
```

### Step 3: Import accounts into MetaMask
- Add Ganache test accounts to MetaMask.
- Set MetaMask to the "Localhost 7545" network.

### Step 4: Start the React app
```bash
npm start
```

---

## 📂 Project Structure

```
evidence-management-system/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── utils/       # Web3, IPFS helpers
│   │   └── App.js
├── contracts/           # Solidity smart contracts
│   └── Evidence.sol
├── migrations/          # Truffle migration scripts
├── build/               # Compiled contract artifacts
├── .env                 # Environment variables
├── truffle-config.js    # Truffle configuration
├── package.json
└── README.md
```

---

## 🚀 Technologies Used

- **React.js** – Frontend framework
- **Solidity** – Smart contract language
- **Truffle** – Smart contract management
- **Web3.js** – Blockchain interaction
- **Ganache** – Local Ethereum blockchain
- **IPFS (via Pinata)** – Decentralized file storage
- **MetaMask** – Web3 wallet for signing transactions

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🙌 Acknowledgments

- [Ethereum](https://ethereum.org/)
- [Truffle Suite](https://trufflesuite.com/)
- [IPFS](https://ipfs.tech/)
- [Pinata](https://pinata.cloud/)
- [MetaMask](https://metamask.io/)
