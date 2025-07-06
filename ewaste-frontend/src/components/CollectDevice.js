import React, { useState } from 'react';

const CollectDevice = ({ contract, account, onDeviceCollected }) => {
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deviceId) {
      alert('Please enter a device ID');
      return;
    }

    setLoading(true);
    
    try {
      const tx = await contract.collectDevice(parseInt(deviceId));
      await tx.wait();
      
      alert('Device collected successfully!');
      setDeviceId('');
      
      if (onDeviceCollected) {
        onDeviceCollected();
      }
    } catch (error) {
      console.error('Σφάλμα συλλογής συσκευής:', error);
      alert('Error collecting device: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collect-device">
      <h3>Collect E-Waste Device</h3>
      <p>As a Green Point, you can collect registered devices from users.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deviceId">Device ID:</label>
          <input
            type="number"
            id="deviceId"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Enter device ID to collect"
            min="1"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Collecting Device...' : 'Collect Device'}
        </button>
      </form>

      <div className="info-section">
        <h4>Collection Requirements:</h4>
        <ul>
          <li>Device must be in "Registered" status</li>
          <li>Only Green Points can collect devices</li>
          <li>Device will be marked as "Collected" after successful collection</li>
        </ul>
      </div>
    </div>
  );
};

export default CollectDevice; 