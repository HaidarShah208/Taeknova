import { DataTable, StatusBadge } from '@components/admin';
import { ADMIN_CATEGORIES } from '@features/admin/data/mockAdminData';

export function CategoryManagement() {
  return (
    <DataTable
      data={ADMIN_CATEGORIES}
      getRowKey={(row) => row.id}
      columns={[
        { key: 'name', header: 'Category', render: (row) => row.name },
        { key: 'products', header: 'Products', render: (row) => row.products },
        {
          key: 'status',
          header: 'Status',
          render: (row) => (
            <StatusBadge label={row.status} tone={row.status === 'active' ? 'success' : 'neutral'} />
          ),
        },
      ]}
    />
  );
}
