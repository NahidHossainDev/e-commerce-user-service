import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // If error or no user, return null (treat as guest) instead of throwing
    if (err || !user) {
      return null;
    }
    return user;
  }
}
