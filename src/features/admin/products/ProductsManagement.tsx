import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

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
import { CategoryManagement } from '@features/admin/categories/CategoryManagement';
import { ADMIN_PRODUCTS, type AdminProduct } from '@features/admin/data/mockAdminData';
import { formatPrice } from '@lib/formatters';

const PAGE_SIZE = 5;

export function ProductsManagement() {
  const [products, setProducts] = useState<AdminProduct[]>(ADMIN_PRODUCTS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = `${product.name} ${product.category}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [products, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleSubmit = (values: ProductFormValues) => {
    if (editing) {
      setProducts((prev) =>
        prev.map((item) => (item.id === editing.id ? { ...item, ...values } : item)),
      );
    } else {
      setProducts((prev) => [{ id: `p-${Date.now()}`, ...values }, ...prev]);
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <AdminCard
        title="Products CRUD"
        description="Manage listings, pricing, and publish state."
        action={
          <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Add Product
          </Button>
        }
      >
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
              { label: 'Active', value: 'active' },
              { label: 'Draft', value: 'draft' },
            ]}
          />
        </div>

        <DataTable
          data={paginated}
          getRowKey={(row) => row.id}
          columns={[
            { key: 'name', header: 'Product', render: (row) => row.name },
            { key: 'category', header: 'Category', render: (row) => row.category },
            { key: 'price', header: 'Price', render: (row) => formatPrice(row.price, { currency: 'PKR', locale: 'en-PK', minimumFractionDigits: 0, maximumFractionDigits: 0 }) },
            { key: 'stock', header: 'Stock', render: (row) => row.stock },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge label={row.status} tone={row.status === 'active' ? 'success' : 'warning'} />,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(row);
                      setFormOpen(true);
                    }}
                    className="rounded-md border border-white/10 p-1.5 text-slate-300 hover:bg-white/10"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(row.id)}
                    className="rounded-md border border-red-400/20 p-1.5 text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ),
            },
          ]}
        />

        <div className="mt-4">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </AdminCard>

      <AdminCard title="Category Management" description="Centralized product taxonomy for scalable catalogs.">
        <CategoryManagement />
      </AdminCard>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Product' : 'Create Product'}
      >
        <ProductForm
          initialValues={
            editing
              ? {
                  name: editing.name,
                  category: editing.category,
                  price: editing.price,
                  stock: editing.stock,
                  status: editing.status,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          submitLabel={editing ? 'Update Product' : 'Create Product'}
        />
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Product"
        description="Are you sure you want to remove this product?"
        confirmLabel="Delete"
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (!deletingId) return;
          setProducts((prev) => prev.filter((item) => item.id !== deletingId));
          setDeletingId(null);
        }}
      />
    </div>
  );
}
