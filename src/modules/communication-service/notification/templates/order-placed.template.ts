import { TemplateResult } from './verify-email.template';

export const orderPlacedTemplate = (data: {
  customerName: string;
  orderId: string;
  totalAmount: number;
}): TemplateResult => {
  return {
    subject: `Order Placed Successfully - #${data.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #28a745;">Thank you for your order, ${data.customerName}!</h2>
        <p>Your order <strong>#${data.orderId}</strong> has been placed successfully.</p>
        <p>Total Amount: <strong>$${data.totalAmount.toFixed(2)}</strong></p>
        <p>We'll notify you when your items are on their way!</p>
      </div>
    `,
    text: `Hi ${data.customerName}, your order #${data.orderId} for $${data.totalAmount.toFixed(2)} has been placed successfully.`,
  };
};
