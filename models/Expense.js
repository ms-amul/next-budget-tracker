import mongoose from 'mongoose';
import Budget from './Budget'; // Import the Budget model

const ExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Registering the model
const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
export default Expense;
