import { Category } from './schemas/category.schema';

/**
 * Best practice utility to build a nested category tree from a flat list of categories.
 * This is used for public-facing category navigation.
 */
export const buildCategoryTree = (categories: Category[]): Category[] => {
  const map = new Map<string, Category & { children: Category[] }>();
  const roots: Category[] = [];

  // First pass: Create a map of all categories and initialize children arrays
  categories.forEach((category) => {
    map.set(category._id.toString(), {
      ...(category instanceof Object ? category : (category as any).toObject()),
      children: [],
    });
  });

  // Second pass: Build the tree
  categories.forEach((category) => {
    const categoryWithChildren = map.get(category._id.toString())!;
    const parentId = category.parentCategory?.toString();

    if (parentId && map.has(parentId)) {
      map.get(parentId)!.children.push(categoryWithChildren);
    } else {
      roots.push(categoryWithChildren);
    }
  });

  // Sort by sortOrder at each level
  const sortTree = (nodes: any[]) => {
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
