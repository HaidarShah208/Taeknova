import type { Category, Product, ProductReview } from '@app-types/product';

const IMG = (id: number, w = 800, h = 800): string =>
  `https://picsum.photos/seed/tikwando-${id}/${w}/${h}`;

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'uniforms',
    name: 'Uniforms',
    description: 'Professional team uniforms engineered for performance and comfort.',
    image: IMG(101, 1200, 800),
    productCount: 28,
  },
  {
    id: 'cat-2',
    slug: 'hoodies',
    name: 'Hoodies',
    description: 'Premium fleece and performance hoodies for teams and supporters.',
    image: IMG(102, 1200, 800),
    productCount: 21,
  },
  {
    id: 'cat-3',
    slug: 't-shirts',
    name: 'T-shirts',
    description: 'Everyday and training tees with breathable, durable fabrics.',
    image: IMG(103, 1200, 800),
    productCount: 19,
  },
  {
    id: 'cat-4',
    slug: 'mugs',
    name: 'Mugs',
    description: 'Custom logo mugs for clubs, academies, and fan merchandise.',
    image: IMG(104, 1200, 800),
    productCount: 12,
  },
  {
    id: 'cat-5',
    slug: 'stickers',
    name: 'Stickers',
    description: 'Team branding sticker packs for kits, gear, and packaging.',
    image: IMG(105, 1200, 800),
    productCount: 15,
  },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Onyx', 'Crimson', 'Cobalt', 'Emerald', 'Ivory', 'Slate'];

const buildProduct = (
  index: number,
  category: Category,
  override: Partial<Product> = {},
): Product => {
  const id = `prod-${index}`;
  const price = 49 + ((index * 7) % 80);
  const compare = price + 20 + ((index * 3) % 40);
  const rating = Math.round((3.6 + ((index * 13) % 14) / 10) * 10) / 10;
  return {
    id,
    slug: `${category.slug}-uniform-${index}`,
    title: `${category.name} Pro ${index < 10 ? 'Series' : 'Elite'} Kit ${String.fromCharCode(65 + (index % 26))}`,
    subtitle: 'Performance-grade team uniform',
    description:
      'Engineered with moisture-wicking, four-way stretch fabric for unrestricted movement on game day. Reinforced stitching, breathable mesh panels, and team-customizable trims.',
    brand: 'Tikwando',
    categoryId: category.id,
    categorySlug: category.slug,
    price,
    comparePrice: compare,
    currency: 'USD',
    rating,
    reviewsCount: 12 + ((index * 17) % 240),
    inStock: index % 11 !== 0,
    images: [
      { url: IMG(200 + index, 1200, 1200), alt: `${category.name} uniform ${index} front` },
      { url: IMG(400 + index, 1200, 1200), alt: `${category.name} uniform ${index} back` },
      { url: IMG(600 + index, 1200, 1200), alt: `${category.name} uniform ${index} detail` },
      { url: IMG(800 + index, 1200, 1200), alt: `${category.name} uniform ${index} action` },
    ],
    variants: SIZES.flatMap((size, sIdx) =>
      COLORS.slice(0, 4).map((color, cIdx) => ({
        id: `${id}-${size}-${color}`,
        size,
        color,
        sku: `${id}-${sIdx}${cIdx}`,
        stock: 10 + ((index * 7 + sIdx + cIdx) % 90),
      })),
    ),
    tags: [category.slug, 'team', 'performance', index % 2 ? 'breathable' : 'lightweight'],
    badges: index % 5 === 0 ? ['New'] : index % 7 === 0 ? ['Limited'] : undefined,
    isNew: index % 5 === 0,
    isBestseller: index % 6 === 0,
    createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
    ...override,
  };
};

export const MOCK_PRODUCTS: Product[] = MOCK_CATEGORIES.flatMap((cat, ci) =>
  Array.from({ length: 8 }, (_, i) => buildProduct(ci * 8 + i + 1, cat)),
);

export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    author: 'Marcus T.',
    rating: 5,
    title: 'Premium feel, championship quality',
    body: 'The fabric breathes incredibly well and the fit is dialed-in. Our entire squad upgraded to Tikwando.',
    createdAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
  },
  {
    id: 'rev-2',
    author: 'Sasha L.',
    rating: 4,
    title: 'Great cut, true to size',
    body: 'Loved the colors and the stitch detail. Coach approved.',
    createdAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
  },
  {
    id: 'rev-3',
    author: 'Coach Rivera',
    rating: 5,
    title: 'Best uniforms we have ordered',
    body: 'Customization team was responsive and the product showed up early. Highly recommend.',
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
  },
];
