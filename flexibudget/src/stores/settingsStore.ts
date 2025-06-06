import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  currency: string;
  dateFormat: string;
  setCurrency: (currency: string) => void;
  setDateFormat: (format: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'EUR',
      dateFormat: 'dd/MM/yyyy',
      setCurrency: (currency) => set({ currency }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
    }),
    { name: 'settings' }
  )
);
