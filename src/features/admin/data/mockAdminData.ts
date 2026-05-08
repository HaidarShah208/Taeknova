export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'draft';
}

export interface AdminOrder {
  id: string;
  customer: string;
  amount: number;
  items: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'support';
  email: string;
  status: 'active' | 'inactive';
}

export interface AdminInventory {
  sku: string;
  product: string;
  warehouse: string;
  available: number;
  reserved: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  products: number;
  status: 'active' | 'hidden';
}

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 'p-1', name: 'Taekwondo Pro Uniform', category: 'Uniforms', price: 14500, stock: 118, status: 'active' },
  { id: 'p-2', name: 'Combat Hoodie', category: 'Hoodies', price: 6900, stock: 64, status: 'active' },
  { id: 'p-3', name: 'Dojo Team T-Shirt', category: 'T-Shirts', price: 3200, stock: 22, status: 'draft' },
];

export const ADMIN_ORDERS: AdminOrder[] = [
  { id: 'ord-2021', customer: 'Apex Taekwondo Club', amount: 248000, items: 31, status: 'processing', date: '2026-05-08' },
  { id: 'ord-2020', customer: 'Falcon Martial Arts', amount: 197500, items: 19, status: 'shipped', date: '2026-05-07' },
  { id: 'ord-2019', customer: 'United Dojo Academy', amount: 88500, items: 12, status: 'delivered', date: '2026-05-05' },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: 'u-1', name: 'Danial Haider', role: 'admin', email: 'danial@tikwando.com', status: 'active' },
  { id: 'u-2', name: 'Sara Khan', role: 'manager', email: 'sara@tikwando.com', status: 'active' },
  { id: 'u-3', name: 'Ali Raza', role: 'support', email: 'ali@tikwando.com', status: 'inactive' },
];

export const ADMIN_INVENTORY: AdminInventory[] = [
  { sku: 'TK-UNI-001', product: 'Taekwondo Pro Uniform', warehouse: 'Lahore', available: 118, reserved: 12 },
  { sku: 'TK-HOD-004', product: 'Combat Hoodie', warehouse: 'Karachi', available: 64, reserved: 4 },
  { sku: 'TK-TEE-010', product: 'Dojo Team T-Shirt', warehouse: 'Islamabad', available: 22, reserved: 7 },
];

export const ADMIN_CATEGORIES: AdminCategory[] = [
  { id: 'c-1', name: 'Uniforms', products: 32, status: 'active' },
  { id: 'c-2', name: 'Hoodies', products: 14, status: 'active' },
  { id: 'c-3', name: 'T-Shirts', products: 20, status: 'active' },
  { id: 'c-4', name: 'Accessories', products: 9, status: 'hidden' },
];
