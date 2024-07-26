import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

// Utility to calculate totals
const calculateTotals = (items) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalQuantity, totalPrice };
};

// Utility to save to localStorage
const saveToLocalStorage = (items, totalQuantity, totalPrice) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItems', JSON.stringify(items));
    localStorage.setItem('totalQuantity', JSON.stringify(totalQuantity));
    localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
  }
};

// Utility to load from localStorage
const loadFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalQuantity = JSON.parse(localStorage.getItem('totalQuantity')) || 0;
    const totalPrice = JSON.parse(localStorage.getItem('totalPrice')) || 0;
    return { items, totalQuantity, totalPrice };
  }
  return initialState;
};

// Initialize state with values from localStorage if available
const { items, totalQuantity, totalPrice } = loadFromLocalStorage();
const preloadedState = { items, totalQuantity, totalPrice };

export const CartSlice = createSlice({
  name: 'cart',
  initialState: preloadedState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      saveToLocalStorage(state.items, state.totalQuantity, state.totalPrice);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload._id);
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      saveToLocalStorage(state.items, state.totalQuantity, state.totalPrice);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item._id === action.payload._id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i._id !== item._id);
        }
      }
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      saveToLocalStorage(state.items, state.totalQuantity, state.totalPrice);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      saveToLocalStorage(state.items, state.totalQuantity, state.totalPrice);
    },
    hydrate: (state, action) => {
      // Hydrate state from localStorage values
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalPrice = action.payload.totalPrice;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addItem, removeItem, updateQuantity, clearCart, hydrate } = CartSlice.actions;

export default CartSlice.reducer;
