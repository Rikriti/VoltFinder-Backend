// server.js
const app = require('./app'); // Import app
const db = require('./db');   // Import database connection
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Test database connection
(async () => {
  try {
    // Test connection with a simple query
    await db.query('SELECT 1');
    console.log('Database connected successfully');

    // Start the server after confirming DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process if DB connection fails
  }
})();
