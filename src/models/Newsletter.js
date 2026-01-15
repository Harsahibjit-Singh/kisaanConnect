import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);