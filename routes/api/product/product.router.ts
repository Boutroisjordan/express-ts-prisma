import express, { Request, Response, NextFunction } from 'express';
import prisma from '../../../prisma';
import * as productServices from './product.services';
import { ProductDto } from '../../../dtos/product.dto';
import { authenticateAndAuthorize } from '../../../Utils/passport';
import { Product } from '@prisma/client';
import { NotFoundError } from '../../errors/NotFoundErros';
import uploadManager from '../../../Utils/UploadManager';
import { productUpdateValidator, productValidator } from '../../../validators/product.validators';
import { validationResult } from 'express-validator';

class ProductRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', authenticateAndAuthorize(['ADMIN', 'GESTIONNAIRE', "CLIENT"]), this.getAllProducts.bind(this));
    this.router.get('/:id', authenticateAndAuthorize(['ADMIN', 'GESTIONNAIRE']), this.getProductById.bind(this));
    this.router.post('/', authenticateAndAuthorize(['ADMIN', 'GESTIONNAIRE']), uploadManager.getMiddleware('image'), productValidator, this.createProduct.bind(this));
    this.router.post('/file/:id', authenticateAndAuthorize(["ADMIN", "GESTIONNAIRE"]), uploadManager.getMiddleware('image'), this.updateProductImage.bind(this));
    this.router.patch('/:id', authenticateAndAuthorize(["ADMIN", "GESTIONNAIRE"]), productUpdateValidator, this.updateProduct.bind(this));
    this.router.delete('/:id', authenticateAndAuthorize(["ADMIN", "GESTIONNAIRE"]), this.deleteProduct.bind(this));
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
      const { id } = req.params;
      const prodcutId = parseInt(id)
      const product: Product = await productServices.findById(prodcutId);
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
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const newProduct: ProductDto = req.body;
      if (!req.file) {
        res.status(400).json({ message: "Bad Request: no file for product" });
        return; // Terminer la fonction ici après l'envoi de la réponse.
      }

      const image: Express.Multer.File = req.file;

        const imagePath = await productServices.storeImage(image);
        const result = await productServices.createProduct(newProduct, imagePath);
        res.status(201).json(result);

    } catch (error) {
      console.log("Image creation error: ", error)
      next(error);
    }
  }

  private async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const updatedProduct: ProductDto = req.body;
    const { id } = req.params;
    const productId: number = parseInt(id)

    try {
      const result = await productServices.updateProduct(productId, updatedProduct)
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  private async updateProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
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
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }
}

const productRouter = new ProductRouter().router;
export default productRouter;
