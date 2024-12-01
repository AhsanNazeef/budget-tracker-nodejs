import mongoose, { Schema } from "mongoose";
import { IExpense } from "../common/interfaces";

const ExpenseSchema: Schema = new Schema(
  {
    title: { type: String, required: true, maxlength: 30 },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Index for better query performance
ExpenseSchema.index({ title: "text" });
ExpenseSchema.index({ user: 1, date: -1 });

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
