import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

interface LocalRequest extends Request {
  user?: {
    roles: string[];
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('roles guard:', roles);
    if (!roles) {
      return true;
    }
    const request: LocalRequest = context.switchToHttp().getRequest();
    const user = request.user;
    const hasRole = () => {
      return user.roles.some((role: string) => roles.includes(role));
    };
    return user && user.roles && hasRole();
  }
}
