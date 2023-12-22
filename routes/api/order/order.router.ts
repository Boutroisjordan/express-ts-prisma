import express, { Request, Response, NextFunction } from 'express';
import { authenticateAndAuthorize } from '../../../Utils/passport';
import * as orderServices from './order.services';
import { Prisma } from '@prisma/client';

class OrderRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', authenticateAndAuthorize(["ADMIN"]), this.getAllOrder.bind(this));
    this.router.post('/', authenticateAndAuthorize(["ADMIN", "CLIENT", "GESTIONNAIRE"]), this.createOrder.bind(this));
    this.router.get('/:id', authenticateAndAuthorize(["ADMIN", "GESTIONNAIRE"]), this.getOrderById.bind(this));
    this.router.patch('/:id', authenticateAndAuthorize(["ADMIN", "GESTIONNAIRE"]), this.updateOrder.bind(this));
    this.router.delete('/:id', authenticateAndAuthorize(["ADMIN", "GESTIONNAIRE"]), this.deleteOrder.bind(this));
  }

  private async getAllOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const order = await orderServices.getAllOrder();

      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
  private async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, productIds } = req.body;

      if (!userId || !productIds || !Array.isArray(productIds)) {
        throw new Error('Invalid request data');
      }

      const order = await orderServices.createOrder(userId, productIds);

      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  private async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.id, 10);
      const order = await orderServices.getOrderById(orderId);

      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      next(error);
    }
  }


  private async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { productIds } = req.body;
      const orderId: number = parseInt(id);
      const order = await orderServices.updateOrderProducts(orderId, productIds);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }



  private async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.id, 10);
      const deletedOrder = await orderServices.deleteOrder(orderId);
      res.status(200).json(deletedOrder);
    } catch (error) {
      next(error);
    }
  }
}

const orderRouter = new OrderRouter().router;
export default orderRouter;
