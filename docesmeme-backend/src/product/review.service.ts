import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(data: { rating: number; comment?: string; userId: number; productId: number }) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    return this.prisma.review.create({
      data,
      include: {
        user: {
          select: { name: true }
        }
      }
    });
  }

  async findByProduct(productId: number) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
