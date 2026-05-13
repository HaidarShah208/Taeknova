import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { AdminCard, ConfirmModal, DataTable, Pagination, SearchBar, StatusBadge } from '@components/admin';
import { useAdminListUsersQuery, useAdminRemoveUserMutation } from '@redux/admin';

export function UsersManagement() {
  const PAGE_SIZE = 10;
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: rows = [], isLoading, isError, refetch } = useAdminListUsersQuery();
  const [removeUser, { isLoading: isRemoving }] = useAdminRemoveUserMutation();

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows
      .filter((row) => row.role === 'USER')
      .filter((row) => {
        if (!term) return true;
        return row.fullName.toLowerCase().includes(term) || row.email.toLowerCase().includes(term);
      });
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const visibleRows = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page, totalPages]);

  const deletingUser = useMemo(
    () => rows.find((row) => row.id === deletingUserId) ?? null,
    [rows, deletingUserId],
  );

  const handleRemoveUser = async () => {
    if (!deletingUserId) return;
    try {
      await removeUser(deletingUserId).unwrap();
      toast.success('User account removed');
      setDeletingUserId(null);
    } catch {
      toast.error('Could not remove user account');
    }
  };

  return (
    <div className="space-y-6">
   

      <AdminCard
        title="Customer users"
        description="Only role USER accounts are listed here. Removed users cannot log in afterwards."
      >
        <div className="mb-4 grid gap-3 sm:max-w-md">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by name or email"
          />
        </div>
        {isError ? <p className="mb-3 text-sm text-red-700">Could not load users.</p> : null}
        {isLoading ? (
          <p className="text-sm text-slate-600">Loading users…</p>
        ) : (
        <DataTable
          data={visibleRows}
          getRowKey={(row) => row.id}
          emptyMessage="No customer users found."
          columns={[
            { key: 'name', header: 'Name', render: (row) => row.fullName },
            { key: 'email', header: 'Email', render: (row) => row.email },
            { key: 'role', header: 'Role', render: (row) => row.role },
            {
              key: 'createdAt',
              header: 'Joined',
              render: (row) => new Date(row.createdAt).toLocaleDateString(),
            },
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
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <button
                  type="button"
                  disabled={!row.isActive}
                  onClick={() => setDeletingUserId(row.id)}
                  className="rounded-md border border-red-200 p-1.5 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Remove ${row.fullName}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ),
            },
          ]}
        />
        )}
        <div className="mt-4 border-t border-border pt-3">
          <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} onChange={setPage} />
        </div>
        {isError ? (
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 text-sm font-semibold text-primary underline"
          >
            Retry
          </button>
        ) : null}
      </AdminCard>
      <ConfirmModal
        isOpen={Boolean(deletingUser)}
        title="Remove user account"
        description={
          deletingUser
            ? `${deletingUser.fullName} (${deletingUser.email}) will no longer be able to log in.`
            : 'Selected user account will be removed.'
        }
        confirmLabel="Remove account"
        onClose={() => setDeletingUserId(null)}
        onConfirm={() => void handleRemoveUser()}
      />
      {isRemoving ? <p className="text-xs text-slate-500">Removing account…</p> : null}
    </div>
  );
}
