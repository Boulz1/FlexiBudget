import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import SettingsPage from './pages/SettingsPage'; // Importer la nouvelle page
import './index.css'; 

const App: React.FC = () => {
  return (
    <Router>
      {/* Utilisation des classes de ma version précédente pour le style général */}
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavigationBar />
        {/* Flex-grow pour que le contenu principal prenne l'espace disponible */}
        {/* Padding ajusté et container mx-auto pour centrer le contenu */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/settings" element={<SettingsPage />} /> {/* Nouvelle route ajoutée */}
          </Routes>
        </main>
        {/* Pied de page stylisé et positionné en bas */}
        <footer className="bg-gray-800 dark:bg-gray-700 text-white text-center p-4 text-sm">
          FlexiBudget &copy; {new Date().getFullYear()} - Tous droits réservés.
        </footer>
      </div>
    </Router>
  );
};

export default App;
