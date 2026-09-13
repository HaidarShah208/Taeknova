type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Covers every backend `OrderStatus` value (PENDING/CONFIRMED/PROCESSING/SHIPPED/DELIVERED/CANCELLED). */
export function orderStatusTone(status: string): StatusTone {
  if (status === 'DELIVERED' || status === 'SHIPPED' || status === 'CONFIRMED' || status === 'PROCESSING') {
    return 'success';
  }
  if (status === 'CANCELLED') return 'danger';
  if (status === 'PENDING') return 'warning';
  return 'neutral';
}

/** Covers every backend `PaymentStatus` value (AWAITING/PAID/FAILED/REFUNDED). */
export function paymentStatusTone(status: string): StatusTone {
  if (status === 'PAID') return 'success';
  if (status === 'FAILED') return 'danger';
  if (status === 'AWAITING') return 'warning';
  if (status === 'REFUNDED') return 'info';
  return 'neutral';
}
