"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaOptionsFactory = void 0;
const transformDocument = (ret, deleteTimestamps) => {
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
const schemaOptionsFactory = (collection, timestamps, deleteTimestamps = false) => {
    return {
        collection,
        timestamps,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => transformDocument(ret, deleteTimestamps),
        },
        toObject: {
            virtuals: true,
            transform: (_, ret) => transformDocument(ret, deleteTimestamps),
        },
    };
};
exports.schemaOptionsFactory = schemaOptionsFactory;
//# sourceMappingURL=modelOptionsFactory.js.map