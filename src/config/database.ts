import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {

  try {
    // await mongoose.connect("mongodb://localhost:27017/SocialMedia");
    await mongoose.connect("mongodb+srv://jis:m0ng0j15@clusterjis.9v2fc.mongodb.net/SocialMedia?retryWrites=true&w=majority&appName=ClusterJis");
    console.log("mongodb connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.log("mongodb connection failed", error.message);
    }
    console.log("Unexpected error during mongodb connection", error);
  }
};

export default connectDb;
