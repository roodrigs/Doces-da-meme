import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() data: any) {
    return this.orderService.create(data);
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('client/:clientId')
  async findByClient(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.orderService.findByClient(clientId);
  }
}
