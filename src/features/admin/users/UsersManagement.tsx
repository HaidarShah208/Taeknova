import { AdminCard, DataTable, StatusBadge } from '@components/admin';
import { ADMIN_USERS } from '@features/admin/data/mockAdminData';

export function UsersManagement() {
  return (
    <AdminCard title="Users Management" description="Control admin roles, access, and activity state.">
      <DataTable
        data={ADMIN_USERS}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'name', header: 'Name', render: (row) => row.name },
          { key: 'email', header: 'Email', render: (row) => row.email },
          { key: 'role', header: 'Role', render: (row) => row.role },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <StatusBadge
                label={row.status}
                tone={row.status === 'active' ? 'success' : 'neutral'}
              />
            ),
          },
        ]}
      />
    </AdminCard>
  );
}
