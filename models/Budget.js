import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Food, Entertainment
  amount: { type: Number, required: true }, // Total budget amount
  icon: { type: String }, // Optional: Icon for the budget
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
  createdAt: { type: Date, default: Date.now }, // Date when budget was created
});

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
