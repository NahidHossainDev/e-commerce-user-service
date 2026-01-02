export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface IAuthUser {
  id: string;
  email?: string;
  primaryRole?: UserRole;
  roles?: string[]; // Includes other active roles if any
}
