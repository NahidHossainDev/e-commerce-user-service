import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/interface';
import { RoleStatus } from '../../modules/user-service/user/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // Collect all active roles from the user
    const activeRoles: UserRole[] = [];

    // Add primary role
    if (user.primaryRole) {
      activeRoles.push(user.primaryRole);
    }

    // Add other active roles
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((role) => {
        if (role.status === RoleStatus.ACTIVE && role.type) {
          activeRoles.push(role.type);
        }
      });
    }

    // Check if user has any of the required roles
    return requiredRoles.some((role) => activeRoles.includes(role));
  }
}
