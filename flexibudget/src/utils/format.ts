import { useSettingsStore } from '../stores/settingsStore';

export const useCurrencyFormatter = () => {
  const currency = useSettingsStore(state => state.currency);
  return (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
};
