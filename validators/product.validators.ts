import { check } from 'express-validator';

export const productValidator = [
  check('name').notEmpty().isString().withMessage('Name cannot be empty'),
  check('description').notEmpty().isString().withMessage('Description cannot be empty'),
  check("price").notEmpty().isInt().withMessage("Price must be an Int"),
  check("reference").notEmpty().isString().withMessage("Reference cannot be empty")
];


export const productUpdateValidator = [
  check('name').isString().withMessage('Name must be a String'),
  check('description').isString().withMessage('Description must be a string'),
  check("price").isInt().withMessage("Price must be an Int"),
  check("reference").isString().withMessage("Reference must be a string")
];
