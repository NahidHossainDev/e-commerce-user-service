"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiWrappedResponse = ApiWrappedResponse;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function ApiWrappedResponse(options) {
    const decorators = [
        (0, swagger_1.ApiResponse)({
            status: options.status,
            description: options.description,
            schema: {
                properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                        nullable: true,
                        example: null,
                        oneOf: [{ type: 'string' }, { type: 'null' }],
                    },
                    data: options.type
                        ? options.isArray
                            ? {
                                type: 'array',
                                items: { $ref: (0, swagger_1.getSchemaPath)(options.type) },
                            }
                            : { $ref: (0, swagger_1.getSchemaPath)(options.type) }
                        : { type: 'object', nullable: true, example: null },
                },
                required: ['success', 'data'],
            },
        }),
    ];
    if (options.type) {
        decorators.push((0, swagger_1.ApiExtraModels)(options.type));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
//# sourceMappingURL=swagger.helper.js.map