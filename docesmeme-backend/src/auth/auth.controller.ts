import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    try {
      return await this.authService.register(body.name, body.email, body.password);
    } catch (error) {
      throw new BadRequestException('Erro ao registrar usuário: ' + error.message);
    }
  }
}
