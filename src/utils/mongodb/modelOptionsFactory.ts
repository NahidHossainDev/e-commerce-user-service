import { IModelOptions } from '@typegoose/typegoose/lib/types';

export const modelOptionsFactory = (
  collection: string,
  timestamps: boolean,
  deleteTimestamps = false,
): IModelOptions => {
  return {
    schemaOptions: {
      collection,
      timestamps,
      toJSON: {
        virtuals: true,
        transform: (_, ret: Record<string, unknown>) => {
          if ('_id' in ret) ret.id = ret._id;
          delete ret._id;
          delete ret.__v;

          if (deleteTimestamps) {
            if ('createdAt' in ret) delete ret.createdAt;
            if ('updatedAt' in ret) delete ret.updatedAt;
          }

          return ret;
        },
      },
      toObject: {
        virtuals: true,
        transform: (_, ret: Record<string, unknown>) => {
          if ('_id' in ret) ret.id = ret._id;
          delete ret._id;
          delete ret.__v;

          if (deleteTimestamps) {
            if ('createdAt' in ret) delete ret.createdAt;
            if ('updatedAt' in ret) delete ret.updatedAt;
          }

          return ret;
        },
      },
    },
  };
};
