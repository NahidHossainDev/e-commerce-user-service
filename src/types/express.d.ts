import { UserDocument } from 'src/modules/user-service/user/user.schema';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserDocument {}

    interface Request {
      user?: UserDocument;
    }
  }
}
