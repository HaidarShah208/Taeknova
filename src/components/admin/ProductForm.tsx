import { useEffect, useState } from 'react';

import { Button } from '@components/ui/Button';

export interface ProductFormValues {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'draft';
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const DEFAULT_VALUES: ProductFormValues = {
  name: '',
  category: 'Uniforms',
  price: 0,
  stock: 0,
  status: 'active',
};

export function ProductForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save product',
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues ?? DEFAULT_VALUES);

  useEffect(() => {
    setValues(initialValues ?? DEFAULT_VALUES);
  }, [initialValues]);

  return (
    <form
      className="grid gap-3 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      <label className="space-y-1 text-sm">
        <span className="text-slate-700">Name</span>
        <input
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          required
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-700">Category</span>
        <input
          value={values.category}
          onChange={(event) => setValues((prev) => ({ ...prev, category: event.target.value }))}
          required
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-700">Price (PKR)</span>
        <input
          type="number"
          min={0}
          value={values.price}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, price: Number(event.target.value || 0) }))
          }
          required
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-700">Stock</span>
        <input
          type="number"
          min={0}
          value={values.stock}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, stock: Number(event.target.value || 0) }))
          }
          required
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-1 text-sm sm:col-span-2">
        <span className="text-slate-700">Status</span>
        <select
          value={values.status}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, status: event.target.value as ProductFormValues['status'] }))
          }
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary"
        >
          <option value="active" className="bg-white text-slate-900">
            Active
          </option>
          <option value="draft" className="bg-white text-slate-900">
            Draft
          </option>
        </select>
      </label>

      <div className="flex items-center justify-end gap-2 sm:col-span-2">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
