import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { AdminCard, ConfirmModal, DataTable, StatusBadge } from '@components/admin';
import { Button } from '@components/ui/Button';
import {
  useAdminCreateAdminUserMutation,
  useAdminListUsersQuery,
  useAdminRemoveUserMutation,
} from '@redux/admin';

export function UsersManagement() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const { data: rows = [], isLoading, isError, refetch } = useAdminListUsersQuery();
  const [createAdmin, { isLoading: isCreatingAdmin }] = useAdminCreateAdminUserMutation();
  const [removeUser, { isLoading: isRemoving }] = useAdminRemoveUserMutation();

  const handleCreate = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      toast.error('Fill in all fields');
      return;
    }
    try {
      const user = await createAdmin({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();
      if (!user?.id) {
        toast.error('Unexpected response while creating admin');
        return;
      }
      setFullName('');
      setEmail('');
      setPassword('');
      toast.success('Admin user created');
    } catch {
      toast.error('Could not create admin');
    }
  };

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
        title="All users"
        description="All accounts from the user side and admin side. Removing an account blocks future login for that user."
      >
        {isError ? <p className="mb-3 text-sm text-red-700">Could not load users.</p> : null}
        {isLoading ? (
          <p className="text-sm text-slate-600">Loading users…</p>
        ) : (
        <DataTable
          data={rows}
          getRowKey={(row) => row.id}
          emptyMessage="No users found."
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
