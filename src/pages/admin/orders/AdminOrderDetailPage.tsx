import { PageMeta } from '@components/layout/PageMeta';
import { OrderDetailView } from '@features/admin/orders/OrderDetailView';

export default function AdminOrderDetailPage() {
  return (
    <>
      <PageMeta title="Order details" />
      <OrderDetailView />
    </>
  );
}
