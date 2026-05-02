"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCategoryTree = void 0;
const buildCategoryTree = (categories) => {
    const map = new Map();
    const roots = [];
    categories.forEach((category) => {
        const plainCategory = category && typeof category.toObject === 'function'
            ? category.toObject()
            : category;
        map.set(category._id.toString(), {
            ...plainCategory,
            children: [],
        });
    });
    categories.forEach((category) => {
        const categoryWithChildren = map.get(category._id.toString());
        const parentId = category.parentCategoryId?.toString();
        if (parentId && map.has(parentId)) {
            map.get(parentId).children.push(categoryWithChildren);
        }
        else {
            roots.push(categoryWithChildren);
        }
    });
    const sortTree = (nodes) => {
        nodes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        nodes.forEach((node) => {
            if (node.children && node.children.length > 0) {
                sortTree(node.children);
            }
        });
    };
    sortTree(roots);
    return roots;
};
exports.buildCategoryTree = buildCategoryTree;
//# sourceMappingURL=category.utils.js.map