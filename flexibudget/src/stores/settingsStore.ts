import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark'

interface SettingsState {
  currency: string
  dateFormat: string
  theme: Theme
  setCurrency: (currency: string) => void
  setDateFormat: (format: string) => void
  setTheme: (theme: Theme) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'EUR',
      dateFormat: 'dd/MM/yyyy',
      theme: 'light',
      setCurrency: (currency) => set({ currency }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'settings' }
  )
);
