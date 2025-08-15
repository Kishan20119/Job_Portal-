import express from 'express';
import { validationResult } from 'express-validator';
import { Job } from '../models/Job.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { jobCreateValidator, jobUpdateValidator } from '../validators/jobValidators.js';

const router = express.Router();

// Public: list/search jobs
router.get('/', asyncHandler(async (req, res) => {
  const { q, location, skills } = req.query;
  const filter = { isActive: true };
  const and = [];
  if (q) and.push({ $text: { $search: q } });
  if (location) and.push({ location: new RegExp(location, 'i') });
  if (skills) {
    const skillsArr = Array.isArray(skills) ? skills : String(skills).split(',').map(s => s.trim());
    and.push({ skills: { $in: skillsArr } });
  }
  if (and.length) filter.$and = and;
  const jobs = await Job.find(filter).sort({ createdAt: -1 }).populate('company', 'name email');
  res.json(jobs);
}));

// Public: get job by id
router.get('/:id', asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company', 'name email');
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
}));

// Company: create job
router.post('/', authenticate, requireRole('company'), jobCreateValidator, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const job = await Job.create({ ...req.body, company: req.user._id });
  res.status(201).json(job);
}));

// Company: update job (only owner)
router.patch('/:id', authenticate, requireRole('company'), jobUpdateValidator, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.company.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(job, req.body);
  await job.save();
  res.json(job);
}));

// Company: delete job (only owner)
router.delete('/:id', authenticate, requireRole('company'), asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.company.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  await job.deleteOne();
  res.json({ message: 'Job deleted' });
}));

export default router;