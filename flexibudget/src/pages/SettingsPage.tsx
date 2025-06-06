import React, { useState } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

const SettingsPage: React.FC = () => {
  const { currency, dateFormat, setCurrency, setDateFormat } = useSettingsStore();
  const [currencyValue, setCurrencyValue] = useState(currency);
  const [dateFormatValue, setDateFormatValue] = useState(dateFormat);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrency(currencyValue);
    setDateFormat(dateFormatValue);
    alert('Paramètres sauvegardés.');
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Paramètres Utilisateur</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <div className="mb-6">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Devise Préférée
          </label>
          <select
            id="currency"
            name="currency"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={currencyValue}
            onChange={(e) => setCurrencyValue(e.target.value)}
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar Américain ($)</option>
            <option value="GBP">Livre Sterling (£)</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
            Format de Date
          </label>
          <select
            id="dateFormat"
            name="dateFormat"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={dateFormatValue}
            onChange={(e) => setDateFormatValue(e.target.value)}
          >
            <option value="dd/MM/yyyy">JJ/MM/AAAA</option>
            <option value="MM/dd/yyyy">MM/JJ/AAAA</option>
            <option value="yyyy-MM-dd">AAAA-MM-JJ</option>
          </select>
        </div>
        
        {/* Plus de paramètres peuvent être ajoutés ici */}

        <button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          // disabled // Décommenter si vous voulez le désactiver visuellement
        >
          Sauvegarder les Paramètres
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
