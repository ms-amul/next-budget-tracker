import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Salary, Freelance
  amount: { type: Number, required: true }, // Income amount
  icon: { type: String }, // Optional: Icon for the income source
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
  createdAt: { type: Date, default: Date.now }, // Date when income was added
});

export default mongoose.models.Income || mongoose.model('Income', IncomeSchema);
