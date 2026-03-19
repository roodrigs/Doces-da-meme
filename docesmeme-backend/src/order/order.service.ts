import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { clientId: number; items: { productId: number; quantity: number; price: number }[] }) {
    if (!data.clientId || !data.items || data.items.length === 0) {
      throw new BadRequestException('Dados do pedido incompletos.');
    }

    const total = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          clientId: Number(data.clientId),
          total: total,
          status: 'PAID', // In this simple store, we assume payment is confirmed
        },
      });

      for (const item of data.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: parseFloat(item.price.toString()),
          },
        });

        // Update stock
        await tx.product.update({
          where: { id: Number(item.productId) },
          data: {
            stock: {
              decrement: Number(item.quantity),
            },
          },
        });
      }

      return order;
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByClient(clientId: number) {
    return this.prisma.order.findMany({
      where: { clientId: Number(clientId) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
