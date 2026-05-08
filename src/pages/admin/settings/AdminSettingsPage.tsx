import { PageMeta } from '@components/layout/PageMeta';
import { SettingsManagement } from '@features/admin/settings/SettingsManagement';

export default function AdminSettingsPage() {
  return (
    <>
      <PageMeta title="Admin Settings" />
      <SettingsManagement />
    </>
  );
}
