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
        <span className="text-slate-300">Name</span>
        <input
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          required
          className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-slate-100 outline-none focus:border-white/25"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-300">Category</span>
        <input
          value={values.category}
          onChange={(event) => setValues((prev) => ({ ...prev, category: event.target.value }))}
          required
          className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-slate-100 outline-none focus:border-white/25"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-300">Price (PKR)</span>
        <input
          type="number"
          min={0}
          value={values.price}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, price: Number(event.target.value || 0) }))
          }
          required
          className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-slate-100 outline-none focus:border-white/25"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-300">Stock</span>
        <input
          type="number"
          min={0}
          value={values.stock}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, stock: Number(event.target.value || 0) }))
          }
          required
          className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-slate-100 outline-none focus:border-white/25"
        />
      </label>

      <label className="space-y-1 text-sm sm:col-span-2">
        <span className="text-slate-300">Status</span>
        <select
          value={values.status}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, status: event.target.value as ProductFormValues['status'] }))
          }
          className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-slate-100 outline-none focus:border-white/25"
        >
          <option value="active" className="bg-[#12151c]">
            Active
          </option>
          <option value="draft" className="bg-[#12151c]">
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
