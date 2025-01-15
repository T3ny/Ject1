import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [blockchainData, setBlockchainData] = useState([]);
  const [message, setMessage] = useState('');
  const [walletBalance, setWalletBalance] = useState({ balance: 0, usdValue: 0 });
  const [transactionData, setTransactionData] = useState({
    sender: '',
    recipient: '',
    amount: '',
  });
  const [miningInProgress, setMiningInProgress] = useState(false);  // it will track the mining status(set to false||true)

  // Fetches blockchain data from the backend(verinet.js)
  const fetchBlockchainData = async () => {
    try {
      const response = await fetch('http://localhost:3001/blockchain', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blockchain data');
      }

      const data = await response.json();
      setBlockchainData(data.chain || []);
      setMessage('Blockchain data fetched successfully.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Fetches wallet data(not necessary)
  const fetchWalletData = async () => {
    setWalletBalance({
      balance: 2.5,
      usdValue: 75000,
    });
  };

  // Handle new transaction
  const handleTransaction = async () => {
    try {
      const response = await fetch('http://localhost:3001/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Transaction failed');
      }

      const data = await response.json();
      setMessage(data.note || 'Transaction successful');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Handle block mining
  const handleMineBlock = async () => {
    setMiningInProgress(true);
    setMessage('Mining in progress...');

    try {
      const response = await fetch('http://localhost:3001/mine', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Mining failed');
      }

      const data = await response.json();
      setMessage(data.note || 'Mining successful');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setMiningInProgress(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
    fetchWalletData();
  }, []);

  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        Ncoin Blockchain
      </div>

      {/* Content Section */}
      <div className="content">
        {/* Wallet Section */}
        <div className="card wallet">
          <h3>Cryptocurrency Wallet</h3>
          <div className="balance">
            <p><strong>Balance:</strong> {walletBalance.balance} Ncoin</p>
            <p><strong>USD Value:</strong> ${walletBalance.usdValue}</p>
          </div>
        </div>

        {/* Transaction Section */}
        <div className="card transaction">
          <h3>Transaction Details</h3>
          <div className="transaction-form">
            <input
              type="text"
              placeholder="Sender Address"
              value={transactionData.sender}
              onChange={(e) => setTransactionData({ ...transactionData, sender: e.target.value })}
            />
            <input
              type="text"
              placeholder="Recipient Address"
              value={transactionData.recipient}
              onChange={(e) => setTransactionData({ ...transactionData, recipient: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transactionData.amount}
              onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
            />
            <button onClick={handleTransaction}>Send Transaction</button>
          </div>
        </div>

        {/* Mining Section */}
        <div className="card mining">
          <h3>Mining Management</h3>
          <button onClick={handleMineBlock} disabled={miningInProgress}>
            {miningInProgress ? 'Mining...' : 'Mine Block'}
          </button>
        </div>

        {/* Blockchain Data */}
        <div className="card">
          <h3>Blockchain Data</h3>
          <div className="blockchain-data" id="blockchainData">
            {blockchainData.length > 0 ? (
              <ul>
                {blockchainData.map((block, index) => (
                  <li key={index}>
                    <p>Block Index: {block.index}</p>
                    <p>Hash: {block.hash}</p>
                    <p>Previous Hash: {block.previousHash}</p>
                    <p>Transactions: {JSON.stringify(block.transactions)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No blockchain data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div className="message">
        <p>{message}</p>
      </div>

      {/* Footer Section */}
      <div className="footer">
        &copy; 2025 Mining Dashboard & Wallet. All Rights Reserved.
      </div>
    </div>
  );
}

export default App;
