import { PaymentStatus } from '../enums/payment-status.ts';

export const paymentStatusRecord: Record<PaymentStatus, string> = {
    [PaymentStatus.PAID]: 'Paid',
    [PaymentStatus.UNPAID]: 'Unpaid',
};
