import { PageMeta } from '@components/layout/PageMeta';
import { InventoryManagement } from '@features/admin/inventory/InventoryManagement';

export default function AdminInventoryPage() {
  return (
    <>
      <PageMeta title="Admin Inventory" />
      <InventoryManagement />
    </>
  );
}
