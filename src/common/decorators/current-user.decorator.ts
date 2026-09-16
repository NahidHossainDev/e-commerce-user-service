import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserDocument } from 'src/modules/user-service/user/user.schema';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserDocument;
  },
);
