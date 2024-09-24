import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Groceries, Rent payment
  amount: { type: Number, required: true }, // Amount spent
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true }, // Reference to the Budget category
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
  createdAt: { type: Date, default: Date.now }, // Date and time of the expense
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
