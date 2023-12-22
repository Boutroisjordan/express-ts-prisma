import { check } from 'express-validator';

export const authValidator = [
  check('password').notEmpty().isString().withMessage('Username cannot be empty'),
  check('email').notEmpty().isEmail().withMessage('Invalid email format'),
];


