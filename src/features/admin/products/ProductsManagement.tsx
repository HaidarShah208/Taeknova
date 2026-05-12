import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { AdminProduct, ProductStatus } from '@app-types/admin';
import {
  AdminCard,
  ConfirmModal,
  DataTable,
  Filters,
  Pagination,
  ProductForm,
  type ProductFormValues,
  SearchBar,
  StatusBadge,
} from '@components/admin';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { useDebounce } from '@hooks/useDebounce';
import { formatPrice } from '@lib/formatters';
import {
  useAdminApproveProductMutation,
  useAdminCreateProductMutation,
  useAdminDeleteProductMutation,
  useAdminListCategoriesQuery,
  useAdminListProductsQuery,
  useAdminRejectProductMutation,
  useAdminUpdateProductMutation,
} from '@redux/admin';

const PAGE_SIZE = 10;

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return (base || 'product').slice(0, 160);
}

function sumVariantStock(p: AdminProduct): number {
  return (p.variants ?? []).reduce((s, v) => s + v.stockQuantity, 0);
}

function productToFormValues(p: AdminProduct): ProductFormValues {
  return {
    name: p.name,
    categoryId: p.categoryId,
    price: Number(p.basePrice),
    stock: sumVariantStock(p),
    status: p.status,
  };
}

function statusTone(s: ProductStatus): 'success' | 'warning' | 'danger' | 'neutral' {
  if (s === 'APPROVED') return 'success';
  if (s === 'PENDING') return 'warning';
  if (s === 'REJECTED') return 'danger';
  return 'neutral';
}

export function ProductsManagement() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350);
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: categories = [] } = useAdminListCategoriesQuery();
  const categoryOptions = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name })),
    [categories],
  );

  const listArg = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedQuery.trim() || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    [page, debouncedQuery, statusFilter],
  );

  const { data, isLoading, isFetching, isError, refetch } = useAdminListProductsQuery(listArg);
  const items = data?.items ?? [];
  const totalPages = Math.max(1, data?.pagination.pages ?? 1);

  const [createProduct, { isLoading: isCreating }] = useAdminCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useAdminUpdateProductMutation();
  const [deleteProduct] = useAdminDeleteProductMutation();
  const [approveProduct, { isLoading: isApproving }] = useAdminApproveProductMutation();
  const [rejectProduct, { isLoading: isRejecting }] = useAdminRejectProductMutation();

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    if (!values.categoryId) {
      toast.error('Select a category');
      return;
    }
    try {
      if (editing) {
        await updateProduct({
          productId: editing.id,
          body: {
            name: values.name,
            basePrice: values.price,
            categoryId: values.categoryId,
            status: values.status,
          },
        }).unwrap();
        toast.success('Product updated');
      } else {
        await createProduct({
          name: values.name,
          slug: `${slugify(values.name)}-${Date.now().toString(36)}`,
          basePrice: values.price,
          categoryId: values.categoryId,
          variants: [
            {
              size: 'Standard',
              color: 'Default',
              sku: `SKU-${Date.now().toString(36)}`,
              stockQuantity: values.stock,
            },
          ],
        }).unwrap();
        toast.success('Product created');
      }
      setFormOpen(false);
      setEditing(null);
    } catch {
      toast.error(editing ? 'Update failed' : 'Create failed');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteProduct(deletingId).unwrap();
      toast.success('Product deleted');
      setDeletingId(null);
    } catch {
      toast.error('Delete failed');
    }
  };

  const formInitial = useMemo((): ProductFormValues | undefined => {
    if (editing) return productToFormValues(editing);
    return {
      name: '',
      categoryId: categoryOptions[0]?.id ?? '',
      price: 0,
      stock: 0,
      status: 'PENDING',
    };
  }, [editing, categoryOptions]);

  return (
    <div className="space-y-6">
      <AdminCard
        title="Products"
        description="List, create, and update products from the admin API."
        action={
          <Button
            onClick={openCreate}
            leftIcon={<Plus className="h-4 w-4" />}
            disabled={!categoryOptions.length}
          >
            Add product
          </Button>
        }
      >
        {!categoryOptions.length ? (
          <p className="mb-4 text-sm text-amber-800">
            Create at least one category before adding products.
          </p>
        ) : null}

        {isError ? (
          <div className="mb-4 flex items-center gap-3">
            <p className="text-sm text-red-700">Failed to load products.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : null}

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full max-w-md">
            <SearchBar value={query} onChange={setQuery} placeholder="Search products..." />
          </div>
          <Filters
            label="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as typeof statusFilter)}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Rejected', value: 'REJECTED' },
            ]}
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading products…</p>
        ) : (
          <DataTable
            data={items}
            getRowKey={(row) => row.id}
            emptyMessage="No products match your filters."
            columns={[
              { key: 'name', header: 'Product', render: (row) => row.name },
              {
                key: 'category',
                header: 'Category',
                render: (row) => row.category?.name ?? '—',
              },
              {
                key: 'price',
                header: 'Price',
                render: (row) =>
                  formatPrice(Number(row.basePrice), {
                    currency: 'PKR',
                    locale: 'en-PK',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }),
              },
              {
                key: 'stock',
                header: 'Stock',
                render: (row) => String(sumVariantStock(row)),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => (
                  <StatusBadge label={row.status} tone={statusTone(row.status)} />
                ),
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="flex flex-wrap items-center gap-1">
                    {row.status === 'PENDING' ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          isLoading={isApproving}
                          onClick={async () => {
                            try {
                              await approveProduct(row.id).unwrap();
                              toast.success('Approved');
                            } catch {
                              toast.error('Approve failed');
                            }
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          isLoading={isRejecting}
                          onClick={async () => {
                            try {
                              await rejectProduct(row.id).unwrap();
                              toast.success('Rejected');
                            } catch {
                              toast.error('Reject failed');
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(row);
                        setFormOpen(true);
                      }}
                      className="rounded-md border border-slate-300 p-1.5 text-slate-700 transition-colors hover:bg-slate-100"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(row.id)}
                      className="rounded-md border border-red-200 p-1.5 text-red-600 transition-colors hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}

        <div className="mt-4">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
        {isFetching && !isLoading ? (
          <p className="mt-2 text-xs text-slate-500">Updating…</p>
        ) : null}
      </AdminCard>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Edit product' : 'Create product'}
      >
        <ProductForm
          categoryOptions={categoryOptions}
          initialValues={formInitial}
          onSubmit={(v) => void handleSubmit(v)}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          submitLabel={editing ? 'Update product' : 'Create product'}
        />
        {isCreating || isUpdating ? (
          <p className="mt-2 text-xs text-slate-500">Saving…</p>
        ) : null}
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete product"
        description="Are you sure you want to remove this product?"
        confirmLabel="Delete"
        onClose={() => setDeletingId(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
