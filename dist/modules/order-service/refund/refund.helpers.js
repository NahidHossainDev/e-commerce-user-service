"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStockDamaged = exports.isStockSellable = exports.shouldRestoreStock = exports.generateUniqueRefundId = exports.calculateTotalRefundAmount = exports.calculateRefundAmount = exports.checkEvidenceRequirements = exports.checkUserRefundLimits = exports.validateRefundItems = exports.checkExistingRefund = exports.validateRefundEligibility = exports.validateOrderOwnership = exports.generateRefundId = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const refund_constants_1 = require("./constants/refund.constants");
const refund_schema_1 = require("./schemas/refund.schema");
const refund_utils_1 = require("./utils/refund.utils");
const generateRefundId = () => {
    return (0, refund_utils_1.generateRefundId)();
};
exports.generateRefundId = generateRefundId;
const validateOrderOwnership = async (orderModel, orderId, userId) => {
    const order = await orderModel.findById(orderId);
    if (!order) {
        throw new common_1.NotFoundException(refund_constants_1.REFUND_ERROR_MESSAGES.ORDER_NOT_FOUND);
    }
    if (order.userId.toString() !== userId) {
        throw new common_1.UnauthorizedException(refund_constants_1.REFUND_ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    }
    return order;
};
exports.validateOrderOwnership = validateOrderOwnership;
const validateRefundEligibility = (order) => {
    if (!refund_constants_1.REFUNDABLE_ORDER_STATUSES.includes(order.status)) {
        throw new common_1.BadRequestException(refund_constants_1.REFUND_ERROR_MESSAGES.ORDER_NOT_ELIGIBLE);
    }
    const deliveredAt = order.deliveredAt || order.shippedAt;
    if (deliveredAt) {
        const daysSinceDelivery = Math.floor((Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceDelivery > refund_constants_1.REFUND_WINDOW_DAYS.STANDARD) {
            throw new common_1.BadRequestException(refund_constants_1.REFUND_ERROR_MESSAGES.REFUND_WINDOW_EXPIRED);
        }
    }
};
exports.validateRefundEligibility = validateRefundEligibility;
const checkExistingRefund = async (refundModel, orderId) => {
    const existingRefund = await refundModel.findOne({
        orderId,
        status: {
            $nin: [refund_schema_1.RefundStatus.REJECTED, refund_schema_1.RefundStatus.CANCELLED],
        },
    });
    if (existingRefund) {
        throw new common_1.ConflictException(refund_constants_1.REFUND_ERROR_MESSAGES.REFUND_ALREADY_EXISTS);
    }
};
exports.checkExistingRefund = checkExistingRefund;
const validateRefundItems = (refundItems, order) => {
    for (const refundItem of refundItems) {
        const orderItem = order.items.find((item) => item.productId.toString() === refundItem.productId);
        if (!orderItem) {
            throw new common_1.BadRequestException(`Product ${refundItem.productId} not found in order`);
        }
        if (refundItem.quantity > orderItem.quantity) {
            throw new common_1.BadRequestException(`Refund quantity exceeds ordered quantity for product ${refundItem.productId}`);
        }
    }
};
exports.validateRefundItems = validateRefundItems;
const checkUserRefundLimits = async (refundModel, userId) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const refundsThisMonth = await refundModel.find({
        userId: new mongoose_1.Types.ObjectId(userId),
        'timeline.requestedAt': { $gte: startOfMonth },
        status: { $ne: refund_schema_1.RefundStatus.REJECTED },
    });
    if (refundsThisMonth.length >= refund_constants_1.MAX_REFUNDS_PER_USER_PER_MONTH) {
        throw new common_1.BadRequestException('Monthly refund request limit exceeded');
    }
    const totalRefundedAmount = refundsThisMonth.reduce((sum, refund) => sum + refund.refundAmount.totalRefundAmount, 0);
    if (totalRefundedAmount >= refund_constants_1.MAX_REFUND_AMOUNT_PER_USER_PER_MONTH) {
        throw new common_1.BadRequestException('Monthly refund amount limit exceeded');
    }
};
exports.checkUserRefundLimits = checkUserRefundLimits;
const checkEvidenceRequirements = (dto) => {
    if (refund_constants_1.EVIDENCE_REQUIRED_REASONS.includes(dto.reason)) {
        if (!dto.evidence ||
            (!dto.evidence.images?.length &&
                !dto.evidence.videos?.length &&
                !dto.evidence.description)) {
            throw new common_1.BadRequestException(refund_constants_1.REFUND_ERROR_MESSAGES.INSUFFICIENT_EVIDENCE);
        }
    }
};
exports.checkEvidenceRequirements = checkEvidenceRequirements;
const calculateRefundAmount = (order, dto) => {
    let itemsTotal = 0;
    let shippingRefund = 0;
    const taxRefund = 0;
    if (dto.refundType === refund_schema_1.RefundType.FULL) {
        itemsTotal = order.billingInfo.totalAmount;
        shippingRefund = order.billingInfo.deliveryCharge || 0;
    }
    else if (dto.refundType === refund_schema_1.RefundType.PARTIAL) {
        const orderTotal = order.billingInfo.totalAmount;
        if (dto.items) {
            for (const refundItem of dto.items) {
                const orderItem = order.items.find((item) => item.productId.toString() === refundItem.productId);
                if (orderItem) {
                    itemsTotal +=
                        orderItem.total * (refundItem.quantity / orderItem.quantity);
                }
            }
        }
        if (orderTotal > 0) {
            shippingRefund =
                (itemsTotal / orderTotal) * (order.billingInfo.deliveryCharge || 0);
        }
    }
    else if (dto.refundType === refund_schema_1.RefundType.SHIPPING) {
        shippingRefund = order.billingInfo.deliveryCharge || 0;
    }
    const couponRefund = dto.refundType === refund_schema_1.RefundType.FULL
        ? order.billingInfo.couponDiscount || 0
        : 0;
    const walletRefund = dto.refundType === refund_schema_1.RefundType.FULL ? order.billingInfo.walletUsed || 0 : 0;
    const totalRefundAmount = itemsTotal + shippingRefund + taxRefund + couponRefund + walletRefund;
    return {
        itemsTotal,
        shippingRefund,
        taxRefund,
        couponRefund,
        walletRefund,
        processingFee: 0,
        restockingFee: 0,
        totalRefundAmount,
        currency: 'BDT',
    };
};
exports.calculateRefundAmount = calculateRefundAmount;
const calculateTotalRefundAmount = (refundAmount) => {
    return (refundAmount.itemsTotal +
        refundAmount.shippingRefund +
        refundAmount.taxRefund +
        refundAmount.couponRefund +
        refundAmount.walletRefund -
        refundAmount.processingFee -
        refundAmount.restockingFee);
};
exports.calculateTotalRefundAmount = calculateTotalRefundAmount;
const generateUniqueRefundId = async (refundModel) => {
    let refundId = '';
    let exists = true;
    while (exists) {
        refundId = (0, exports.generateRefundId)();
        const existing = await refundModel.findOne({ refundId });
        exists = !!existing;
    }
    return refundId;
};
exports.generateUniqueRefundId = generateUniqueRefundId;
const shouldRestoreStock = (reason) => {
    return (refund_constants_1.RESTORE_TO_SELLABLE_INVENTORY.includes(reason) ||
        refund_constants_1.RESTORE_TO_DAMAGED_INVENTORY.includes(reason));
};
exports.shouldRestoreStock = shouldRestoreStock;
const isStockSellable = (reason) => {
    return refund_constants_1.RESTORE_TO_SELLABLE_INVENTORY.includes(reason);
};
exports.isStockSellable = isStockSellable;
const isStockDamaged = (reason) => {
    return refund_constants_1.RESTORE_TO_DAMAGED_INVENTORY.includes(reason);
};
exports.isStockDamaged = isStockDamaged;
//# sourceMappingURL=refund.helpers.js.map