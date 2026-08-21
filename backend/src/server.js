const dotenv = require('dotenv');

dotenv.config();
const app = require('./app');
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});