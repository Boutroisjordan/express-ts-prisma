import express, { Router, Request, Response, NextFunction } from 'express';
import * as authServices from './auth.services';
import { UserSignUpDto } from '../../../dtos/user.dto';
import { validationResult } from 'express-validator';
import { authSignUpValidator, authValidator } from '../../../validators/auth.validator';
import { userValidator } from '../../../validators/user.validator';
import { AlreadyTakenError } from '../../errors/AlreadyTakenError';

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/login', authValidator, this.login.bind(this));
    this.router.post('/signup', authSignUpValidator, this.signup.bind(this));
  }

  private async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const token = await authServices.login(email, password);

      res
        .status(200)
        .json({ message: 'Logged in successfully', token: token });
    } catch (err: any) {
      next(err)
    }
  }

  private async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
      const newUser: UserSignUpDto = req.body;
      const result = await authServices.signup(newUser);

      res
        .status(201)
        .json({ message: "successfully signUp", user: result });

    } catch (error: any) {
      next(error)
    }
  }


}

const authRouter = new AuthRouter().router;
export default authRouter;
