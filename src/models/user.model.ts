import { IUser } from "../common/interfaces";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, maxlength: 50 },
    lastName: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
