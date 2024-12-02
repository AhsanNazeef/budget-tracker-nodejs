import { IUser } from "../common/interfaces";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, maxlength: 50 },
    lastName: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, maxlength: 15 },
    fatherName: { type: String, maxlength: 50, default: "" },
    gender: { type: String, enum: ["male", "female", "other"] },
    zipCode: { type: String, maxlength: 10 },
    address: { type: String, maxlength: 200, default: "" },
    dateOfBirth: { type: Date },
    photo: { type: String, default: "" },
    aboutMe: { type: String, maxlength: 500, default: "" },
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
