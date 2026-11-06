import { Order } from '../enums/order.ts';

export const orderRecord: Record<Order, string> = {
    [Order.ASC]: 'Ascending',
    [Order.DESC]: 'Descending',
};
