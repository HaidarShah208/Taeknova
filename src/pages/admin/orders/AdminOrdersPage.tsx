import { PageMeta } from '@components/layout/PageMeta';
import { OrdersManagement } from '@features/admin/orders/OrdersManagement';

export default function AdminOrdersPage() {
  return (
    <>
      <PageMeta title="Admin Orders" />
      <OrdersManagement />
    </>
  );
}
