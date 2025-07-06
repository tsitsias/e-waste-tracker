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
Frontend (React) ↔ Web3/Ethers ↔ MetaMask ↔ Blockchain (Ganache) ↔ Smart Contract Ρόλοι χρηστών:
Admin: Διαχείριση χρηστών και καταχώρηση συσκευών e-waste
GreenPoint: Συλλογή συσκευών e-waste από τους κατόχους
Transporter: Μεταφορά των συλλεχθέντων συσκευών
Recycler: Τελική επεξεργασία των συσκευών
Auditor: Εποπτεία και παρακολούθηση
Λογισμικό που χρειάζεται:
Node.js (έκδοση 14 ή νεότερη)
Κατέβασμα από: https://nodejs.org/
Επαλήθευση εγκατάστασης: node --version
npm (συνήθως εγκαθίσταται με το Node.js)
Επαλήθευση: npm --version
MetaMask browser extension
Chrome: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn
Firefox: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/
Ganache (για τοπικό blockchain)
GUI: https://trufflesuite.com/ganache/
CLI: npm install -g ganache-cli
Git (για version control)
Windows: https://git-scm.com/download/win
macOS: brew install git
Linux: sudo apt-get install git
Προαιρετικά εργαλεία:
Remix IDE για ανάπτυξη smart contracts
Visual Studio Code (με επεκτάσεις για Solidity)
Εγκατάσταση:
Clone το repository (εάν είναι διαθέσιμο online): git clone <repository-url> και μετά cd e-waste-tracking.
Ή αντιγραφή των αρχείων χειροκίνητα σε ένα φάκελο. Ρύθμιση blockchain (Ganache):
Ganache GUI (προτεινόμενο για αρχάριους):
Εγκατάσταση Ganache: Κατέβασε το από https://trufflesuite.com/ganache/ και εγκατέστησέ το.
Δημιουργία workspace: Άνοιξε το Ganache, δημιούργησε ένα νέο workspace με όνομα "E-Waste Tracking" και άφησε τις default ρυθμίσεις (Server: http://127.0.0.1:7545, Network ID: 1337, Accounts: 10, Ether: 100).
Σημείωση στοιχείων: Σημείωσε τον RPC Server (http://127.0.0.1:7545), το Network ID (1337) και τα private keys των πρώτων 5 λογαριασμών.
Ganache CLI:
Εγκατάσταση: npm install -g ganache-cli
Εκκίνηση: ganache-cli --deterministic --accounts 10 --host 0.0.0.0 --port 7545 --networkId 1337
Ρύθμιση MetaMask:
Εγκατάσταση MetaMask extension στον browser και δημιουργία νέου wallet ή εισαγωγή υπάρχοντος.
Προσθήκη δικτύου Ganache: Κλίk στο εικονίδιο του MetaMask, επίλεξε 'Add Network' και συμπλήρωσε τα πεδία: Network Name: Ganache Local, New RPC URL: http://127.0.0.1:7545, Chain ID: 1337, Currency Symbol: ETH.
Import λογαριασμών: Αντιγραφή των private keys από Ganache GUI (κλίk στο εικονίδιο κλειδιού δίπλα σε κάθε account) και εισαγωγή τους στο MetaMask (Account → Import Account → Private Key). Επανάλαβε για τουλάχιστον 5 λογαριασμούς.
Ονομασία λογαριασμών: Συνιστάται να ονομάσεις τους πρώτους πέντε λογαριασμούς ως εξής: Admin, GreenPoint, Transporter, Recycler, Auditor.
Ανάπτυξη Smart Contract:
Remix IDE:
Άνοιγμα Remix: Πήγαινε στο https://remix.ethereum.org/.
Upload και compile: Φόρτωσε το αρχείο EwasteTracking.sol στο Remix και κάνε compile με compiler version 0.8.0 ή νεότερη.
Deployment: Στη καρτέλα Deploy & Run, επίλεξε Environment 'Injected Provider - MetaMask', βεβαιώσου ότι το MetaMask είναι στο Ganache δίκτυο, επίλεξε το Admin account και κάνε Deploy.
Αντιγραφή διεύθυνσης συμβολαίου: Μετά το deployment, αντιγράψτε τη διεύθυνση του smart contract που εμφανίζεται – θα τη χρειαστείς στο frontend.
Truffle Framework:
Εγκατάσταση: npm install -g truffle
Αρχικοποίηση project: truffle init (αν δεν υπάρχει ήδη)
Προσθήκη συμβολαίου και migration: Πρόσθεσε το EwasteTracking.sol στον φάκελο contracts/ και δημιούργησε το αντίστοιχο script μετανάστευσης στον φάκελο migrations/.
Deploy: truffle migrate --network development
Ρύθμιση Frontend:
Μετάβαση στον φάκελο frontend: cd ewaste-frontend
Εγκατάσταση εξαρτήσεων: npm install (και npm audit fix αν εμφανιστούν προειδοποιήσεις)
Ενημέρωση συμβολαίου: Άνοιξε το αρχείο src/App.js, βρες τη γραμμή με const CONTRACT_ADDRESS και αντικατέστησε την τιμή με τη διεύθυνση του deployed συμβολαίου.
Εκκίνηση εφαρμογής: npm start (στον φάκελο ewaste-frontend). Η εφαρμογή θα ανοίξει στο http://localhost:3000.
Χρήση του συστήματος:
Για αρχική ρύθμιση, συνδέστε το MetaMask στην εφαρμογή και βεβαιωθείτε ότι είστε στο Ganache δίκτυο, χρησιμοποιώντας τον λογαριασμό Admin (πρώτο λογαριασμό του Ganache). Εφόσον συνδεθεί, μπορείτε να εκτελέσετε τις λειτουργίες εγγραφής χρηστών, προσθήκης συσκευών και ολόκληρου του κύκλου ζωής των συσκευών μέσω του frontend.