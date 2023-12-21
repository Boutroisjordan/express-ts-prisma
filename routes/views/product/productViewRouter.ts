import express, { Request, Response, NextFunction } from 'express';
import * as productServices from '../../api/product/product.services';


class ProductViewRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/create', this.getCreateView.bind(this));
    this.router.get('/:id/edit', this.getUpdateView.bind(this));
  }

  private async getCreateView(req: Request, res: Response, next: NextFunction) {
    // return res.render('../../../Views/createProduct.ejs');
    return res.render('createProduct');
  }
  private async getUpdateView(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const prodcutId = parseInt(id)

    try {
      const product = await productServices.findById(prodcutId);
      console.log("hey ho: ", req.params)
      if (!product) {
        console.error("Error 777777");

        // Gérer le cas où le produit n'est pas trouvé
        res.status(404).send("Product not found");
        return;
      }
      console.error("Error 776777");

      res.render("updateProduct", { product });
    } catch (error) {
      console.error("Error in edit product route:", error);
      res.status(500).send("Internal server error");
    }
  }

}

const productViewRouter = new ProductViewRouter().router;
export default productViewRouter;
