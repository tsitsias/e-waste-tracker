# E-Waste Tracking System με Blockchain

Σύστημα ιχνηλάτησης ηλεκτρονικών αποβλήτων βασισμένο σε τεχνολογία blockchain και smart contracts.

## 🎯 Περιγραφή

Αυτό το project υλοποιεί ένα πλήρες σύστημα παρακολούθησης e-waste από την καταχώρηση έως την τελική επεξεργασία, χρησιμοποιώντας:

- **Smart Contract** σε Solidity για blockchain logic
- **React Frontend** για user interface  
- **MetaMask** για wallet integration
- **Ganache** για local blockchain development

## 🏗️ Αρχιτεκτονική

```
Frontend (React) ↔ Web3/Ethers ↔ MetaMask ↔ Blockchain (Ganache) ↔ Smart Contract
```

## 👥 Ρόλοι Χρηστών

1. **Admin**: Διαχείριση χρηστών και καταχώρηση e-waste devices
2. **GreenPoint**: Συλλογή devices από κατόχους
3. **Transporter**: Μεταφορά collected devices
4. **Recycler**: Τελική επεξεργασία devices
5. **Auditor**: Εποπτεία και monitoring

## 📋 Προαπαιτούμενα

### Software Requirements

- **Node.js** (v14+)
- **npm** ή **yarn**
- **MetaMask** browser extension
- **Ganache** (GUI ή CLI)
- **Git**

### Optional Tools

- **Remix IDE** για smart contract development
- **Visual Studio Code** με Solidity extensions

## 🚀 Εγκατάσταση

### 1. Clone το Repository

```bash
git clone <repository-url>
cd e-waste-tracking
```

### 2. Setup Ganache Blockchain

