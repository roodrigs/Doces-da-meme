import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, imageUrl?: string) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description || '',
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        imageUrl: imageUrl || null,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        reviews: true
      }
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async update(id: number, data: any) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.price) updateData.price = parseFloat(data.price);
    if (data.stock) updateData.stock = parseInt(data.stock);
    if (data.imageUrl) updateData.imageUrl = data.imageUrl;

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
