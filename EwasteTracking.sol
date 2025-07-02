// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title E-waste Tracking Smart Contract
 * @author
 * Περιλαμβάνει ρόλους, καταχώρηση αποβλήτων, μεταφορές, συλλογή, επεξεργασία και ελεγκτή.
 */
contract EwasteTracking {
    enum Role { None, Admin, User, GreenPoint, Transporter, Recycler, Auditor }
    enum DeviceStatus { Registered, Collected, InTransit, Processed }
    enum DangerLevel { Low, Medium, High }

    struct User {
        address userAddress;
        string name;
        Role role;
        bool exists;
    }

    struct EDevice {
        string id; // serial number
        string category;
        DangerLevel dangerLevel;
        string condition;
        DeviceStatus status;
        address currentOwner;
        address[] history;
    }

    address public admin;
    mapping(address => User) public users;
    mapping(string => EDevice) public devices;
    string[] public deviceIds;

    // Events
    event UserRegistered(address user, string name, Role role);
    event UserRemoved(address user);
    event DeviceAdded(string id, address indexed owner);
    event DeviceCollected(string id, address indexed greenPoint);
    event DeviceTransferred(string id, address indexed transporter, address to);
    event DeviceProcessed(string id, address indexed recycler, string processType);

    // Modifiers
    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.Admin, "Only admin");
        _;
    }
    modifier onlyRole(Role _role) {
        require(users[msg.sender].role == _role, "Not authorized");
        _;
    }
    modifier onlyRegistered() {
        require(users[msg.sender].exists, "Not registered");
        _;
    }
    modifier deviceExists(string memory _id) {
        require(bytes(devices[_id].id).length != 0, "Device does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
        users[msg.sender] = User(msg.sender, "Admin", Role.Admin, true);
        emit UserRegistered(msg.sender, "Admin", Role.Admin);
    }

    // --- User Management ---
    function registerUser(address _user, string memory _name, Role _role) public onlyAdmin {
        require(!users[_user].exists, "User exists");
        users[_user] = User(_user, _name, _role, true);
        emit UserRegistered(_user, _name, _role);
    }

    function removeUser(address _user) public onlyAdmin {
        require(users[_user].exists, "User not found");
        delete users[_user];
        emit UserRemoved(_user);
    }

    // --- Device Management ---
    function addDevice(
        string memory _id,
        string memory _category,
        DangerLevel _dangerLevel,
        string memory _condition
    ) public onlyRole(Role.User) {
        require(bytes(devices[_id].id).length == 0, "Device exists");
        address[] memory hist = new address[](1);
        hist[0] = msg.sender;
        devices[_id] = EDevice(_id, _category, _dangerLevel, _condition, DeviceStatus.Registered, msg.sender, hist);
        deviceIds.push(_id);
        emit DeviceAdded(_id, msg.sender);
    }

    function collectDevice(string memory _id) public onlyRole(Role.GreenPoint) deviceExists(_id) {
        EDevice storage dev = devices[_id];
        require(dev.status == DeviceStatus.Registered, "Not ready for collection");
        dev.status = DeviceStatus.Collected;
        dev.currentOwner = msg.sender;
        dev.history.push(msg.sender);
        emit DeviceCollected(_id, msg.sender);
    }

    function transferDevice(string memory _id, address _to) public onlyRole(Role.Transporter) deviceExists(_id) {
        EDevice storage dev = devices[_id];
        require(dev.status == DeviceStatus.Collected, "Not ready for transfer");
        dev.status = DeviceStatus.InTransit;
        dev.currentOwner = msg.sender;
        dev.history.push(msg.sender);
        // _to θα είναι η μονάδα ανακύκλωσης
        emit DeviceTransferred(_id, msg.sender, _to);
    }

    function processDevice(string memory _id, string memory _processType) public onlyRole(Role.Recycler) deviceExists(_id) {
        EDevice storage dev = devices[_id];
        require(dev.status == DeviceStatus.InTransit, "Not ready for processing");
        dev.status = DeviceStatus.Processed;
        dev.currentOwner = msg.sender;
        dev.history.push(msg.sender);
        emit DeviceProcessed(_id, msg.sender, _processType);
    }

    // --- View Functions ---
    function getDevice(string memory _id) public view deviceExists(_id) returns (
        string memory, string memory, DangerLevel, string memory, DeviceStatus, address, address[] memory
    ) {
        EDevice storage dev = devices[_id];
        // Όλοι μπορούν να δουν, αλλά τα UI θα φιλτράρουν ανάλογα με το ρόλο
        return (
            dev.id,
            dev.category,
            dev.dangerLevel,
            dev.condition,
            dev.status,
            dev.currentOwner,
            dev.history
        );
    }

    function getAllDeviceIds() public view returns (string[] memory) {
        return deviceIds;
    }

    function getUser(address _user) public view returns (string memory, Role, bool) {
        User storage u = users[_user];
        return (u.name, u.role, u.exists);
    }
} 