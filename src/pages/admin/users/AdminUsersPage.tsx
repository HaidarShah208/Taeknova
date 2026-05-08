import { PageMeta } from '@components/layout/PageMeta';
import { UsersManagement } from '@features/admin/users/UsersManagement';

export default function AdminUsersPage() {
  return (
    <>
      <PageMeta title="Admin Users" />
      <UsersManagement />
    </>
  );
}
