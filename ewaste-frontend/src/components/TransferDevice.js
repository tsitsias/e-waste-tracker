import React, { useState } from 'react';

const TransferDevice = ({ contract, account, onDeviceTransferred }) => {
  const [deviceId, setDeviceId] = useState('');
  const [recyclerAddress, setRecyclerAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deviceId || !recyclerAddress) {
      alert('Please fill in all fields');
      return;
    }

    // Έλεγχος έγκυρης Ethereum διεύθυνσης
    if (!recyclerAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    setLoading(true);
    
    try {
      const tx = await contract.transferDevice(parseInt(deviceId), recyclerAddress);
      await tx.wait();
      
      alert('Device transferred successfully!');
      setDeviceId('');
      setRecyclerAddress('');
      
      if (onDeviceTransferred) {
        onDeviceTransferred();
      }
    } catch (error) {
      console.error('Σφάλμα μεταφοράς συσκευής:', error);
      alert('Error transferring device: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-device">
      <h3>Transfer E-Waste Device</h3>
      <p>As a Transporter, you can transfer collected devices to recyclers.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deviceId">Device ID:</label>
          <input
            type="number"
            id="deviceId"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Enter device ID to transfer"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="recyclerAddress">Recycler Address:</label>
          <input
            type="text"
            id="recyclerAddress"
            value={recyclerAddress}
            onChange={(e) => setRecyclerAddress(e.target.value)}
            placeholder="0x... (Recycler's Ethereum address)"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Transferring Device...' : 'Transfer Device'}
        </button>
      </form>

      <div className="info-section">
        <h4>Transfer Requirements:</h4>
        <ul>
          <li>Device must be in "Collected" status</li>
          <li>Only Transporters can transfer devices</li>
          <li>Recycler address must be registered as a Recycler</li>
          <li>Device will be marked as "InTransit" after successful transfer</li>
        </ul>
      </div>
    </div>
  );
};

export default TransferDevice; 