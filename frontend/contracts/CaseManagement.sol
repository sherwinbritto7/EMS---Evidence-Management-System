// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CaseManagement {
    struct Transaction {
        string caseNumber;
        address sender;
        address receiver;
        string fileHash;
    }

    mapping(string => string) public caseFileHash;
    Transaction[] public transactions;

    event CaseAdded(string caseNumber, string fileHash);
    event TransactionAdded(string caseNumber, address sender, address receiver, string fileHash);

    function addCase(string memory _caseNumber, string memory _fileHash) public {
        caseFileHash[_caseNumber] = _fileHash;
        emit CaseAdded(_caseNumber, _fileHash);
    }

    function addTransaction(string memory _caseNumber, address _receiver, string memory _fileHash) public {
        transactions.push(Transaction(_caseNumber, msg.sender, _receiver, _fileHash));
        emit TransactionAdded(_caseNumber, msg.sender, _receiver, _fileHash);
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(uint index) public view returns (string memory, address, address, string memory) {
        require(index < transactions.length, "Transaction index out of bounds");
        Transaction memory txn = transactions[index];
        return (txn.caseNumber, txn.sender, txn.receiver, txn.fileHash);
    }
}
