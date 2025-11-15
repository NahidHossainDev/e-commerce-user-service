import { SchemaOptions } from 'mongoose';

const transformDocument = (
  ret: Record<string, any>,
  deleteTimestamps: boolean,
): Record<string, any> => {
  if (ret._id) {
    ret.id = String(ret._id);
  }
  delete ret._id;
  delete ret.__v;

  if (deleteTimestamps) {
    delete ret.createdAt;
    delete ret.updatedAt;
  }

  return ret;
};

export const schemaOptionsFactory = (
  collection: string,
  timestamps: boolean,
  deleteTimestamps = false,
): SchemaOptions => {
  return {
    collection,
    timestamps,
    toJSON: {
      virtuals: true,
      transform: (_, ret: Record<string, any>) =>
        transformDocument(ret, deleteTimestamps),
    },
    toObject: {
      virtuals: true,
      transform: (_, ret: Record<string, any>) =>
        transformDocument(ret, deleteTimestamps),
    },
  };
};
