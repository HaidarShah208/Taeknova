import { PageMeta } from '@components/layout/PageMeta';
import { DashboardOverview } from '@features/admin/dashboard/DashboardOverview';

export default function AdminDashboardPage() {
  return (
    <>
      <PageMeta title="Admin Dashboard" />
      <DashboardOverview />
    </>
  );
}
