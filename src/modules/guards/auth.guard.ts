import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../../utils/crypto';
import { CustomException } from '../../utils/custom-exception';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptService: CryptoService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      if (!token) {
        throw new Error('Bearer token is required');
      }

      const decryptedToken = this.cryptService.decrypt(token);

      request.auth = await this.jwtService.verifyAsync(decryptedToken, {
        secret: this.configService.getOrThrow('auth.jwtSecret', {
          infer: true,
        }),
      });

      if (!request.auth.device_name) {
        throw new Error('Invalid token');
      }

      const user = await this.userRepository.findOne({
        where: { id: request.auth.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      delete (user as { password?: string }).password;

      request['user'] = user;
    } catch (error) {
      console.log('✔️ ~ AuthGuard ~ canActivate ~ error:', error);
      throw new CustomException().throwHttpException({
        message: 'User authentication failed!',
        messages: [error.message],
        status: 401,
      });
    }

    return true;
  }
}
