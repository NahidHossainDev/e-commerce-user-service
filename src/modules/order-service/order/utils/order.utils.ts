export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const random = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  return `ORD-${dateStr}-${random}`; // e.g. ORD-260915-84921
}

