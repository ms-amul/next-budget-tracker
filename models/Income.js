import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  icon: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Registering the model
const Income = mongoose.models.Income || mongoose.model('Income', IncomeSchema);
export default Income;