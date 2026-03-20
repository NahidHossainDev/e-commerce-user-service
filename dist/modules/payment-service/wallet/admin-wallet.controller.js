"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWalletController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const interface_1 = require("../../../common/interface");
const wallet_dto_1 = require("./dto/wallet.dto");
const wallet_service_1 = require("./wallet.service");
let AdminWalletController = class AdminWalletController {
    walletService;
    constructor(walletService) {
        this.walletService = walletService;
    }
    async getSummary() {
        return await this.walletService.getAdminWalletStats();
    }
    async findAll(query) {
        return await this.walletService.findAllWallets(query);
    }
    async findAllTransactions(query) {
        return await this.walletService.findAllTransactions(query);
    }
    async findOne(userId) {
        return await this.walletService.getWalletSummary(userId);
    }
    async adjustBalance(userId, dto, admin) {
        return await this.walletService.adjustBalance(userId, dto, admin.id);
    }
};
exports.AdminWalletController = AdminWalletController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get global wallet statistics' }),
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminWalletController.prototype, "getSummary", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List all user wallets' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_dto_1.AdminWalletQueryDto]),
    __metadata("design:returntype", Promise)
], AdminWalletController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get global transaction history' }),
    (0, common_1.Get)('transactions'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_dto_1.WalletTransactionQueryDto]),
    __metadata("design:returntype", Promise)
], AdminWalletController.prototype, "findAllTransactions", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get specific user wallet details' }),
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminWalletController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Manually adjust user balance' }),
    (0, common_1.Post)(':userId/adjust'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, wallet_dto_1.BalanceAdjustmentDto, Object]),
    __metadata("design:returntype", Promise)
], AdminWalletController.prototype, "adjustBalance", null);
exports.AdminWalletController = AdminWalletController = __decorate([
    (0, swagger_1.ApiTags)('Admin Wallet'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(interface_1.UserRole.ADMIN, interface_1.UserRole.SUPER_ADMIN),
    (0, common_1.Controller)('admin/wallet'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], AdminWalletController);
//# sourceMappingURL=admin-wallet.controller.js.map