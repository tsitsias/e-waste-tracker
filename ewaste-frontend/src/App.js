import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Dashboard from './components/Dashboard';
import contractABI from './contract/EwasteTracking.json';

const CONTRACT_ADDRESS = "0x97F84C6b09b9f1fede0E5e05906aFa94450aafD7";

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const roles = {
    0: 'None',
    1: 'Admin', 
    2: 'User',
    3: 'GreenPoint',
    4: 'Transporter',
    5: 'Recycler',
    6: 'Auditor'
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
        
        setProvider(provider);
        setAccount(address);
        setContract(contract);
        setIsConnected(true);
        
        // Get user role
        try {
          const roleNumber = await contract.getUserRole(address);
          const roleName = roles[Number(roleNumber)] || 'None';
          setUserRole(roleName);
        } catch (error) {
          console.log("User not registered or error getting role:", error);
          setUserRole('Unregistered');
        }
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>E-Waste Tracking System</h1>
        {!isConnected ? (
          <div className="connect-section">
            <h2>Please connect your wallet to continue</h2>
            <button onClick={connectWallet} className="connect-btn">
              Connect MetaMask
            </button>
          </div>
        ) : (
          <div className="wallet-info">
            <p><strong>Connected Account:</strong> {account}</p>
            <p><strong>Role:</strong> {userRole}</p>
          </div>
        )}
      </header>
      
      {isConnected && (
        <Dashboard 
          contract={contract} 
          account={account} 
          userRole={userRole}
          setUserRole={setUserRole}
        />
      )}
    </div>
  );
}

export default App; 