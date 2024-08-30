import { create } from 'zustand';
import { createAuthSlice } from './slices/authSlice';
import { createContactSlice } from './slices/chatSlice';
import { createTokenSlice } from './slices/token.js';

export const useStore = create((set, get) => ({
    ...createAuthSlice(set, get),
    ...createContactSlice(set, get),
    ...createTokenSlice(set,get)
}));
