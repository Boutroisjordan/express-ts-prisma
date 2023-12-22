// order.services.ts
import { Prisma, Order, User } from '@prisma/client';
import prisma from '../../../prisma';
import { NotFoundError } from '../../errors/NotFoundErros';

// Dans le service Order

export async function createOrder(userId: number, productIds: number[]): Promise<Order> {
  try {
    await validateUserId(userId);
    await validateProductIds(productIds);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });


    const totalAmount = products.reduce((total, product) => total + product.price, 0);


    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        orderDate: new Date(),
        products: {
          connect: productIds.map((productId) => ({ id: productId })),
        },
      },
      include: {
        products: true
      }
    });

    return order;
  } catch (error) {
    throw new Error('Failed to create order');
  }
}



export async function getAllOrder() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: true
      }
    });

    if (!orders) throw new NotFoundError("order");

    return orders
  } catch (error) {
    throw new Error('Error get orders')
  }
}

export async function getOrderById(orderId: number): Promise<Order | null> {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        products: true,
      },
    });

    return order;
  } catch (error) {
    throw new Error('Error fetching order by ID');
  }
}

export async function updateOrder(orderId: number, updatedOrderData: Prisma.OrderUpdateInput): Promise<Order> {
  try {


    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: updatedOrderData,
      include: {
        products: true,
      },
    });

    return updatedOrder;
  } catch (error) {
    throw new Error('Error updating order');
  }
}


export async function updateOrderProducts(orderId: number, productIds: number[]): Promise<Order | null> {
  try {
    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });

    if (!existingOrder) {
      throw new NotFoundError("Order not found");
    }
    await validateProductIds(productIds);


    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        products: {
          set: productIds.map((productId) => ({ id: productId })),
        },
      },
      include: {
        products: true,
      },
    });

    return order;
  } catch (error) {
    console.log("plus precis stp: ", error)
    throw new Error('Failed to update order products');
  }
}


export async function deleteOrder(orderId: number): Promise<Order> {
  try {
    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });

    if (!existingOrder) {
      throw new NotFoundError("Order not found");
    }

    const deletedOrder = await prisma.order.delete({
      where: {
        id: orderId,
      },
      include: {
        products: true,
      },
    });

    return deletedOrder;
  } catch (error) {
    throw new Error('Error deleting order');
  }
}

async function validateUserId(userId: number): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }
}

// Function to check if all productIds exist
async function validateProductIds(productIds: number[]): Promise<void> {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    throw new Error('One or more products not found');
  }
}

