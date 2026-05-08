import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.isMobileMenuOpen = action.payload;
    },
    setCartDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isCartDrawerOpen = action.payload;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.isSearchOpen = action.payload;
    },
    closeAllOverlays(state) {
      state.isMobileMenuOpen = false;
      state.isCartDrawerOpen = false;
      state.isSearchOpen = false;
    },
  },
});

export const { setMobileMenuOpen, setCartDrawerOpen, setSearchOpen, closeAllOverlays } =
  uiSlice.actions;
export const uiReducer = uiSlice.reducer;

export const selectMobileMenuOpen = (state: { ui: UIState }): boolean =>
  state.ui.isMobileMenuOpen;
export const selectCartDrawerOpen = (state: { ui: UIState }): boolean => state.ui.isCartDrawerOpen;
export const selectSearchOpen = (state: { ui: UIState }): boolean => state.ui.isSearchOpen;
