import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const rolesToCheck = requiredRoles || [Role.Admin];

    const hasRole = rolesToCheck.some((role) => role === user.role);

    if (!hasRole) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
