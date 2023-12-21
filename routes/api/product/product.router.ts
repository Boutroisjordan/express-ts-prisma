import express, { Request, Response, NextFunction } from 'express';
import prisma from '../../../prisma';
import * as productServices from './product.services';
import { ProductDto } from '../../../dtos/product.dto';
import passport from '../../../Utils/passport';
import { Product } from '@prisma/client';
import { NotFoundError } from '../../errors/NotFoundErros';
import multer, { Multer } from 'multer';
import { validationResult } from 'express-validator';
import uploadManager from '../../../Utils/UploadManager';

class ProductRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getAllProducts.bind(this));
    this.router.get('/:id', passport.authenticate('jwt', { session: false }), this.getProductById.bind(this));
    this.router.post('/', uploadManager.getMiddleware('image'), this.createProduct.bind(this));
    this.router.post('/:id', this.updateProduct.bind(this));
    this.router.post('/file/:id', uploadManager.getMiddleware('image'), this.updateProductImage.bind(this));
    this.router.delete('/:id', this.deleteProduct.bind(this));
  }

  private async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products: Array<Product> = await productServices.findAll();
      res.status(200).json(products);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  private async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.body;
      const product: Product = await productServices.findById(id);
      res.status(200).json(product);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  private async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newProduct: ProductDto = req.body;
      const image: Express.Multer.File | undefined = req.file;
      if (image && newProduct) {
        const imagePath = await productServices.storeImage(image);
        const result = await productServices.createProduct(newProduct, imagePath);
        res.status(201).json(result);
      } else {
        throw new Error('Invalid product or image');
      }
    } catch (error) {
      console.log("Image creation error: ", error)
      next(error);
    }
  }

  private async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {

    const updatedProduct: ProductDto = req.body;
    const { id } = req.params;
    const productId: number = parseInt(id)

    try {
      const result = await productServices.updateProduct(productId, updatedProduct)
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  private async updateProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const productId: number = parseInt(id);
      const image: Express.Multer.File | undefined = req.file;

      if (image) {
        const imagePath = await productServices.storeImage(image);
        const result = await productServices.updateProductImage(productId, imagePath);
        res.status(201).json(result);
      } else {
        throw new Error('Invalid image');
      }
    } catch (error) {
      next(error);
    }
  }


  private async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const productId: number = parseInt(id);

      const result = await productServices.deleteById(productId);
      const deleteImg = productServices.deleteStoredImage(result.imagePath);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

const productRouter = new ProductRouter().router;
export default productRouter;