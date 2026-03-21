"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiWrappedResponse = ApiWrappedResponse;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function ApiWrappedResponse(options) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(options.type), (0, swagger_1.ApiResponse)({
        status: options.status,
        description: options.description,
        schema: {
            allOf: [
                {
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: {
                            nullable: true,
                            example: null,
                            oneOf: [{ type: 'string' }, { type: 'null' }],
                        },
                        data: { $ref: (0, swagger_1.getSchemaPath)(options.type) },
                    },
                    required: ['success', 'data'],
                },
            ],
        },
    }));
}
//# sourceMappingURL=swagger.helper.js.map