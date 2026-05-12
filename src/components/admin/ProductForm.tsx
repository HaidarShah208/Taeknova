import { ImagePlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { ProductStatus } from '@app-types/admin';
import { Button } from '@components/ui/Button';

export interface ProductFormValues {
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  status: ProductStatus;
  /** Chosen file is uploaded after product create/update via admin image API. */
  imageFile: File | null;
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  categoryOptions: { id: string; name: string }[];
  /** Existing product images (edit); first is shown as current photo. */
  existingImageUrls?: string[];
  onSubmit: (values: ProductFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
  /** Shows spinner inside the submit button and disables the form actions. */
  isSubmitting?: boolean;
  /** When false, status is omitted (e.g. create flow where the API sets status). */
  showStatusField?: boolean;
}

const DEFAULT_VALUES: ProductFormValues = {
  name: '',
  categoryId: '',
  price: 0,
  stock: 0,
  status: 'PENDING',
  imageFile: null,
};

export function ProductForm({
  initialValues,
  categoryOptions,
  existingImageUrls = [],
  onSubmit,
  onCancel,
  submitLabel = 'Save product',
  isSubmitting = false,
  showStatusField = true,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues ?? DEFAULT_VALUES);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setValues(initialValues ?? DEFAULT_VALUES);
  }, [initialValues]);

  useEffect(() => {
    if (!values.imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(values.imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [values.imageFile]);

  const primaryExisting = existingImageUrls[0];

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
          disabled={isSubmitting}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary disabled:opacity-60"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-700">Category</span>
        <select
          value={values.categoryId}
          onChange={(event) => setValues((prev) => ({ ...prev, categoryId: event.target.value }))}
          required
          disabled={isSubmitting}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary disabled:opacity-60"
        >
          <option value="" disabled>
            Select category
          </option>
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-700">Price (PKR)</span>
        <input
          type="number"
          min={0}
          step="0.01"
          value={values.price}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, price: Number(event.target.value || 0) }))
          }
          required
          disabled={isSubmitting}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary disabled:opacity-60"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-700">Stock (default variant)</span>
        <input
          type="number"
          min={0}
          value={values.stock}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, stock: Number(event.target.value || 0) }))
          }
          required
          disabled={isSubmitting}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary disabled:opacity-60"
        />
      </label>

      <div className="space-y-2 sm:col-span-2">
        <span className="text-sm text-slate-700">Product photo</span>
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-3">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="" className="h-full w-full object-cover" />
              ) : primaryExisting ? (
                <img src={primaryExisting} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus className="h-8 w-8 text-slate-300" aria-hidden />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={isSubmitting}
              aria-label="Choose product image file"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setValues((prev) => ({ ...prev, imageFile: file }));
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => fileInputRef.current?.click()}
              >
                {primaryExisting || previewUrl ? 'Change image' : 'Choose from device'}
              </Button>
              {values.imageFile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-slate-600"
                  disabled={isSubmitting}
                  onClick={() => {
                    setValues((prev) => ({ ...prev, imageFile: null }));
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  leftIcon={<X className="h-3.5 w-3.5" />}
                >
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 sm:ml-auto sm:max-w-[220px]">
            JPEG, PNG, WebP or GIF. The image is stored after you save the product.
          </p>
        </div>
      </div>

      {showStatusField ? (
        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="text-slate-700">Status</span>
          <select
            value={values.status}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, status: event.target.value as ProductStatus }))
            }
            disabled={isSubmitting}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-primary disabled:opacity-60"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
      ) : null}

      <div className="flex items-center justify-end gap-2 sm:col-span-2">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