**Option A: Ganache GUI**
1. Κατέβασε και εγκατέστησε [Ganache](https://trufflesuite.com/ganache/)
2. Δημιούργησε νέο workspace
3. Σημείωσε το RPC Server URL (συνήθως `http://127.0.0.1:7545`)

**Option B: Ganache CLI**
```bash
npm install -g ganache-cli
ganache-cli --deterministic --accounts 10 --host 0.0.0.0 --port 7545
```

### 3. Setup MetaMask

1. Εγκατέστησε MetaMask browser extension
2. Δημιούργησε νέο wallet ή import existing
3. Προσθήκη Custom Network:
   - **Network Name**: Ganache
   - **RPC URL**: `http://127.0.0.1:7545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`

4. Import Ganache accounts:
   - Copy private keys από Ganache
   - Import στο MetaMask

### 4. Deploy Smart Contract

**Option A: Remix IDE**
1. Άνοιξε [Remix IDE](https://remix.ethereum.org/)
2. Upload το `EwasteTracking.sol` αρχείο
3. Compile contract (Solidity v0.8.0+)
4. Deploy στο Ganache network
5. Copy το contract address

**Option B: Manual Deployment**
```bash
# Install truffle globally
npm install -g truffle

# Initialize truffle project (if needed)
truffle init

# Deploy contract
truffle migrate --network development
```

### 5. Setup Frontend

```bash
# Navigate to frontend directory
cd ewaste-frontend

# Install dependencies
npm install

# Update contract address
# Edit src/App.js and update CONTRACT_ADDRESS
```

**Ενημέρωση Contract Address:**
```javascript
// src/App.js
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 6. Start Development Server

```bash
# In ewaste-frontend directory
npm start
```

Η εφαρμογή θα τρέξει στο `http://localhost:3000`

## 📱 Χρήση του Συστήματος

### Initial Setup

1. **Connect MetaMask** στην εφαρμογή
2. **Ensure** ότι είσαι στο Ganache network
3. **Switch** στο Admin account (πρώτο account από Ganache)

### Admin Functions

1. **Register Users**:
   - Πήγαινε στο "Register Users" tab
   - Εισάγαγε address και επίλεξε role
   - Confirm transaction

2. **Add Devices**:
   - Πήγαινε στο "Add Device" tab
   - Συμπλήρωσε device information
   - Submit και confirm transaction

### User Workflows

#### Complete Device Lifecycle:

1. **Registration** (Admin):
   ```
   Add Device → Device Status: Registered
   ```

2. **Collection** (GreenPoint):
   ```
   Switch to GreenPoint account
   Collect Device → Status: Collected
   ```

3. **Transfer** (Transporter):
   ```
   Switch to Transporter account
   Transfer Device → Status: InTransit
   ```

4. **Processing** (Recycler):
   ```
   Switch to Recycler account
   Process Device → Status: Processed
   ```

### Viewing Data

- **View Devices**: Προβολή όλων των καταχωρημένων devices
- **Refresh List**: Update device status από blockchain
- **Device Details**: ID, Type, Brand, Model, Status, Addresses, Timestamp

## 🔧 Αρχεία Έργου

### Smart Contract
- `EwasteTracking.sol` - Κύριο smart contract
- Contract ABI στο `ewaste-frontend/src/contract/EwasteTracking.json`

### Frontend Components
- `src/App.js` - Κεντρικό component με Web3 integration
- `src/components/Dashboard.js` - Role-based dashboard
- `src/components/AddDevice.js` - Device registration form
- `src/components/DeviceList.js` - Device display component
- `src/components/CollectDevice.js` - GreenPoint functionality
- `src/components/TransferDevice.js` - Transporter functionality
- `src/components/ProcessDevice.js` - Recycler functionality

### Styling
- `src/App.css` - Component styling
- `src/index.css` - Global styles

## 🐛 Troubleshooting

### Common Issues

**1. MetaMask Connection Issues**
```javascript
// Solution: Refresh page and reconnect
// Check network selection in MetaMask
```

**2. Transaction Failures**
```javascript
// Check gas limit and gas price
// Ensure sufficient ETH balance
// Verify contract address is correct
```

**3. Role Permission Errors**
```javascript
// Ensure user is registered with correct role
// Check account switching in MetaMask
// Verify contract owner permissions
```

**4. Contract Interaction Errors**
```javascript
// Verify contract address in App.js
// Check ABI file is up to date
// Ensure Ganache is running
```

### Development Tips

1. **Use Browser Console** για debugging
2. **Check MetaMask Activity** tab για transaction details
3. **Monitor Ganache** για blockchain activity
4. **Use Refresh buttons** για real-time updates

## 📊 Test Data

### Sample Devices για Testing

```javascript
// Add these devices για demonstration:
1. Laptop - Dell Inspiron 15 (Danger Level: 2)
2. Smartphone - iPhone 12 (Danger Level: 1)
3. Desktop PC - HP Pavilion (Danger Level: 3)
4. Tablet - Samsung Galaxy Tab (Danger Level: 1)
5. Monitor - LG UltraWide (Danger Level: 2)
6. Printer - Canon Pixma (Danger Level: 2)
7. Router - TP-Link Archer (Danger Level: 1)
8. TV - Sony Bravia (Danger Level: 3)
9. Gaming Console - PlayStation 5 (Danger Level: 2)
10. Washing Machine - Bosch Serie 6 (Danger Level: 4)
```

## 🔐 Security Features

- **Role-based Access Control** με Solidity modifiers
- **Input Validation** για όλα τα form fields
- **State Transition Validation** για device lifecycle
- **Ownership Verification** για critical operations
- **Event Logging** για audit trail

## 📈 Performance Considerations

- **Gas Optimization** στο smart contract design
- **Efficient State Management** στο React frontend
- **Minimal Blockchain Calls** για better UX
- **Event-driven Updates** για real-time sync

## 🛠️ Development

### Adding New Features

1. **Smart Contract Changes**:
   - Modify `EwasteTracking.sol`
   - Redeploy contract
   - Update ABI file

2. **Frontend Changes**:
   - Add new React components
   - Update Dashboard routing
   - Implement new Web3 calls

### Testing

```bash
# Run frontend tests
cd ewaste-frontend
npm test

# For smart contract testing
truffle test
```

## 📝 Assignment Compliance

Αυτό το project πληροί όλες τις απαιτήσεις της εργασίας:

✅ **Smart Contract με 5 ρόλους**
✅ **UI για registration, tracking, search**  
✅ **10+ unique devices καταχωρημένα**
✅ **2+ complete workflows δοκιμασμένα**
✅ **Blockchain integration**
✅ **Role-based access control**
✅ **Event logging και traceability**

## 👨‍💻 Συγγραφέας

**[Your Name]**
- Μάθημα: Advanced Cryptographic and Security Technologies
- Ίδρυμα: [University Name]

## 📄 License

Αυτό το project δημιουργήθηκε για εκπαιδευτικούς σκοπούς στο πλαίσιο πανεπιστημιακής εργασίας.

---

**Σημείωση**: Για production deployment, θα χρειαστούν επιπλέον security measures και optimizations. 