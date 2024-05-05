import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomException } from 'src/utils/custom-exception';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    try {
      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );

      if (!requiredRoles) {
        return true;
      }

      const userHasRole = requiredRoles.includes(user.role);

      if (!userHasRole) {
        throw new Error('You do not have permission to access this resource');
      }
    } catch (error) {
      throw new CustomException().throwHttpException({
        message: 'You do not have permission to access this resource!',
        messages: [error.message],
        status: 403,
      });
    }

    return true;
  }
}
