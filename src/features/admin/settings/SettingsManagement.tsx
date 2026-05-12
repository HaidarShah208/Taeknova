import { AdminCard } from '@components/admin';
import { CategoryManagement } from '@features/admin/categories/CategoryManagement';

export function SettingsManagement() {
  return (
    <div className="space-y-6">
      <AdminCard title="Platform settings" description="Feature flags and maintenance toggles are not backed by an API in this project yet.">
        <p className="text-sm text-slate-700">
          When you add settings endpoints, bind controls here. Until then, only category data below is
          live (same as elsewhere in the admin app).
        </p>
      </AdminCard>

      <AdminCard title="Category management" description="Manage product categories used across the catalog.">
        <CategoryManagement />
      </AdminCard>
    </div>
  );
}
