import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas using Mongoose
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure in development / fatal scenario
    process.exit(1);
  }
};
