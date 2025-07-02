// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title E-waste Tracking Smart Contract
 * @author
 * Περιλαμβάνει ρόλους, καταχώρηση αποβλήτων, μεταφορές, συλλογή, επεξεργασία και ελεγκτή.
 */
contract EwasteTracking {
    address public owner;
    uint256 public deviceCount;

    enum Role { None, Admin, User, GreenPoint, Transporter, Recycler, Auditor }
    enum DeviceStatus { Registered, Collected, InTransit, Processed }
    enum DangerLevel { Low, Medium, High, Critical }

    struct User {
        bool isRegistered;
        Role role;
    }

    struct Device {
        string deviceType;
        string brand;
        string model;
        DangerLevel dangerLevel;
        DeviceStatus status;
        address owner;
        address greenPoint;
        address transporter;
        address recycler;
        uint256 timestamp;
    }

    mapping(address => User) public users;
    mapping(uint256 => Device) public devices;

    event UserRegistered(address indexed user, Role role);
    event DeviceAdded(uint256 indexed deviceId, address indexed owner, string deviceType);
    event DeviceCollected(uint256 indexed deviceId, address indexed greenPoint);
    event DeviceTransferred(uint256 indexed deviceId, address indexed transporter, address indexed recycler);
    event DeviceProcessed(uint256 indexed deviceId, address indexed recycler);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRole(Role _role) {
        require(users[msg.sender].isRegistered && users[msg.sender].role == _role, "Unauthorized access");
        _;
    }

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier deviceExists(uint256 _deviceId) {
        require(_deviceId > 0 && _deviceId <= deviceCount, "Device does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
        users[msg.sender] = User(true, Role.Admin);
        deviceCount = 0;
    }

    function registerUser(address _user, Role _role) public onlyOwner {
        require(_role != Role.None, "Invalid role");
        users[_user] = User(true, _role);
        emit UserRegistered(_user, _role);
    }

    function removeUser(address _user) public onlyOwner {
        users[_user] = User(false, Role.None);
    }

    function getUserRole(address _user) public view returns (Role) {
        return users[_user].role;
    }

    function addDevice(
        string memory _deviceType,
        string memory _brand,
        string memory _model,
        DangerLevel _dangerLevel
    ) public onlyRegistered {
        require(
            users[msg.sender].role == Role.User || 
            users[msg.sender].role == Role.Admin,
            "Only Users and Admins can add devices"
        );

        deviceCount++;
        devices[deviceCount] = Device({
            deviceType: _deviceType,
            brand: _brand,
            model: _model,
            dangerLevel: _dangerLevel,
            status: DeviceStatus.Registered,
            owner: msg.sender,
            greenPoint: address(0),
            transporter: address(0),
            recycler: address(0),
            timestamp: block.timestamp
        });

        emit DeviceAdded(deviceCount, msg.sender, _deviceType);
    }

    function collectDevice(uint256 _deviceId) public 
        deviceExists(_deviceId) 
        onlyRole(Role.GreenPoint) 
    {
        Device storage device = devices[_deviceId];
        require(device.status == DeviceStatus.Registered, "Device not available for collection");
        
        device.status = DeviceStatus.Collected;
        device.greenPoint = msg.sender;
        
        emit DeviceCollected(_deviceId, msg.sender);
    }

    function transferDevice(uint256 _deviceId, address _recycler) public 
        deviceExists(_deviceId) 
        onlyRole(Role.Transporter) 
    {
        Device storage device = devices[_deviceId];
        require(device.status == DeviceStatus.Collected, "Device not ready for transport");
        require(users[_recycler].role == Role.Recycler, "Invalid recycler address");
        
        device.status = DeviceStatus.InTransit;
        device.transporter = msg.sender;
        device.recycler = _recycler;
        
        emit DeviceTransferred(_deviceId, msg.sender, _recycler);
    }

    function processDevice(uint256 _deviceId) public 
        deviceExists(_deviceId) 
        onlyRole(Role.Recycler) 
    {
        Device storage device = devices[_deviceId];
        require(device.status == DeviceStatus.InTransit, "Device not ready for processing");
        require(device.recycler == msg.sender, "Device not assigned to this recycler");
        
        device.status = DeviceStatus.Processed;
        
        emit DeviceProcessed(_deviceId, msg.sender);
    }

    function getDevice(uint256 _deviceId) public view deviceExists(_deviceId) returns (
        string memory,
        string memory,
        string memory,
        DangerLevel,
        DeviceStatus,
        address,
        address,
        address,
        address,
        uint256
    ) {
        Device storage device = devices[_deviceId];
        return (
            device.deviceType,
            device.brand,
            device.model,
            device.dangerLevel,
            device.status,
            device.owner,
            device.greenPoint,
            device.transporter,
            device.recycler,
            device.timestamp
        );
    }

    function getDeviceCount() public view returns (uint256) {
        return deviceCount;
    }
} 