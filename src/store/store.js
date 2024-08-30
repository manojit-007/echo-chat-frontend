import { create } from 'zustand';
import { createAuthSlice } from './slices/authSlice';
import { createContactSlice } from './slices/chatSlice';

export const useStore = create((set, get) => ({
    ...createAuthSlice(set, get),
    ...createContactSlice(set, get),
}));
