import express, { Router, Request, Response } from 'express';
import * as authServices from './auth.services';

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.post('/:id', this.updateById.bind(this));
    this.router.delete('/:id', this.deleteById.bind(this));
  }

  private async getById(req: Request, res: Response): Promise<void> {
    // Implémentation de la récupération par ID
  }

  private async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await authServices.login(email, password);

      if (!token) {
        throw new Error();
      }

      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({ message: 'Logged in successfully' });
    } catch (err: any) {
      res.status(401).send('Bad credentials');
    }
  }

  private async updateById(req: Request, res: Response): Promise<void> {
    // Implémentation de la mise à jour par ID
  }

  private async deleteById(req: Request, res: Response): Promise<void> {
    // Implémentation de la suppression par ID
  }
}

const authRouter = new AuthRouter().router;
export default authRouter;
