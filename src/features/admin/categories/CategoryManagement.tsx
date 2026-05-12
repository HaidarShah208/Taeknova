import { DataTable, StatusBadge } from '@components/admin';
import { useAdminListCategoriesQuery } from '@redux/admin';

export function CategoryManagement() {
  const { data = [], isLoading, isError, refetch } = useAdminListCategoriesQuery();

  return (
    <div className="space-y-3">
      {isError ? (
        <p className="text-sm text-red-700">Could not load categories.</p>
      ) : null}
      {isLoading ? (
        <p className="text-sm text-slate-600">Loading categories…</p>
      ) : (
        <DataTable
          data={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: 'name', header: 'Category', render: (row) => row.name },
            { key: 'slug', header: 'Slug', render: (row) => row.slug },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <StatusBadge
                  label={row.isActive ? 'Active' : 'Inactive'}
                  tone={row.isActive ? 'success' : 'neutral'}
                />
              ),
            },
          ]}
        />
      )}
      {isError ? (
        <button
          type="button"
          onClick={() => void refetch()}
          className="text-sm font-semibold text-primary underline"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
