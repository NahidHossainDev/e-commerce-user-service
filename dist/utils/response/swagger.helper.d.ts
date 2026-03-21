import { Type } from '@nestjs/common';
export declare function ApiWrappedResponse<TModel extends Type<unknown>>(options: {
    status: number;
    description: string;
    type: TModel;
}): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
