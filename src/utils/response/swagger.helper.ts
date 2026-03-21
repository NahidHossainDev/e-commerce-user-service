import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Wraps an `@ApiResponse` decorator so that the documented schema reflects
 * the `GlobalResponseTransformer` envelope:
 *
 * ```json
 * {
 *   "success": true,
 *   "data": { ...actualDto },
 *   "message": null
 * }
 * ```
 *
 * Usage:
 * ```ts
 * @ApiWrappedResponse({ status: 200, description: '...', type: AuthResponseDto })
 * ```
 */
export function ApiWrappedResponse<TModel extends Type<unknown>>(options: {
  status: number;
  description: string;
  type: TModel;
  isArray?: boolean;
}) {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiResponse({
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
          data: options.isArray
            ? {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              }
            : { $ref: getSchemaPath(options.type) },
        },
        required: ['success', 'data'],
      },
    }),
  );
}
