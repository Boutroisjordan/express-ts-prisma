// validators/user.validator.ts

import { check } from 'express-validator';

export const userValidator = [
  check('username').notEmpty().withMessage('Username cannot be empty'),
  check('email').isEmail().withMessage('Invalid email format'),
  // Ajoutez d'autres validations pour les champs de l'utilisateur
];
