import prisma from "../../../prisma"
import { Product, User } from "@prisma/client";
import { ProductDto } from "../../../dtos/product.dto";
import { NotFoundError } from "../../errors/NotFoundError";
import path from "path";
import fs from "fs"


export async function findAll(): Promise<Array<Product>> {
  try {
    const products = await prisma.product.findMany();

    if (!products || products.length === 0) throw new NotFoundError('Product');

    return products;
  } catch (e: any) {
    if (e instanceof NotFoundError) throw new NotFoundError(e.message)
    throw new Error('Internal server error');
  }
}

export async function createProduct(product: ProductDto, imagePath: string): Promise<Product> {
  try {
    if (typeof product.price == 'string') product.price = parseInt(product.price)
    const newProduct = await prisma.product.create({
      data: {
        ...product,
        imagePath
      },
    });
    return newProduct;

  } catch (e: any) {
    throw new Error('Internal server error');
  }

}
export async function updateProduct(id: number, product: ProductDto): Promise<Product> {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundError("Product");
    }

    if (typeof product.price == 'string') product.price = parseInt(product.price)
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...product,
      },
    });

    return updatedProduct;

  } catch (e: any) {
    if (e instanceof NotFoundError) throw new NotFoundError(e.message)
    throw new Error('Internal server error');
  }

}

export async function updateProductImage(id: number, imagePath: string): Promise<Product> {

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundError("Product");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        imagePath,
      },
    });

    return updatedProduct;

  } catch (e: any) {
    if (e instanceof NotFoundError) throw new NotFoundError(e.message)
    throw new Error('Internal server error');
  }

}

export async function findById(id: number): Promise<Product> {
  try {

    const product = await prisma.product.findUnique({
      where: {
        id: id
      }
    })


    if (!product) throw new NotFoundError('Product')

    return product;
  } catch (error) {
    if (error instanceof NotFoundError) throw new NotFoundError(error.message)
    throw new Error('Internal server error');
  }
}

export async function deleteById(id: number): Promise<Product> {

  try {
    const product = prisma.product.findUnique({ where: { id } })

    if (!product) throw new NotFoundError("Product");

    const deletedProduct = prisma.product.delete({ where: { id } });

    return deletedProduct
  } catch (error) {
    if (error instanceof NotFoundError) throw new NotFoundError(error.message)
    throw new Error('Internal server error');
  }
}

export async function storeImage(image: Express.Multer.File): Promise<string> {
  try {
    const buffer: Buffer = image.buffer;
    const fileName: string = `${Date.now()}_${image.originalname}`;
    const cleanFileName = encodeURIComponent(fileName)
    const filePath: string = path.join('uploads', 'products', cleanFileName);

    const productsFolderPath: string = path.join('uploads', 'products');
    if (!fs.existsSync(productsFolderPath)) {
      fs.mkdirSync(productsFolderPath, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    return filePath;
  } catch (error) {
    throw new Error('Failed to store the image');
  }
}

export async function deleteStoredImage(imagePath: string): Promise<void> {
  try {
    const fullPath = path.join(__dirname, `../../../${imagePath}`);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

  } catch (error) {
    throw new Error('Error deleting image');
  }
}