import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const trimmedEmail = email?.trim()?.toLowerCase();
    const trimmedPassword = password?.trim();
    
    // 1. Try to find in database first
    const user = await this.userService.findByEmail(trimmedEmail);

    if (user && user.password === trimmedPassword) {
      const { password, ...rest } = user;
      return rest;
    }

    // 2. Admin hardcoded fallback if not found in DB
    if (trimmedEmail === 'admin@browniedameme.com' && trimmedPassword === 'admin') {
      return { id: 0, name: 'Meme (Admin)', email: 'admin@browniedameme.com', role: 'SELLER' };
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,   
      role: user.role || 'CLIENT',
    };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role || 'CLIENT',
      name: user.name,
      sub: user.id,
      isAdmin: user.role === 'SELLER',
    };
  }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }

    const newUser = await this.userService.create({
      name,
      email,
      password,
      role: 'CLIENT',
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
