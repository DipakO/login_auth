import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "logauth",
    };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log(`Connection Succesfully`);
  } catch (error) {
    console.log(error);
  }
};

// exports = connectDB;
export default connectDB;
