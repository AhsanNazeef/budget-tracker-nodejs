import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const dbConection = (): void => {
  mongoose
    .connect(process.env.MONGODB_URL as string)
    .then(() => {
      console.log(
        "Database is connected successfully.",
        process.env.MONGODB_URL
      );
    })
    .catch((err: unknown) => {
      console.error(
        "MongoDB connection error. Please make sure MongoDB is running. " + err
      );
      process.exit(1);
    });
};

export default dbConection;
