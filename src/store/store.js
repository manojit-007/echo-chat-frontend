import { create } from 'zustand';
import { createAuthSlice } from './slices/authSlice';
import { createChatSlice } from './slices/chatSlice';

export const useStore = create((set, get) => ({
    ...createAuthSlice(set, get),
    ...createChatSlice(set, get),
}));
