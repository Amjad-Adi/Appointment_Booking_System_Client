import { PaymentMethod } from '../enums/payment-method.ts';

export const paymentMethodRecord: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: 'Cash',
    [PaymentMethod.VISA]: 'Visa',
};
