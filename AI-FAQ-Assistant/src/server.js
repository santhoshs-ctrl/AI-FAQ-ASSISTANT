const app = require('./app');
const dbConnect = require('./config/db');

const connectDB = async () => {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

const startServer = async () => {
  // Connect to database
  await connectDB();

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer();
