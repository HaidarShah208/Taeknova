/** Aligned with shop filters and admin default variant — keep in sync with FilterSidebar. */
export const CATALOG_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;
export type CatalogSize = (typeof CATALOG_SIZES)[number];

export const CATALOG_COLOR_OPTIONS = [
  { name: 'Onyx', hex: '#3b3b3b' },
  { name: 'Crimson', hex: '#a40808' },
  { name: 'Cobalt', hex: '#003366' },
  { name: 'Emerald', hex: '#f4ede7' },
  { name: 'Slate', hex: '#c49b1e' },
] as const;

export type CatalogColorName = (typeof CATALOG_COLOR_OPTIONS)[number]['name'];

export const DEFAULT_CATALOG_SIZE: CatalogSize = 'M';
export const DEFAULT_CATALOG_COLOR: CatalogColorName = 'Onyx';
