import mongoose from 'mongoose';
import Expense from './Expense'; // Import the Expense model

const BudgetSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Food, Entertainment
  amount: { type: Number, required: true }, // Total budget amount
  icon: { type: String }, // Optional: Icon for the budget
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
  createdAt: { type: Date, default: Date.now }, // Date when budget was created
});

BudgetSchema.pre('findOneAndDelete', async function (next) {
  const budgetId = this.getQuery()._id;
  await Expense.deleteMany({ budgetId });
  next();
});

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
