import { check } from 'express-validator';

export const authValidator = [
  check('password').notEmpty().isString().withMessage('Username cannot be empty'),
  check('email').notEmpty().isEmail().withMessage('Invalid email format'),
];

export const authSignUpValidator = [
  check('username').notEmpty().isString().withMessage('Username cannot be empty'),
  check('password').notEmpty().isString().withMessage('Email cannot be empty'),
  check('email').notEmpty().isEmail().withMessage('Invalid email format'),

];


