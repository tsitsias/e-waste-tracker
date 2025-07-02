import React from 'react';

const DeviceList = ({ devices, onRefresh }) => {
  const statusLabels = {
    0: 'Registered',
    1: 'Collected',
    2: 'InTransit',
    3: 'Processed'
  };

  const dangerLabels = {
    0: 'Low',
    1: 'Medium',
    2: 'High',
    3: 'Critical'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return '#ffa500'; // Orange
      case 1: return '#2196f3'; // Blue
      case 2: return '#ff9800'; // Amber
      case 3: return '#4caf50'; // Green
      default: return '#666';
    }
  };

  const getDangerColor = (level) => {
    switch (level) {
      case 0: return '#4caf50'; // Green
      case 1: return '#ff9800'; // Orange
      case 2: return '#f44336'; // Red
      case 3: return '#9c27b0'; // Purple
      default: return '#666';
    }
  };

  return (
    <div className="device-list">
      <div className="list-header">
        <h3>E-Waste Devices ({devices.length})</h3>
        <button onClick={onRefresh} className="refresh-btn">
          Refresh List
        </button>
      </div>

      {devices.length === 0 ? (
        <div className="no-devices">
          <p>No devices registered yet.</p>
        </div>
      ) : (
        <div className="devices-grid">
          {devices.map((device) => (
            <div key={device.id} className="device-card">
              <div className="device-header">
                <h4>Device #{device.id}</h4>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(device.status) }}
                >
                  {statusLabels[device.status]}
                </span>
              </div>
              
              <div className="device-details">
                <div className="detail-row">
                  <strong>Type:</strong> {device.deviceType}
                </div>
                <div className="detail-row">
                  <strong>Brand:</strong> {device.brand}
                </div>
                <div className="detail-row">
                  <strong>Model:</strong> {device.model}
                </div>
                <div className="detail-row">
                  <strong>Danger Level:</strong>
                  <span 
                    className="danger-badge"
                    style={{ color: getDangerColor(device.dangerLevel) }}
                  >
                    {dangerLabels[device.dangerLevel]}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Owner:</strong> 
                  <span className="address">{device.owner.slice(0, 6)}...{device.owner.slice(-4)}</span>
                </div>
                
                {device.greenPoint !== '0x0000000000000000000000000000000000000000' && (
                  <div className="detail-row">
                    <strong>Green Point:</strong>
                    <span className="address">{device.greenPoint.slice(0, 6)}...{device.greenPoint.slice(-4)}</span>
                  </div>
                )}
                
                {device.transporter !== '0x0000000000000000000000000000000000000000' && (
                  <div className="detail-row">
                    <strong>Transporter:</strong>
                    <span className="address">{device.transporter.slice(0, 6)}...{device.transporter.slice(-4)}</span>
                  </div>
                )}
                
                {device.recycler !== '0x0000000000000000000000000000000000000000' && (
                  <div className="detail-row">
                    <strong>Recycler:</strong>
                    <span className="address">{device.recycler.slice(0, 6)}...{device.recycler.slice(-4)}</span>
                  </div>
                )}
                
                <div className="detail-row">
                  <strong>Registered:</strong> {device.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceList; 