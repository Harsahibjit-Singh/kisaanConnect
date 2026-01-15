import mongoose from 'mongoose';

const FarmerSchema = new mongoose.Schema({
  // --- LINK TO ARTHIYA (THE OWNER) ---
  arthiyaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Arthiya',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  aadhar: {
    type: String,
    required: true,
  },
  accountNo: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Compound Index: Ensures Aadhar is unique ONLY within the specific Arthiya's list
FarmerSchema.index({ aadhar: 1, arthiyaId: 1 }, { unique: true });

export default mongoose.models.Farmer || mongoose.model('Farmer', FarmerSchema);