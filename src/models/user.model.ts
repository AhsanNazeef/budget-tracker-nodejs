import { IUser } from "../common/interfaces";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, maxlength: 50 },
    lastName: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, maxlength: 15 },
    fatherName: { type: String, maxlength: 50 },
    gender: { type: String, enum: ["male", "female", "other"] },
    zipCode: { type: String, maxlength: 10 },
    address: { type: String, maxlength: 200 },
    dateOfBirth: { type: Date },
    photo: { type: String },
    aboutMe: { type: String, maxlength: 500 },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    budgetLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
