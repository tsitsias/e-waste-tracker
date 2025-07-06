import React, { useState } from 'react';

const ProcessDevice = ({ contract, account, onDeviceProcessed }) => {
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
      const tx = await contract.processDevice(parseInt(deviceId));
      await tx.wait();
      
      alert('Device processed successfully!');
      setDeviceId('');
      
      if (onDeviceProcessed) {
        onDeviceProcessed();
      }
    } catch (error) {
      console.error('Σφάλμα επεξεργασίας συσκευής:', error);
      alert('Error processing device: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="process-device">
      <h3>Process E-Waste Device</h3>
      <p>As a Recycler, you can process devices that have been transferred to you.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deviceId">Device ID:</label>
          <input
            type="number"
            id="deviceId"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Enter device ID to process"
            min="1"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Processing Device...' : 'Process Device'}
        </button>
      </form>

      <div className="info-section">
        <h4>Processing Requirements:</h4>
        <ul>
          <li>Device must be in "InTransit" status</li>
          <li>Only Recyclers can process devices</li>
          <li>Device must be assigned to your address as recycler</li>
          <li>Device will be marked as "Processed" after successful processing</li>
        </ul>
        
        <h4>Processing Includes:</h4>
        <ul>
          <li>Safe dismantling of the device</li>
          <li>Extraction of valuable materials</li>
          <li>Proper disposal of hazardous components</li>
          <li>Environmental compliance certification</li>
        </ul>
      </div>
    </div>
  );
};

export default ProcessDevice; 