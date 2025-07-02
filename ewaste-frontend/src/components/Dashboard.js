import React, { useState, useEffect } from 'react';
import AddDevice from './AddDevice';
import DeviceList from './DeviceList';
import CollectDevice from './CollectDevice';
import TransferDevice from './TransferDevice';
import ProcessDevice from './ProcessDevice';

const Dashboard = ({ contract, account, userRole, setUserRole }) => {
  const [activeTab, setActiveTab] = useState('devices');
  const [devices, setDevices] = useState([]);

  const roles = {
    0: 'None',
    1: 'Admin', 
    2: 'User',
    3: 'GreenPoint',
    4: 'Transporter',
    5: 'Recycler',
    6: 'Auditor'
  };

  // Register user with a role
  const registerUser = async (role) => {
    try {
      const tx = await contract.registerUser(account, role);
      await tx.wait();
      setUserRole(roles[role]);
      alert(`Successfully registered as ${roles[role]}`);
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user');
    }
  };

  // Refresh devices list
  const refreshDevices = async () => {
    try {
      const deviceCount = await contract.getDeviceCount();
      const devicesList = [];
      
      for (let i = 1; i <= deviceCount; i++) {
        try {
          const device = await contract.getDevice(i);
          devicesList.push({
            id: i,
            deviceType: device[0],
            brand: device[1],
            model: device[2],
            dangerLevel: device[3],
            status: device[4],
            owner: device[5],
            greenPoint: device[6],
            transporter: device[7],
            recycler: device[8],
            timestamp: new Date(Number(device[9]) * 1000).toLocaleString()
          });
        } catch (error) {
          console.log(`Error fetching device ${i}:`, error);
        }
      }
      
      setDevices(devicesList);
    } catch (error) {
      console.error('Error refreshing devices:', error);
    }
  };

  useEffect(() => {
    if (contract) {
      refreshDevices();
    }
  }, [contract]);

  if (userRole === 'Unregistered' || userRole === 'None') {
    return (
      <div className="dashboard">
        <h2>Register to use the E-Waste Tracking System</h2>
        <div className="registration-buttons">
          <button onClick={() => registerUser(1)}>Register as Admin</button>
          <button onClick={() => registerUser(2)}>Register as User</button>
          <button onClick={() => registerUser(3)}>Register as GreenPoint</button>
          <button onClick={() => registerUser(4)}>Register as Transporter</button>
          <button onClick={() => registerUser(5)}>Register as Recycler</button>
          <button onClick={() => registerUser(6)}>Register as Auditor</button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'add':
        return <AddDevice contract={contract} account={account} onDeviceAdded={refreshDevices} />;
      case 'collect':
        return <CollectDevice contract={contract} account={account} onDeviceCollected={refreshDevices} />;
      case 'transfer':
        return <TransferDevice contract={contract} account={account} onDeviceTransferred={refreshDevices} />;
      case 'process':
        return <ProcessDevice contract={contract} account={account} onDeviceProcessed={refreshDevices} />;
      case 'devices':
      default:
        return <DeviceList devices={devices} onRefresh={refreshDevices} />;
    }
  };

  const getAvailableTabs = () => {
    const baseTabs = [{ key: 'devices', label: 'View Devices' }];
    
    switch (userRole) {
      case 'Admin':
        return [
          ...baseTabs,
          { key: 'add', label: 'Add Device' },
          { key: 'collect', label: 'Collect Device' },
          { key: 'transfer', label: 'Transfer Device' },
          { key: 'process', label: 'Process Device' }
        ];
      case 'User':
        return [
          ...baseTabs,
          { key: 'add', label: 'Add Device' }
        ];
      case 'GreenPoint':
        return [
          ...baseTabs,
          { key: 'collect', label: 'Collect Device' }
        ];
      case 'Transporter':
        return [
          ...baseTabs,
          { key: 'transfer', label: 'Transfer Device' }
        ];
      case 'Recycler':
        return [
          ...baseTabs,
          { key: 'process', label: 'Process Device' }
        ];
      case 'Auditor':
        return baseTabs;
      default:
        return baseTabs;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard - {userRole}</h2>
        <button onClick={refreshDevices} className="refresh-btn">
          Refresh Data
        </button>
      </div>
      
      <div className="tabs">
        {getAvailableTabs().map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard; 