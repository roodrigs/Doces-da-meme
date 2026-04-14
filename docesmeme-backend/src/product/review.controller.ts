import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: { rating: number; comment?: string; productId: number }) {
    return this.reviewService.create({
      ...body,
      userId: Number(req.user.userId || req.user.sub)
    });
  }

  @Get('product/:id')
  async getByProduct(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findByProduct(id);
  }
}
