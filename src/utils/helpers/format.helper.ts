export const formatCamelCase = (text: string): string => {
  if (!text) return '';

  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // insert space before capital letters
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // handle cases like "APIResponse"
    .toLowerCase();
};
