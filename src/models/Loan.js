import mongoose from 'mongoose';

const LoanSchema = new mongoose.Schema({
  // --- LINK TO ARTHIYA ---
  arthiyaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Arthiya',
    required: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true, 
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes:{
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
}, { timestamps: true });

export default mongoose.models.Loan || mongoose.model('Loan', LoanSchema);