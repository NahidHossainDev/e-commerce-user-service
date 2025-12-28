import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { OrderDocument } from '../order/schemas/order.schema';
import {
  EVIDENCE_REQUIRED_REASONS,
  MAX_REFUND_AMOUNT_PER_USER_PER_MONTH,
  MAX_REFUNDS_PER_USER_PER_MONTH,
  REFUND_ERROR_MESSAGES,
  REFUND_WINDOW_DAYS,
  REFUNDABLE_ORDER_STATUSES,
  RESTORE_TO_DAMAGED_INVENTORY,
  RESTORE_TO_SELLABLE_INVENTORY,
} from './constants/refund.constants';
import { CreateRefundRequestDto } from './dto/refund.dto';
import {
  RefundAmount,
  RefundDocument,
  RefundReason,
  RefundStatus,
  RefundType,
} from './schemas/refund.schema';

export const generateRefundId = (): string => {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `REF-${randomDigits}`;
};

export const validateOrderOwnership = async (
  orderModel: Model<OrderDocument>,
  orderId: string,
  userId: string,
): Promise<OrderDocument> => {
  const order = await orderModel.findById(orderId);
  if (!order) {
    throw new NotFoundException(REFUND_ERROR_MESSAGES.ORDER_NOT_FOUND);
  }

  if (order.userId.toString() !== userId) {
    throw new UnauthorizedException(REFUND_ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  return order;
};

export const validateRefundEligibility = (order: OrderDocument): void => {
  if (!REFUNDABLE_ORDER_STATUSES.includes(order.status)) {
    throw new BadRequestException(REFUND_ERROR_MESSAGES.ORDER_NOT_ELIGIBLE);
  }

  const deliveredAt = order.deliveredAt || order.shippedAt;
  if (deliveredAt) {
    const daysSinceDelivery = Math.floor(
      (Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSinceDelivery > REFUND_WINDOW_DAYS.STANDARD) {
      throw new BadRequestException(
        REFUND_ERROR_MESSAGES.REFUND_WINDOW_EXPIRED,
      );
    }
  }
};

export const checkExistingRefund = async (
  refundModel: Model<RefundDocument>,
  orderId: Types.ObjectId,
): Promise<void> => {
  const existingRefund = await refundModel.findOne({
    orderId,
    status: {
      $nin: [RefundStatus.REJECTED, RefundStatus.CANCELLED],
    },
  });

  if (existingRefund) {
    throw new ConflictException(REFUND_ERROR_MESSAGES.REFUND_ALREADY_EXISTS);
  }
};

export const validateRefundItems = (
  refundItems: any[],
  order: OrderDocument,
): void => {
  for (const refundItem of refundItems) {
    const orderItem = order.items.find(
      (item) => item.productId.toString() === refundItem.productId,
    );

    if (!orderItem) {
      throw new BadRequestException(
        `Product ${refundItem.productId} not found in order`,
      );
    }

    if (refundItem.quantity > orderItem.quantity) {
      throw new BadRequestException(
        `Refund quantity exceeds ordered quantity for product ${refundItem.productId}`,
      );
    }
  }
};

export const checkUserRefundLimits = async (
  refundModel: Model<RefundDocument>,
  userId: string,
): Promise<void> => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const refundsThisMonth = await refundModel.find({
    userId: new Types.ObjectId(userId),
    'timeline.requestedAt': { $gte: startOfMonth },
    status: { $ne: RefundStatus.REJECTED },
  });

  if (refundsThisMonth.length >= MAX_REFUNDS_PER_USER_PER_MONTH) {
    throw new BadRequestException('Monthly refund request limit exceeded');
  }

  const totalRefundedAmount = refundsThisMonth.reduce(
    (sum, refund) => sum + refund.refundAmount.totalRefundAmount,
    0,
  );

  if (totalRefundedAmount >= MAX_REFUND_AMOUNT_PER_USER_PER_MONTH) {
    throw new BadRequestException('Monthly refund amount limit exceeded');
  }
};

export const checkEvidenceRequirements = (
  dto: CreateRefundRequestDto,
): void => {
  if (EVIDENCE_REQUIRED_REASONS.includes(dto.reason)) {
    if (
      !dto.evidence ||
      (!dto.evidence.images?.length &&
        !dto.evidence.videos?.length &&
        !dto.evidence.description)
    ) {
      throw new BadRequestException(
        REFUND_ERROR_MESSAGES.INSUFFICIENT_EVIDENCE,
      );
    }
  }
};

export const calculateRefundAmount = (
  order: OrderDocument,
  dto: CreateRefundRequestDto,
): RefundAmount => {
  let itemsTotal = 0;
  let shippingRefund = 0;
  const taxRefund = 0;

  if (dto.refundType === RefundType.FULL) {
    itemsTotal = order.billingInfo.totalAmount;
    shippingRefund = order.billingInfo.deliveryCharge || 0;
  } else if (dto.refundType === RefundType.PARTIAL) {
    const orderTotal = order.billingInfo.totalAmount;

    for (const refundItem of dto.items) {
      const orderItem = order.items.find(
        (item) => item.productId.toString() === refundItem.productId,
      );
      if (orderItem) {
        itemsTotal +=
          orderItem.total * (refundItem.quantity / orderItem.quantity);
      }
    }

    if (orderTotal > 0) {
      shippingRefund =
        (itemsTotal / orderTotal) * (order.billingInfo.deliveryCharge || 0);
    }
  } else if (dto.refundType === RefundType.SHIPPING) {
    shippingRefund = order.billingInfo.deliveryCharge || 0;
  }

  const couponRefund =
    dto.refundType === RefundType.FULL
      ? order.billingInfo.couponDiscount || 0
      : 0;
  const walletRefund =
    dto.refundType === RefundType.FULL
      ? order.billingInfo.walletCashAppliedAmount || 0
      : 0;

  const totalRefundAmount =
    itemsTotal + shippingRefund + taxRefund + couponRefund + walletRefund;

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
  } as RefundAmount;
};

export const calculateTotalRefundAmount = (
  refundAmount: RefundAmount,
): number => {
  return (
    refundAmount.itemsTotal +
    refundAmount.shippingRefund +
    refundAmount.taxRefund +
    refundAmount.couponRefund +
    refundAmount.walletRefund -
    refundAmount.processingFee -
    refundAmount.restockingFee
  );
};

export const generateUniqueRefundId = async (
  refundModel: Model<RefundDocument>,
): Promise<string> => {
  let refundId: string;
  let exists = true;

  while (exists) {
    refundId = generateRefundId();
    const existing = await refundModel.findOne({ refundId });
    exists = !!existing;
  }

  return refundId;
};

export const shouldRestoreStock = (reason: RefundReason): boolean => {
  return (
    RESTORE_TO_SELLABLE_INVENTORY.includes(reason) ||
    RESTORE_TO_DAMAGED_INVENTORY.includes(reason)
  );
};

export const isStockSellable = (reason: RefundReason): boolean => {
  return RESTORE_TO_SELLABLE_INVENTORY.includes(reason);
};

export const isStockDamaged = (reason: RefundReason): boolean => {
  return RESTORE_TO_DAMAGED_INVENTORY.includes(reason);
};
