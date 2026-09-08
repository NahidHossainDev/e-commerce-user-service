import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Order } from '../order/schemas/order.schema';
import { CouponService } from './coupon.service';
import { CouponUsage } from './schemas/coupon-usage.schema';
import { Coupon, DiscountType } from './schemas/coupon.schema';

describe('CouponService', () => {
  let service: CouponService;
  let couponModel: any;
  let couponUsageModel: any;
  let orderModel: any;

  const mockPublicCoupon = {
    _id: new Types.ObjectId(),
    code: 'WELCOME10',
    name: 'Welcome 10% Off',
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    isActive: true,
    isPublic: true,
    isFirstOrderOnly: true,
    validFrom: new Date(Date.now() - 100000),
    validTo: new Date(Date.now() + 100000),
    usageLimit: 0,
    usageCount: 0,
    usageLimitPerUser: 1,
    minOrderAmount: 100,
  };

  const mockGeneralPublicCoupon = {
    _id: new Types.ObjectId(),
    code: 'SAVE20',
    name: 'Save 20 Flat',
    discountType: DiscountType.FIXED_AMOUNT,
    discountValue: 20,
    isActive: true,
    isPublic: true,
    isFirstOrderOnly: false,
    validFrom: new Date(Date.now() - 100000),
    validTo: new Date(Date.now() + 100000),
    usageLimit: 100,
    usageCount: 5,
    usageLimitPerUser: 2,
    minOrderAmount: 50,
  };

  beforeEach(async () => {
    couponModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
    };

    couponUsageModel = {
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
    };

    orderModel = {
      countDocuments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponService,
        {
          provide: getModelToken(Coupon.name),
          useValue: couponModel,
        },
        {
          provide: getModelToken(CouponUsage.name),
          useValue: couponUsageModel,
        },
        {
          provide: getModelToken(Order.name),
          useValue: orderModel,
        },
      ],
    }).compile();

    service = module.get<CouponService>(CouponService);
  });

  describe('getAvailableCoupons for Guest', () => {
    it('should return public coupons and mark first-order coupon with login required', async () => {
      couponModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([mockPublicCoupon, mockGeneralPublicCoupon]),
        }),
      });

      const result = await service.getAvailableCoupons(undefined, 150);

      expect(couponModel.find).toHaveBeenCalledWith(
        expect.objectContaining({ isPublic: true, isActive: true }),
      );
      expect(result).toHaveLength(2);

      const firstOrder = result.find((c) => c.code === 'WELCOME10');
      expect(firstOrder?.isEligible).toBe(false);
      expect(firstOrder?.reasonIfNotEligible).toContain('Log in');

      const general = result.find((c) => c.code === 'SAVE20');
      expect(general?.isEligible).toBe(true);
      expect(general?.discountPreview).toBe(20);
    });
  });

  describe('getAvailableCoupons for Authenticated User', () => {
    it('should mark first-order coupon eligible for new user with 0 orders', async () => {
      const userId = new Types.ObjectId().toString();

      orderModel.countDocuments.mockResolvedValue(0);
      couponModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([mockPublicCoupon, mockGeneralPublicCoupon]),
        }),
      });
      couponUsageModel.aggregate.mockResolvedValue([]);

      const result = await service.getAvailableCoupons(userId, 200);

      expect(orderModel.countDocuments).toHaveBeenCalled();
      const firstOrder = result.find((c) => c.code === 'WELCOME10');
      expect(firstOrder?.isEligible).toBe(true);
      expect(firstOrder?.discountPreview).toBe(20); // 10% of 200
    });

    it('should mark first-order coupon ineligible for user with existing orders', async () => {
      const userId = new Types.ObjectId().toString();

      orderModel.countDocuments.mockResolvedValue(2); // user has 2 orders
      couponModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([mockPublicCoupon, mockGeneralPublicCoupon]),
        }),
      });
      couponUsageModel.aggregate.mockResolvedValue([]);

      const result = await service.getAvailableCoupons(userId, 200);

      const firstOrder = result.find((c) => c.code === 'WELCOME10');
      expect(firstOrder?.isEligible).toBe(false);
      expect(firstOrder?.reasonIfNotEligible).toContain('first order');
    });
  });

  describe('validateCoupon', () => {
    it('should reject first-order coupon if user has previous orders', async () => {
      const userId = new Types.ObjectId().toString();
      couponModel.findOne.mockReturnValue({
        session: jest.fn().mockResolvedValue(mockPublicCoupon),
      });
      orderModel.countDocuments.mockResolvedValue(1);

      await expect(
        service.validateCoupon({
          code: 'WELCOME10',
          userId,
          orderAmount: 150,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
