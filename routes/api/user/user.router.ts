import express, { Router, Response, Request, NextFunction } from 'express';
import prisma from '../../../prisma';
import * as userServices from './user.services';
import { User } from '@prisma/client';
import { authenticateAndAuthorize } from '../../../Utils/passport';
import { UserDto } from '../../../dtos/user.dto';

class UserRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getAllUsers.bind(this));
    // this.router.get('/', authenticateAndAuthorize(['ADMIN']), this.getAllUsers.bind(this));
    this.router.post('/', authenticateAndAuthorize(['ADMIN']), this.createUser.bind(this));
    this.router.patch('/:id', authenticateAndAuthorize(['ADMIN']), this.updateUser.bind(this));
    this.router.delete('/:id', authenticateAndAuthorize(['ADMIN']), this.deleteUser.bind(this));
  }

  private async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userServices.findAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }


  private async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser: User = req.body;
      const result = await userServices.createUser(newUser);
      res.status(200).json(result);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  private async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const updatedUser: UserDto = req.body;
    const { id } = req.params;
    const userId: number = parseInt(id);

    try {
      const result = await userServices.updateUser(userId, updatedUser);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  private async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const userId: number = parseInt(id);

    try {
      const result = await userServices.deleteUser(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

}

const userRouter = new UserRouter().router;
export default userRouter;
