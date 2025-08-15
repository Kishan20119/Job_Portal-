import { body } from 'express-validator';

export const jobCreateValidator = [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('location').notEmpty(),
  body('salaryMin').optional().isNumeric(),
  body('salaryMax').optional().isNumeric(),
  body('skills').optional().isArray()
];

export const jobUpdateValidator = [
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('location').optional().notEmpty(),
  body('salaryMin').optional().isNumeric(),
  body('salaryMax').optional().isNumeric(),
  body('skills').optional().isArray(),
  body('isActive').optional().isBoolean()
];