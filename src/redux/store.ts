import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authReducer } from '@redux/auth';
import { cartReducer } from '@redux/cart';
import { wishlistReducer } from '@redux/wishlist';
import { uiReducer } from '@redux/ui';
import { baseApi } from '@services/baseApi';

import './admin/auth';
import './admin/users';
import './admin/categories';
import './admin/products';
import './admin/inventory';
import './admin/orders';
import './customer/catalog';
import './customer/auth';
import './customer/cart';
import './customer/wishlist';
import './customer/checkout';
import './customer/orders';
import './customer/reviews';
import './customer/profile';
import './customer/addresses';
import './analytics';

const apiMiddleware = baseApi.middleware as Middleware;

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiMiddleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
