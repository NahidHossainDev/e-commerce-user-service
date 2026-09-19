import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/common/decorators";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { IAuthUser } from "src/common/interface";
import { ApiWrappedResponse } from "src/utils/response/swagger.helper";
import { ToggleWishlistDto } from "./dto/toggle-wishlist.dto";
import { UpdateNotifyDto } from "./dto/update-notify.dto";
import { MergeWishlistDto } from "./dto/merge-wishlist.dto";
import { WishlistPaginatedResponseDto } from "./dto/wishlist-response.dto";
import { WishlistService } from "./wishlist.service";

@ApiTags("Wishlist")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("wishlist")
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: "Get current user wishlist with product details" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiWrappedResponse({
    status: 200,
    description: "Wishlist retrieved successfully",
    type: WishlistPaginatedResponseDto,
  })
  async getWishlist(
    @CurrentUser() user: IAuthUser,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.wishlistService.getWishlist(user.id, Number(page) || 1, Number(limit) || 20);
  }

  @Get("ids")
  @ApiOperation({ summary: "Get all product IDs in user wishlist" })
  @ApiWrappedResponse({ status: 200, description: "Product ID array" })
  async getWishlistIds(@CurrentUser() user: IAuthUser) {
    return this.wishlistService.getWishlistIds(user.id);
  }

  @Post("toggle")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Toggle product in/out of wishlist" })
  @ApiWrappedResponse({ status: 200, description: "Toggle status result" })
  async toggleWishlist(
    @CurrentUser() user: IAuthUser,
    @Body() dto: ToggleWishlistDto,
  ) {
    return this.wishlistService.toggleWishlist(user.id, dto);
  }

  @Patch(":productId/notify")
  @ApiOperation({ summary: "Update out-of-stock notification alert (Notify Me)" })
  @ApiWrappedResponse({ status: 200, description: "Notification preference updated" })
  async updateNotify(
    @CurrentUser() user: IAuthUser,
    @Param("productId") productId: string,
    @Body() dto: UpdateNotifyDto,
  ) {
    return this.wishlistService.updateNotifyPreference(user.id, productId, dto);
  }

  @Post("merge")
  @ApiOperation({ summary: "Merge guest wishlist items into user account" })
  @ApiWrappedResponse({ status: 200, description: "Merged product IDs" })
  async mergeWishlist(
    @CurrentUser() user: IAuthUser,
    @Body() dto: MergeWishlistDto,
  ) {
    return this.wishlistService.mergeWishlist(user.id, dto);
  }

  @Delete(":productId")
  @ApiOperation({ summary: "Remove a specific product from wishlist" })
  @ApiWrappedResponse({ status: 200, description: "Item removed" })
  async removeItem(
    @CurrentUser() user: IAuthUser,
    @Param("productId") productId: string,
  ) {
    return this.wishlistService.removeItem(user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: "Clear all items from wishlist" })
  @ApiWrappedResponse({ status: 200, description: "Wishlist cleared" })
  async clearWishlist(@CurrentUser() user: IAuthUser) {
    return this.wishlistService.clearWishlist(user.id);
  }
}
