import { AdminCard, DataTable, StatusBadge } from '@components/admin';

export function OrdersManagement() {
  return (
    <AdminCard
      title="Order management"
      description="There is no admin-scoped orders list API in this backend yet. Customer orders use GET /orders for the signed-in user only."
    >
      <DataTable
        data={[]}
        getRowKey={() => 'none'}
        emptyMessage="No admin order feed available. Add an admin endpoint (e.g. list all orders) and wire it here."
        columns={[
          { key: 'id', header: 'Order', render: () => '—' },
          { key: 'customer', header: 'Customer', render: () => '—' },
          { key: 'status', header: 'Status', render: () => <StatusBadge label="—" tone="neutral" /> },
        ]}
      />
    </AdminCard>
  );
}
