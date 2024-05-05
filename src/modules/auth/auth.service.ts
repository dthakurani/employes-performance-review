import { HttpStatus, Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { EntityManager, Repository } from 'typeorm';
import { BcryptService } from '../../utils/bcrypt';
import { CryptoService } from '../../utils/crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Session } from '../users/entities/session.entity';
import { v4 as uuidv4 } from 'uuid';
import { CustomException } from '../../utils/custom-exception';
import { IJwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private entityManager: EntityManager,
    private bcryptService: BcryptService,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
  ) {}

  async login(deviceAddress: string, body: UserLoginDto) {
    const data = await this.entityManager.transaction(async (entityManager) => {
      const uniqueDeviceName = uuidv4();

      const user = await this.userRepository.findOne({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        throw new CustomException().throwHttpError({
          message: 'User with this email not found!',
          errorKey: 'email',
          status: HttpStatus.NOT_FOUND,
        });
      }

      const passwordMatch = await this.bcryptService.comparePassword(
        body.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new CustomException().throwHttpError({
          message: 'Invalid password!',
          errorKey: 'password',
          status: HttpStatus.UNAUTHORIZED,
        });
      }

      delete (user as { password?: string }).password;

      const payload = {
        id: user.id,
        user: user,
        device_name: uniqueDeviceName,
      };

      const accessToken = this.cryptoService.encrypt(
        this.jwtService.sign({ ...payload }),
      );

      const refreshToken = this.cryptoService.encrypt(
        this.jwtService.sign(
          { ...payload },
          {
            expiresIn: this.configService.getOrThrow(
              'auth.jwtRefreshTokenExpiration',
              { infer: true },
            ),
          },
        ),
      );

      const session = this.sessionsRepository.create({
        userId: user.id,
        deviceAddress,
        deviceName: uniqueDeviceName,
        token: refreshToken,
      });

      await entityManager.save(session);

      return {
        ...user,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    });

    return data;
  }

  async getAccessToken(refreshToken: string) {
    const decryptedRefreshToken = this.cryptoService.decrypt(refreshToken);
    let token: IJwtPayload;

    try {
      token = await this.jwtService.verifyAsync(decryptedRefreshToken, {
        secret: this.configService.getOrThrow('auth.jwtSecret', {
          infer: true,
        }),
      });
    } catch (error) {
      throw new CustomException().throwHttpError({
        message: 'Token expired!',
        errorKey: 'refresh_token',
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const user = await this.userRepository.findOne({
      where: {
        id: token.id,
      },
    });

    if (!user) {
      throw new CustomException().throwHttpError({
        message: 'User not found!',
        errorKey: 'refresh_token',
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const session = await this.sessionsRepository.findOne({
      where: {
        deviceName: token.device_name,
        token: refreshToken,
      },
    });

    if (!session) {
      throw new CustomException().throwHttpError({
        message: 'Session not found!',
        errorKey: 'refresh_token',
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const payload = {
      id: user.id,
      user: user,
      device_name: token.device_name,
    };

    const accessToken = this.cryptoService.encrypt(
      this.jwtService.sign({ ...payload }),
    );

    return {
      accessToken,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new CustomException().throwHttpError({
        message: 'Refresh token required!',
        errorKey: 'refresh_token',
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const decryptedRefreshToken = this.cryptoService.decrypt(refreshToken);
    let token: IJwtPayload;

    try {
      token = await this.jwtService.verifyAsync(decryptedRefreshToken, {
        secret: this.configService.getOrThrow('auth.jwtSecret', {
          infer: true,
        }),
      });
    } catch (error) {
      throw new CustomException().throwHttpError({
        message: 'Token expired!',
        errorKey: 'refresh_token',
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    await this.sessionsRepository.delete({
      deviceName: token.device_name,
    });
  }
}
