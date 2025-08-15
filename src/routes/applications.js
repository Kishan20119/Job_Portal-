import express from 'express';
import { validationResult } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { applyValidator, statusUpdateValidator } from '../validators/applicationValidators.js';

const router = express.Router();

// Candidate: apply to job
router.post('/jobs/:jobId/apply', authenticate, requireRole('candidate'), applyValidator, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const job = await Job.findById(req.params.jobId);
  if (!job || !job.isActive) return res.status(404).json({ message: 'Job not found or closed' });
  const app = await Application.create({ job: job._id, candidate: req.user._id, coverLetter: req.body.coverLetter || '' });
  res.status(201).json(app);
}));

// Candidate: list my applications
router.get('/me', authenticate, requireRole('candidate'), asyncHandler(async (req, res) => {
  const apps = await Application.find({ candidate: req.user._id }).populate('job');
  res.json(apps);
}));

// Company: view applications for a job you own
router.get('/job/:jobId', authenticate, requireRole('company'), asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.company.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  const apps = await Application.find({ job: job._id }).populate('candidate', 'name email');
  res.json(apps);
}));

// Company: update application status
router.patch('/:id/status', authenticate, requireRole('company'), statusUpdateValidator, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const app = await Application.findById(req.params.id).populate('job');
  if (!app) return res.status(404).json({ message: 'Application not found' });
  if (app.job.company.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  app.status = req.body.status;
  await app.save();
  res.json(app);
}));

export default router;