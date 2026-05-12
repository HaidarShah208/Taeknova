import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { ConfirmModal, DataTable, StatusBadge } from '@components/admin';
import {
  useAdminCreateCategoryMutation,
  useAdminDeleteCategoryMutation,
  useAdminListCategoriesQuery,
} from '@redux/admin';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 160);
}

export function CategoryManagement() {
  const { data = [], isLoading, isError, refetch } = useAdminListCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useAdminCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useAdminDeleteCategoryMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setName('');
    setSlug('');
    setDescription('');
    setIsActive(true);
  }, []);

  const openCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const finalSlug = (slug.trim() || slugify(trimmedName)).trim();
    if (trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    if (finalSlug.length < 2) {
      toast.error('Slug must be at least 2 characters');
      return;
    }
    try {
      await createCategory({
        name: trimmedName,
        slug: finalSlug,
        ...(description.trim() ? { description: description.trim() } : {}),
        isActive,
      }).unwrap();
      toast.success('Category created');
      setModalOpen(false);
      resetForm();
    } catch {
      toast.error('Could not create category (check slug is unique)');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCategory(deletingId).unwrap();
      toast.success('Category deleted');
      setDeletingId(null);
    } catch {
      toast.error('Could not delete category (it may be in use by products)');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Create categories here first — products require at least one category.
        </p>
        <Button type="button" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add category
        </Button>
      </div>

      {isError ? (
        <p className="text-sm text-red-700">Could not load categories.</p>
      ) : null}
      {isLoading ? (
        <p className="text-sm text-slate-600">Loading categories…</p>
      ) : (
        <DataTable
          data={data}
          getRowKey={(row) => row.id}
          emptyMessage="No categories yet. Use “Add category” above."
          columns={[
            { key: 'name', header: 'Category', render: (row) => row.name },
            { key: 'slug', header: 'Slug', render: (row) => row.slug },
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
                  onClick={() => setDeletingId(row.id)}
                  className="rounded-md border border-red-200 p-1.5 text-red-600 transition-colors hover:bg-red-50"
                  aria-label={`Delete ${row.name}`}
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
          className="text-sm font-semibold text-primary underline"
        >
          Retry
        </button>
      ) : null}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title="Add category"
        description="Slug must be unique (e.g. team-kits). Leave slug empty to generate from the name."
      >
        <div className="grid gap-3">
          <label className="text-sm">
            <span className="font-medium text-slate-800">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3"
              placeholder="e.g. Team kits"
            />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-800">Slug</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-sm"
              placeholder="Auto from name if empty"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="font-medium text-slate-800">Description (optional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-slate-800">Active</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => void handleSubmit()} isLoading={isCreating}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete category"
        description="This cannot be undone if no products use it. If products reference this category, the API will reject the delete."
        confirmLabel="Delete"
        onClose={() => setDeletingId(null)}
        onConfirm={() => void handleDelete()}
      />
      {isDeleting ? <p className="text-xs text-slate-500">Deleting…</p> : null}
    </div>
  );
}
