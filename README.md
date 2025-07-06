# E-Waste Tracking System με Blockchain

Σύστημα ιχνηλάτησης ηλεκτρονικών αποβλήτων βασισμένο σε τεχνολογία blockchain και smart contracts.

## Περιγραφή

Αυτό το σύστημα υλοποιεί ένα πλήρες σύστημα παρακολούθησης ηλεκτρονικών αποβλήτων (e-waste) από την καταχώρηση έως την τελική επεξεργασία, χρησιμοποιώντας:

- Smart Contract σε Solidity για blockchain logic
- React frontend για τη διεπαφή χρήστη
- MetaMask για σύνδεση πορτοφολιών
- Ganache για το development του τοπικού blockchain

## Αρχιτεκτονική

```
Frontend (React) ↔ Web3/Ethers ↔ MetaMask ↔ Blockchain (Ganache) ↔ Smart Contract
```

## Ρόλοι χρηστών

- **Admin**: Διαχείριση χρηστών και καταχώρηση συσκευών e-waste
- **GreenPoint**: Συλλογή συσκευών e-waste από τους κατόχους
- **Transporter**: Μεταφορά των συλλεχθέντων συσκευών
- **Recycler**: Τελική επεξεργασία των συσκευών
- **Auditor**: Εποπτεία και παρακολούθηση

## Λογισμικό που χρειάζεται

### Node.js (έκδοση 14 ή νεότερη)
- Κατέβασμα από: https://nodejs.org/
- Επαλήθευση εγκατάστασης: `node --version`

### npm (συνήθως εγκαθίσταται με το Node.js)
- Επαλήθευση: `npm --version`

### MetaMask browser extension
- Chrome: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/

### Ganache (για τοπικό blockchain)
- GUI: https://trufflesuite.com/ganache/
- CLI: `npm install -g ganache-cli`

### Git (για version control)
- Windows: https://git-scm.com/download/win
- macOS: `brew install git`
- Linux: `sudo apt-get install git`

### Προαιρετικά εργαλεία
- Remix IDE για ανάπτυξη smart contracts
- Visual Studio Code (με επεκτάσεις για Solidity)

## Εγκατάσταση

### 1. Κατέβασμα του project
```bash
git clone <repository-url>
cd e-waste-tracking
```
Ή αντιγραφή των αρχείων χειροκίνητα σε ένα φάκελο.

### 2. Ρύθμιση blockchain (Ganache)

#### Ganache GUI (προτεινόμενο για αρχάριους):
1. **Εγκατάσταση Ganache**: Κατέβασε το από https://trufflesuite.com/ganache/ και εγκατέστησέ το
2. **Δημιουργία workspace**: Άνοιξε το Ganache, δημιούργησε ένα νέο workspace με όνομα "E-Waste Tracking" και άφησε τις default ρυθμίσεις:
   - Server: http://127.0.0.1:7545
   - Network ID: 1337
   - Accounts: 10
   - Ether: 100
3. **Σημείωση στοιχείων**: Σημείωσε τον RPC Server, το Network ID και τα private keys των πρώτων 5 λογαριασμών

#### Ganache CLI:
```bash
npm install -g ganache-cli
ganache-cli --deterministic --accounts 10 --host 0.0.0.0 --port 7545 --networkId 1337
```

### 3. Ρύθμιση MetaMask

1. **Εγκατάσταση**: Εγκατάσταση MetaMask extension στον browser και δημιουργία νέου wallet ή εισαγωγή υπάρχοντος

2. **Προσθήκη δικτύου Ganache**: Κλίκ στο εικονίδιο του MetaMask, επίλεξε 'Add Network' και συμπλήρωσε:
   - Network Name: `Ganache Local`
   - New RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

3. **Import λογαριασμών**: Αντιγραφή των private keys από Ganache GUI και εισαγωγή τους στο MetaMask (Account → Import Account → Private Key). Επανάλαβε για τουλάχιστον 5 λογαριασμούς

4. **Ονομασία λογαριασμών**: Συνιστάται να ονομάσεις τους πρώτους πέντε λογαριασμούς ως: Admin, GreenPoint, Transporter, Recycler, Auditor

### 4. Ανάπτυξη Smart Contract

#### Remix IDE:
1. **Άνοιγμα Remix**: Πήγαινε στο https://remix.ethereum.org/
2. **Upload και compile**: Φόρτωσε το αρχείο `EwasteTracking.sol` στο Remix και κάνε compile με compiler version 0.8.0 ή νεότερη
3. **Deployment**: Στη καρτέλα Deploy & Run, επίλεξε Environment 'Injected Provider - MetaMask', βεβαιώσου ότι το MetaMask είναι στο Ganache δίκτυο, επίλεξε το Admin account και κάνε Deploy
4. **Αντιγραφή διεύθυνσης**: Μετά το deployment, αντιγράψτε τη διεύθυνση του smart contract

#### Truffle Framework:
```bash
npm install -g truffle
truffle init
# Πρόσθεσε το EwasteTracking.sol στον φάκελο contracts/
# Δημιούργησε το αντίστοιχο migration script
truffle migrate --network development
```

### 5. Ρύθμιση Frontend

```bash
cd ewaste-frontend
npm install
# Αν εμφανιστούν προειδοποιήσεις:
npm audit fix
```

1. **Ενημέρωση συμβολαίου**: Άνοιξε το αρχείο `src/App.js`, βρες τη γραμμή με `const CONTRACT_ADDRESS` και αντικατέστησε την τιμή με τη διεύθυνση του deployed συμβολαίου

2. **Εκκίνηση εφαρμογής**:
```bash
npm start
```
Η εφαρμογή θα ανοίξει στο http://localhost:3000

## Χρήση του συστήματος

Για αρχική ρύθμιση:
1. Συνδέστε το MetaMask στην εφαρμογή
2. Βεβαιωθείτε ότι είστε στο Ganache δίκτυο
3. Χρησιμοποιήστε τον λογαριασμό Admin (πρώτο λογαριασμό του Ganache)
4. Εκτελέστε τις λειτουργίες εγγραφής χρηστών, προσθήκης συσκευών και ολόκληρου του κύκλου ζωής των συσκευών μέσω του frontend

## Τεχνολογίες

- **Blockchain**: Ethereum (Ganache για development)
- **Smart Contracts**: Solidity
- **Frontend**: React.js
- **Web3 Integration**: Ethers.js
- **Wallet**: MetaMask
- **Development Tools**: Remix IDE, Truffle Framework