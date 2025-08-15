import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  skills: [{ type: String, trim: true }],
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', location: 'text', skills: 'text' });

export const Job = mongoose.model('Job', jobSchema);