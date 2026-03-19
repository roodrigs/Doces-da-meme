import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const totalOrders = await this.prisma.order.count();
    
    const revenueResult = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    const productsCount = await this.prisma.product.count();

    const topSellingProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const topProducts = await Promise.all(
      topSellingProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true },
        });
        return {
          name: product?.name || 'Desconhecido',
          totalSold: item._sum.quantity,
        };
      })
    );

    return {
      totalRevenue: revenueResult._sum.total || 0,
      totalOrders,
      productsCount,
      topProducts,
    };
  }

  async getRevenueHistory() {
    // Basic revenue history grouping by day for the last 30 days
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const dailyRevenue = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
    });

    return Object.keys(dailyRevenue).map((date) => ({
      date,
      revenue: dailyRevenue[date],
    }));
  }
}
