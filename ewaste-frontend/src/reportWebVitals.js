// Αυτή η function μας βοηθάει να μετράμε την επίδοση της εφαρμογής μας
// Είναι σαν έναν "χρονομέτρη" που μας λέει πόσο γρήγορα φορτώνει η σελίδα
const reportWebVitals = onPerfEntry => {
  // Ελέγχουμε αν έχουμε περάσει κάτι στη function και αν είναι function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Φορτώνουμε τη βιβλιοθήκη web-vitals που μας δίνει τις μετρήσεις
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);    // Cumulative Layout Shift - πόσο "πηδάει" η σελίδα
      getFID(onPerfEntry);    // First Input Delay - πόσο αργεί να απαντήσει στο πρώτο κλικ
      getFCP(onPerfEntry);    // First Contentful Paint - πόσο αργεί να φανεί κάτι στη σελίδα
      getLCP(onPerfEntry);    // Largest Contentful Paint - πόσο αργεί να φανεί το μεγαλύτερο στοιχείο
      getTTFB(onPerfEntry);   // Time to First Byte - πόσο αργεί να φτάσει η πρώτη απάντηση από τον server
    });
  }
};

export default reportWebVitals; 