import React, { useState, useEffect } from 'react';
import AddDevice from './AddDevice';
import DeviceList from './DeviceList';
import CollectDevice from './CollectDevice';
import TransferDevice from './TransferDevice';
import ProcessDevice from './ProcessDevice';

const Dashboard = ({ contract, account, userRole, setUserRole }) => {
  const [activeTab, setActiveTab] = useState('devices');
  const [devices, setDevices] = useState([]);
  const [registerAddress, setRegisterAddress] = useState('');
  const [registerRole, setRegisterRole] = useState('2');

  const roles = {
    0: 'None',
    1: 'Admin',
    2: 'User',
    3: 'GreenPoint',
    4: 'Transporter',
    5: 'Recycler',
    6: 'Auditor'
  };

  // Εγγραφή χρήστη από Admin
  const registerUserByAdmin = async () => {
    if (!registerAddress) {
      alert('Please enter an address');
      return;
    }
    
    try {
      const tx = await contract.registerUser(registerAddress, parseInt(registerRole));
      await tx.wait();
      alert(`Successfully registered ${registerAddress} as ${roles[registerRole]}`);
      setRegisterAddress('');
    } catch (error) {
      console.error('Σφάλμα εγγραφής χρήστη:', error);
      alert('Error registering user');
    }
  };

  // Αυτο-εγγραφή χρήστη
  const registerUser = async (role) => {
    try {
      const tx = await contract.registerUser(account, role);
      await tx.wait();
      setUserRole(roles[role]);
      alert(`Successfully registered as ${roles[role]}`);
    } catch (error) {
      console.error('Σφάλμα αυτο-εγγραφής:', error);
      alert('Error registering user');
    }
  };

  // Ανανέωση λίστας συσκευών
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
          console.log(`Σφάλμα φόρτωσης συσκευής ${i}:`, error);
        }
      }
      
      setDevices(devicesList);
    } catch (error) {
      console.error('Σφάλμα ανανέωσης συσκευών:', error);
    }
  };

  // Όταν φορτώνει το component, φέρνουμε τις συσκευές
  useEffect(() => {
    if (contract) {
      refreshDevices();
    }
  }, [contract]);

  // Εμφάνιση επιλογών εγγραφής για μη εγγεγραμμένους χρήστες
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

  // Περιεχόμενο καρτελών
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
      case 'register':
        return (
          <div className="admin-registration">
            <h3>Register New User (Admin Only)</h3>
            <div className="form-group">
              <label>User Address:</label>
              <input
                type="text"
                value={registerAddress}
                onChange={(e) => setRegisterAddress(e.target.value)}
                placeholder="0x..."
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select
                value={registerRole}
                onChange={(e) => setRegisterRole(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                <option value="2">User</option>
                <option value="3">GreenPoint</option>
                <option value="4">Transporter</option>
                <option value="5">Recycler</option>
                <option value="6">Auditor</option>
              </select>
            </div>
            <button onClick={registerUserByAdmin} className="submit-btn">
              Register User
            </button>
          </div>
        );
      case 'devices':
      default:
        return <DeviceList devices={devices} onRefresh={refreshDevices} />;
    }
  };

  // Διαθέσιμες καρτέλες ανά ρόλο
  const getAvailableTabs = () => {
    const baseTabs = [{ key: 'devices', label: 'View Devices' }];
    
    switch (userRole) {
      case 'Admin':
        return [
          ...baseTabs,
          { key: 'add', label: 'Add Device' },
          { key: 'register', label: 'Register Users' },
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