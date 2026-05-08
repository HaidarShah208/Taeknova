import { PageMeta } from '@components/layout/PageMeta';
import { AnalyticsOverview } from '@features/admin/analytics/AnalyticsOverview';

export default function AdminAnalyticsPage() {
  return (
    <>
      <PageMeta title="Admin Analytics" />
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">
            Revenue trend, conversion, and performance insights.
          </p>
        </header>
        <AnalyticsOverview />
      </div>
    </>
  );
}
