import { body } from 'express-validator';

export const applyValidator = [
  body('coverLetter').optional().isString()
];

export const statusUpdateValidator = [
  body('status').isIn(['applied', 'review', 'interview', 'rejected', 'hired'])
];