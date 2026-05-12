import { useState } from 'react';
import { toast } from 'sonner';

import type { AdminUserRecord } from '@app-types/admin';
import { AdminCard, DataTable, StatusBadge } from '@components/admin';
import { Button } from '@components/ui/Button';
import { useAdminCreateAdminUserMutation } from '@redux/admin';

export function UsersManagement() {
  const [rows, setRows] = useState<AdminUserRecord[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createAdmin, { isLoading }] = useAdminCreateAdminUserMutation();

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
      setRows((prev) => [user, ...prev]);
      setFullName('');
      setEmail('');
      setPassword('');
      toast.success('Admin user created');
    } catch {
      toast.error('Could not create admin');
    }
  };

  return (
    <div className="space-y-6">
      <AdminCard
        title="Create admin user"
        description="There is no GET /users directory in the API yet. New admins appear in the table below after a successful create."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-slate-700">Full name</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3"
            />
          </label>
          <label className="text-sm">
            <span className="text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3"
            />
          </label>
        </div>
        <Button type="button" className="mt-4" onClick={() => void handleCreate()} isLoading={isLoading}>
          Create admin
        </Button>
      </AdminCard>

      <AdminCard title="Recently created (this session)" description="Rows returned from POST /users/admins.">
        <DataTable
          data={rows}
          getRowKey={(row) => row.id}
          emptyMessage="No admins created in this session yet."
          columns={[
            { key: 'name', header: 'Name', render: (row) => row.fullName },
            { key: 'email', header: 'Email', render: (row) => row.email },
            { key: 'role', header: 'Role', render: (row) => row.role },
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
      </AdminCard>
    </div>
  );
}
