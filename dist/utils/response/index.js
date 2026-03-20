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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalResponseTransformer = exports.ResponseDto = exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rxjs_1 = require("rxjs");
const errors_1 = require("../errors");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        let errorResponse;
        if (exception instanceof errors_1.ApiError) {
            errorResponse = {
                statusCode: exception.statusCode,
                message: exception.message,
                errorMsg: [],
            };
        }
        else if (exception instanceof common_1.BadRequestException) {
            const response = exception.getResponse();
            if (typeof response === 'object' &&
                response !== null &&
                'message' in response) {
                const msg = response.message;
                if ((0, errors_1.isClassValidatorError)(msg)) {
                    errorResponse = (0, errors_1.handleValidationError)(msg);
                }
                else if ((0, errors_1.isStringArray)(msg)) {
                    errorResponse = {
                        statusCode: common_1.HttpStatus.BAD_REQUEST,
                        message: 'Validation Error',
                        errorMsg: msg.map((m) => ({ path: 'unknown', message: m })),
                    };
                }
                else {
                    errorResponse = {
                        statusCode: common_1.HttpStatus.BAD_REQUEST,
                        message: exception.message,
                        errorMsg: [],
                    };
                }
            }
            else {
                errorResponse = {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: exception.message,
                    errorMsg: [],
                };
            }
        }
        else if ((0, errors_1.isMongooseValidationError)(exception)) {
            errorResponse = (0, errors_1.handleMongooseValidationError)(exception);
        }
        else if ((0, errors_1.isMongooseCastError)(exception)) {
            errorResponse = (0, errors_1.handleCastError)(exception);
        }
        else if ((0, errors_1.isDuplicateKeyError)(exception)) {
            errorResponse = (0, errors_1.handleDuplicateKeyError)(exception);
        }
        else if (exception instanceof common_1.HttpException) {
            errorResponse = {
                statusCode: exception.getStatus(),
                message: exception.message,
                errorMsg: [],
            };
        }
        else {
            errorResponse = (0, errors_1.handleUnknownError)(exception);
        }
        res.status(errorResponse.statusCode).json(errorResponse);
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
class ResponseDto {
    success;
    data;
    message;
}
exports.ResponseDto = ResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], ResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], ResponseDto.prototype, "message", void 0);
let GlobalResponseTransformer = class GlobalResponseTransformer {
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => ({
            success: true,
            data: data ?? null,
            message: null,
        })));
    }
};
exports.GlobalResponseTransformer = GlobalResponseTransformer;
exports.GlobalResponseTransformer = GlobalResponseTransformer = __decorate([
    (0, common_1.Injectable)()
], GlobalResponseTransformer);
//# sourceMappingURL=index.js.map