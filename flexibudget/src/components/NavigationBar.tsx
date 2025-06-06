import React from 'react'
import { Link, useLocation } from 'react-router-dom' // useLocation pour le lien actif
import { useSettingsStore } from '../stores/settingsStore'

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const linkClasses = (path: string) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
      location.pathname === path 
        ? 'bg-indigo-700 text-white' 
        : 'text-indigo-100 hover:bg-indigo-500 hover:text-white focus:bg-indigo-600 focus:text-white focus:outline-none'
    }`;
    
  // Classes pour les liens mobiles (plus courts)
  const mobileLinkClasses = (path: string) => 
  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out ${
    location.pathname === path 
      ? 'bg-indigo-700 text-white' 
      : 'text-indigo-100 hover:bg-indigo-500 hover:text-white focus:bg-indigo-600 focus:text-white focus:outline-none'
  }`;


  // État pour le menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-indigo-600/90 backdrop-blur sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              FlexiBudget
            </Link>
          </div>
          {/* Liens pour Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={linkClasses('/')}>
                Tableau de Bord
              </Link>
              <Link to="/transactions" className={linkClasses('/transactions')}>
                Transactions
              </Link>
              <Link to="/categories" className={linkClasses('/categories')}>
                Catégories
              </Link>
              <Link to="/settings" className={linkClasses('/settings')}>
                Paramètres
              </Link>
              <button
                onClick={toggleTheme}
                className="px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-500 hover:text-white focus:outline-none transition-colors"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
          {/* Bouton Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Déroulant */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className={mobileLinkClasses('/')} onClick={() => setIsMobileMenuOpen(false)}>Tableau de Bord</Link>
            <Link to="/transactions" className={mobileLinkClasses('/transactions')} onClick={() => setIsMobileMenuOpen(false)}>Transactions</Link>
            <Link to="/categories" className={mobileLinkClasses('/categories')} onClick={() => setIsMobileMenuOpen(false)}>Catégories</Link>
            <Link to="/settings" className={mobileLinkClasses('/settings')} onClick={() => setIsMobileMenuOpen(false)}>Paramètres</Link>
            <button
              onClick={() => {
                toggleTheme()
                setIsMobileMenuOpen(false)
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-500 hover:text-white focus:outline-none transition-colors"
            >
              {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
