import mongoose from 'mongoose';
import Expense from './Expense'; // Ensure this import is at the top

const BudgetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  icon: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Pre-hook to delete associated expenses when budget is deleted
BudgetSchema.pre('findOneAndDelete', async function (next) {
  const budgetId = this.getQuery()._id;
  await Expense.deleteMany({ budgetId });
  next();
});

// Registering the model
const Budget = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
export default Budget;
