import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  currency: string;
  setCurrency: (currency: string) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      currency: '৳',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'receiptiq-settings',
    }
  )
);
