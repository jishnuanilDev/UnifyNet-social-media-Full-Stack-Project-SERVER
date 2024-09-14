import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb+srv://jis:m0ng0j15@clusterjis.fdphdyx.mongodb.net/SocialMedia?retryWrites=true&w=majority");
    console.log("mongodb connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.log("mongodb connection failed", error.message);
    }
    console.log("Unexpected error during mongodb connection", error);
  }
};

export default connectDb;
