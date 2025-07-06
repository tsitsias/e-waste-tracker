// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Σύστημα Παρακολούθησης Ηλεκτρονικών Αποβλήτων
 * @author Καραογλανιάν Γρηγόρης & Τσιτσιάς Γεώργιος
 * 
 * Αυτό το έξυπνο συμβόλαιο δημιουργήθηκε για να βοηθήσει στην παρακολούθηση
 * ηλεκτρονικών αποβλήτων από τη στιγμή που κάποιος θέλει να τα απορρίψει
 * μέχρι την τελική τους ανακύκλωση. Σκοπός μας είναι να κάνουμε τη διαδικασία
 * πιο διαφανή και φιλική προς το περιβάλλον! 🌱
 */
contract EwasteTracking {
    address public owner;
    uint256 public deviceCount;

    // Οι ρόλοι που μπορεί να έχει κάποιος στο σύστημά μας
    enum Role { None, Admin, GreenPoint, Transporter, Recycler, Auditor }
    
    // Σε ποια κατάσταση βρίσκεται μια συσκευή
    enum DeviceStatus { Registered, Collected, InTransit, Processed }
    
    // Πόσο επικίνδυνη είναι μια συσκευή για το περιβάλλον
    enum DangerLevel { Low, Medium, High, Critical }

    // Πληροφορίες για κάθε χρήστη του συστήματος
    struct User {
        bool isRegistered;
        Role role;
    }

    // Όλες οι πληροφορίες για μια συσκευή που θέλουμε να ανακυκλώσουμε
    struct Device {
        string deviceType;      // Τι είδους συσκευή είναι (π.χ. κινητό, laptop)
        string brand;           // Ποια εταιρεία την έφτιαξε
        string model;           // Το μοντέλο της συσκευής
        DangerLevel dangerLevel; // Πόσο επικίνδυνη είναι
        DeviceStatus status;    // Σε ποια φάση βρίσκεται
        address owner;          // Ποιος την κατέγραψε
        address greenPoint;     // Ποιο σημείο συλλογής την πήρε
        address transporter;    // Ποιος την μεταφέρει
        address recycler;       // Ποιος θα την ανακυκλώσει
        uint256 timestamp;      // Πότε καταγράφηκε
    }

    mapping(address => User) public users;
    mapping(uint256 => Device) public devices;

    // Γεγονότα που εκπέμπει το συμβόλαιο για να μας ενημερώνει
    event UserRegistered(address indexed user, Role role);
    event DeviceAdded(uint256 indexed deviceId, address indexed owner, string deviceType);
    event DeviceCollected(uint256 indexed deviceId, address indexed greenPoint);
    event DeviceTransferred(uint256 indexed deviceId, address indexed transporter, address indexed recycler);
    event DeviceProcessed(uint256 indexed deviceId, address indexed recycler);

    // Μόνο ο κάτοχος του συμβολαίου μπορεί να κάνει αυτές τις ενέργειες
    modifier onlyOwner() {
        require(msg.sender == owner, "Συγγνώμη, μόνο ο διαχειριστής μπορεί να κάνει αυτή την ενέργεια!");
        _;
    }

    // Ελέγχει αν κάποιος έχει τον σωστό ρόλο για μια ενέργεια
    modifier onlyRole(Role _role) {
        require(users[msg.sender].isRegistered && users[msg.sender].role == _role, "Δεν έχετε τα απαραίτητα δικαιώματα για αυτή την ενέργεια!");
        _;
    }

    // Ελέγχει αν ο χρήστης είναι εγγεγραμμένος στο σύστημα
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "Πρέπει πρώτα να εγγραφείτε στο σύστημα!");
        _;
    }

    // Ελέγχει αν η συσκευή που ψάχνουμε όντως υπάρχει
    modifier deviceExists(uint256 _deviceId) {
        require(_deviceId > 0 && _deviceId <= deviceCount, "Αυτή η συσκευή δεν υπάρχει στο σύστημά μας!");
        _;
    }

    // Δημιουργία του συμβολαίου - ο δημιουργός γίνεται αυτόματα διαχειριστής
    constructor() {
        owner = msg.sender;
        users[msg.sender] = User(true, Role.Admin);
        deviceCount = 0;
    }

    // Εγγραφή νέου χρήστη στο σύστημα
    function registerUser(address _user, Role _role) public onlyOwner {
        require(_role != Role.None, "Πρέπει να δώσετε έναν έγκυρο ρόλο στον χρήστη!");
        users[_user] = User(true, _role);
        emit UserRegistered(_user, _role);
    }

    // Αφαίρεση χρήστη από το σύστημα
    function removeUser(address _user) public onlyOwner {
        users[_user] = User(false, Role.None);
    }

    // Δες τι ρόλο έχει ένας χρήστης
    function getUserRole(address _user) public view returns (Role) {
        return users[_user].role;
    }

    // Προσθήκη νέας συσκευής στο σύστημα
    function addDevice(
        string memory _deviceType,
        string memory _brand,
        string memory _model,
        DangerLevel _dangerLevel
    ) public onlyRegistered {
        require(
            users[msg.sender].role == Role.Admin,
            "Μόνο οι διαχειριστές μπορούν να προσθέσουν νέες συσκευές!"
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

    // Συλλογή συσκευής από σημείο συλλογής
    function collectDevice(uint256 _deviceId) public 
        deviceExists(_deviceId) 
        onlyRole(Role.GreenPoint) 
    {
        Device storage device = devices[_deviceId];
        require(device.status == DeviceStatus.Registered, "Αυτή η συσκευή δεν είναι διαθέσιμη για συλλογή!");
        
        device.status = DeviceStatus.Collected;
        device.greenPoint = msg.sender;
        
        emit DeviceCollected(_deviceId, msg.sender);
    }

    // Μεταφορά συσκευής σε κέντρο ανακύκλωσης
    function transferDevice(uint256 _deviceId, address _recycler) public 
        deviceExists(_deviceId) 
        onlyRole(Role.Transporter) 
    {
        Device storage device = devices[_deviceId];
        require(device.status == DeviceStatus.Collected, "Αυτή η συσκευή δεν είναι έτοιμη για μεταφορά!");
        require(users[_recycler].role == Role.Recycler, "Η διεύθυνση που δώσατε δεν είναι έγκυρο κέντρο ανακύκλωσης!");
        
        device.status = DeviceStatus.InTransit;
        device.transporter = msg.sender;
        device.recycler = _recycler;
        
        emit DeviceTransferred(_deviceId, msg.sender, _recycler);
    }

    // Επεξεργασία/ανακύκλωση της συσκευής
    function processDevice(uint256 _deviceId) public 
        deviceExists(_deviceId) 
        onlyRole(Role.Recycler) 
    {
        Device storage device = devices[_deviceId];
        require(device.status == DeviceStatus.InTransit, "Αυτή η συσκευή δεν είναι έτοιμη για επεξεργασία!");
        require(device.recycler == msg.sender, "Αυτή η συσκευή δεν έχει ανατεθεί στο δικό σας κέντρο ανακύκλωσης!");
        
        device.status = DeviceStatus.Processed;
        
        emit DeviceProcessed(_deviceId, msg.sender);
    }

    // Δες όλες τις πληροφορίες μιας συσκευής
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

    // Δες πόσες συσκευές έχουμε καταγράψει συνολικά
    function getDeviceCount() public view returns (uint256) {
        return deviceCount;
    }
} 