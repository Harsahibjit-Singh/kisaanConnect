import mongoose from 'mongoose';

const ArthiyaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Password is not required if logging in via Google
    required: function() { return !this.googleId; } 
  },
  googleId: {
    type: String, 
    unique: true,
    sparse: true 
  },
  
  // --- REQUIRED FOR FORGOT PASSWORD ---
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
}, { timestamps: true });

export default mongoose.models.Arthiya || mongoose.model('Arthiya', ArthiyaSchema);