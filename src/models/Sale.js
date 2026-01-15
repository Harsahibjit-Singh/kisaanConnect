import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  // --- LINK TO ARTHIYA ---
  arthiyaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Arthiya',
    required: true,
  },
  farmerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farmer', 
    required: true 
  },
  cropType: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  
  // --- CALCULATIONS ---
  commissionRate: { type: Number, default: 2.5 },
  commissionAmount: { type: Number, required: true },
  deductedLoanAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true }, 
  
  pdfData: { type: String }, 
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);