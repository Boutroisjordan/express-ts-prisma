// prisma/hooks/post-migration.js
import { PrismaClient, Role } from "@prisma/client";
import encryptPassword from "./Utils/encryptPassword";

export async function createAdmin() {
  const prisma = new PrismaClient();

  try {

    const hashedPassword = await encryptPassword("1234");
    // Créez un administrateur avec les détails appropriés
    await prisma.user.create({
      data: {
        username: 'admin',
        email: "admin@example.com",
        password: hashedPassword,
        role: Role.ADMIN
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
  } finally {
    await prisma.$disconnect();
  }
}
export async function createProducts() {
  const prisma = new PrismaClient();

  try {

    const hashedPassword = await encryptPassword("1234");
    // Créez un administrateur avec les détails appropriés
    await prisma.product.create({
      data: {
        name: 'Product 1',
        price: 12,
        reference: "LK?JNOJOINOL",
        description: "Description product 1",
        imagePath: "none"
      },
    });
    await prisma.product.create({
      data: {
        name: 'Product 2',
        price: 12,
        reference: "LK?JNOJOINOL",
        description: "Description product 1",
        imagePath: "none"
      },
    });
    await prisma.product.create({
      data: {
        name: 'Product 3',
        price: 12,
        reference: "LK?JNOJOINOL",
        description: "Description product 1",
        imagePath: "none"
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
  } finally {
    await prisma.$disconnect();
  }
}
export async function createClients() {
  const prisma = new PrismaClient();

  try {

    const hashedPassword = await encryptPassword("1234");
    // Créez un administrateur avec les détails appropriés
    await prisma.user.create({
      data: {
        username: 'user1',
        email: "user1@example.com",
        password: hashedPassword,
        role: Role.CLIENT

      },
    });
    await prisma.user.create({
      data: {
        username: 'user2',
        email: "use2@example.com",
        password: hashedPassword,
        role: Role.CLIENT

      },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
  } finally {
    await prisma.$disconnect();
  }
}
export async function createOrders() {
  const prisma = new PrismaClient();

  try {

    const productIds = [1, 2]
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const totalAmount = products.reduce((total, product) => total + product.price, 0);


    await prisma.order.create({
      data: {
        userId: 2,
        orderDate: new Date(),
        products: {
          connect: productIds.map((productId) => ({ id: productId })),
        },
        totalAmount
      },
    });
    await prisma.order.create({
      data: {
        userId: 3,
        orderDate: new Date(),
        products: {
          connect: productIds.map((productId) => ({ id: productId })),
        },
        totalAmount
      },
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
  } finally {
    await prisma.$disconnect();
  }
}



export async function initData() {
  const prisma = new PrismaClient();
  const admin = await prisma.user.findFirst({ where: { email: "admin@example.com" } });


  if (!admin) {
    await createAdmin();
    await createClients();
    await createProducts();
    await createOrders();
  }
  return;
}

