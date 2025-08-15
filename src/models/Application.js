import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, default: '' },
  status: { type: String, enum: ['applied', 'review', 'interview', 'rejected', 'hired'], default: 'applied' }
}, { timestamps: true });

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);