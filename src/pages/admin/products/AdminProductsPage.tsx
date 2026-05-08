import { PageMeta } from '@components/layout/PageMeta';
import { ProductsManagement } from '@features/admin/products/ProductsManagement';

export default function AdminProductsPage() {
  return (
    <>
      <PageMeta title="Admin Products" />
      <ProductsManagement />
    </>
  );
}
