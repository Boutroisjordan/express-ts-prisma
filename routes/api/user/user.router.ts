import express, { Router, Response, Request, NextFunction } from 'express';
import prisma from '../../../prisma';
import * as userServices from './user.services';
import { User } from '@prisma/client';
import passport from '../../../Utils/passport';

class UserRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getAllUsers.bind(this));
    this.router.get('/me', passport.authenticate('jwt', { session: false }), this.getMe.bind(this));
    this.router.post('/', this.createUser.bind(this));
    this.router.post('/:id', this.updateUser.bind(this));
    this.router.delete('/:id', this.deleteUser.bind(this));
  }

  private async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userServices.findAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  private async getMe(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('Hello');
    } catch (error) {
      // Gestion des erreurs
    }
  }

  private async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser: User = req.body;
      const result = await userServices.createUser(newUser);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  private updateUser(req: Request, res: Response): void {
    // Implementation de la mise à jour
  }

  private deleteUser(req: Request, res: Response): void {
    // Implementation de la suppression
  }
}

const userRouter = new UserRouter().router;
export default userRouter;
