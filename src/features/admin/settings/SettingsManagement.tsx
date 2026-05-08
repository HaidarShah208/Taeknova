import { useState } from 'react';

import { AdminCard } from '@components/admin';
import { Button } from '@components/ui/Button';
import { CategoryManagement } from '@features/admin/categories/CategoryManagement';

export function SettingsManagement() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [orderAutoAssign, setOrderAutoAssign] = useState(true);

  return (
    <div className="space-y-6">
      <AdminCard title="Platform Settings" description="Core operational controls.">
        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Maintenance Mode</p>
              <p className="text-xs text-slate-600">Temporarily pause customer checkout.</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(event) => setMaintenanceMode(event.target.checked)}
              className="h-4 w-4 accent-accent"
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Auto-assign Orders</p>
              <p className="text-xs text-slate-600">Route incoming orders to available managers.</p>
            </div>
            <input
              type="checkbox"
              checked={orderAutoAssign}
              onChange={(event) => setOrderAutoAssign(event.target.checked)}
              className="h-4 w-4 accent-secondary"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Save settings</Button>
        </div>
      </AdminCard>

      <AdminCard title="Category Management" description="Manage product categories used across the catalog.">
        <CategoryManagement />
      </AdminCard>
    </div>
  );
}
