import { Module } from "@nestjs/common";
import { AddressModule } from "./address/address.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { WishlistModule } from "./wishlist/wishlist.module";

@Module({
  imports: [AuthModule, UserModule, AddressModule, WishlistModule],
  exports: [AuthModule, UserModule, AddressModule, WishlistModule],
})
export class UserServiceModule {}
