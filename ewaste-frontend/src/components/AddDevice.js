import React, { useState } from 'react';

const AddDevice = ({ contract, account, onDeviceAdded }) => {
  const [deviceData, setDeviceData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    dangerLevel: 0
  });
  const [loading, setLoading] = useState(false);

  const dangerLevels = {
    0: 'Low',
    1: 'Medium', 
    2: 'High',
    3: 'Critical'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeviceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deviceData.deviceType || !deviceData.brand || !deviceData.model) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const tx = await contract.addDevice(
        deviceData.deviceType,
        deviceData.brand,
        deviceData.model,
        parseInt(deviceData.dangerLevel)
      );
      
      await tx.wait();
      
      alert('Device added successfully!');
      setDeviceData({
        deviceType: '',
        brand: '',
        model: '',
        dangerLevel: 0
      });
      
      if (onDeviceAdded) {
        onDeviceAdded();
      }
    } catch (error) {
      console.error('Error adding device:', error);
      alert('Error adding device: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-device">
      <h3>Add New E-Waste Device</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deviceType">Device Type:</label>
          <select
            id="deviceType"
            name="deviceType"
            value={deviceData.deviceType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Device Type</option>
            <option value="Smartphone">Smartphone</option>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop Computer</option>
            <option value="Tablet">Tablet</option>
            <option value="TV">Television</option>
            <option value="Monitor">Monitor</option>
            <option value="Printer">Printer</option>
            <option value="Router">Router</option>
            <option value="Camera">Camera</option>
            <option value="Gaming Console">Gaming Console</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand:</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={deviceData.brand}
            onChange={handleInputChange}
            placeholder="e.g., Apple, Samsung, HP"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">Model:</label>
          <input
            type="text"
            id="model"
            name="model"
            value={deviceData.model}
            onChange={handleInputChange}
            placeholder="e.g., iPhone 12, Galaxy S21"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dangerLevel">Danger Level:</label>
          <select
            id="dangerLevel"
            name="dangerLevel"
            value={deviceData.dangerLevel}
            onChange={handleInputChange}
          >
            {Object.entries(dangerLevels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding Device...' : 'Add Device'}
        </button>
      </form>
    </div>
  );
};

export default AddDevice; 