import { CategoryManagement } from '@features/admin/categories/CategoryManagement';

export function SettingsManagement() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Categories used when you create products.</p>
      </header>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
        <CategoryManagement />
      </section>
    </div>
  );
}
