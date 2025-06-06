import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useCurrencyFormatter } from '../utils/format';
// Pas besoin d'importer Transaction ici car nous ne l'utilisons pas directement comme type de prop

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardPage: React.FC = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const { getCategoryById } = useCategoryStore((state) => ({
     getCategoryById: state.getCategoryById,
  }));
  const currency = useSettingsStore(state => state.currency);
  const formatCurrency = useCurrencyFormatter();

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const expenseByCategory: { [key: string]: number } = {};

  expenseTransactions.forEach(transaction => {
    const category = getCategoryById(transaction.categoryId);
    const categoryName = category ? category.name : 'Non Catégorisé';
    expenseByCategory[categoryName] = (expenseByCategory[categoryName] || 0) + transaction.amount;
  });

  const chartColors = [
    '#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#6366F1', 
    '#D946EF', '#0EA5E9', '#F97316', '#8B5CF6', '#EF4444'
  ];
  const chartBorderColors = chartColors.map(color => `${color}B3`); // 70% opacity for borders

  const doughnutData = {
    labels: Object.keys(expenseByCategory).length > 0 ? Object.keys(expenseByCategory) : ['Aucune dépense'],
    datasets: [
      {
        label: 'Dépenses par Catégorie',
        data: Object.keys(expenseByCategory).length > 0 ? Object.values(expenseByCategory) : [1], // Placeholder si pas de données
        backgroundColor: Object.keys(expenseByCategory).length > 0 ? chartColors : ['#D1D5DB'],
        borderColor: Object.keys(expenseByCategory).length > 0 ? chartBorderColors : ['#9CA3AF'],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
     responsive: true,
     maintainAspectRatio: false,
     plugins: {
         legend: {
             position: 'bottom' as const,
             labels: {
                 padding: 20,
                 boxWidth: 12,
                 font: { size: 14 }
             }
         },
         title: {
             display: true,
             text: 'Répartition des Dépenses',
             font: { size: 18, weight: '600' as const },
             padding: { top: 10, bottom: 30 }
         },
         tooltip: {
             callbacks: {
                label: function(context: TooltipItem<'doughnut'>) {
                     let label = context.label || '';
                     if (label) {
                         label += ': ';
                     }
                     if (context.parsed !== null) {
                         label += new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(context.parsed);
                     }
                     return label;
                 }
             }
         }
     }
  };

  let totalIncome = 0;
  let totalExpenses = 0;
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });

  const barData = {
    labels: ['Revenus', 'Dépenses'],
    datasets: [
      {
        label: 'Montant',
        data: [totalIncome, totalExpenses],
        backgroundColor: [ 'rgba(52, 211, 153, 0.7)', 'rgba(251, 113, 133, 0.7)' ], // Vert pour revenus, Rouge pour dépenses
        borderColor: [ 'rgb(52, 211, 153)', 'rgb(251, 113, 133)' ],
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 50,
      },
    ],
  };

  const barOptions = {
     responsive: true,
     maintainAspectRatio: false,
     plugins: {
         legend: { display: false },
         title: {
             display: true,
             text: 'Revenus vs Dépenses',
             font: { size: 18, weight: '600' as const },
             padding: { top: 10, bottom: 30 }
         },
         tooltip: {
             callbacks: {
                label: function(context: TooltipItem<'bar'>) {
                     return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(context.parsed.y);
                 }
             }
         }
     },
     scales: {
         y: { beginAtZero: true, ticks: { callback: value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(Number(value)) } },
         x: { grid: { display: false } }
     }
  };
  
  const balance = totalIncome - totalExpenses;

const SummaryCard: React.FC<{title: string, amount: number, colorClass: string, children?: React.ReactNode}> =
  ({ title, amount, colorClass, children }) => (
    <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl ${colorClass}`}>
      <h2 className="text-lg font-semibold text-white mb-1">{title}</h2>
      <p className="text-3xl font-bold text-white">{formatCurrency(amount)}</p>
      {children}
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Revenus Totaux" amount={totalIncome} colorClass="bg-gradient-to-br from-green-500 to-green-600" />
        <SummaryCard title="Dépenses Totales" amount={totalExpenses} colorClass="bg-gradient-to-br from-red-500 to-red-600" />
        <SummaryCard title="Solde Actuel" amount={balance} colorClass={balance >= 0 ? "bg-gradient-to-br from-indigo-500 to-indigo-600" : "bg-gradient-to-br from-yellow-500 to-yellow-600"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          {expenseTransactions.length > 0 ? (
             <div style={{ height: '400px' }}>
                 <Doughnut data={doughnutData} options={doughnutOptions} />
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-lg font-semibold">Aucune dépense</h3>
                <p className="text-sm">Les dépenses apparaîtront ici une fois ajoutées.</p>
             </div>
          )}
        </div>
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          {transactions.length > 0 ? (
             <div style={{ height: '400px' }}>
                 <Bar data={barData} options={barOptions} />
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                 <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-lg font-semibold">Aucune transaction</h3>
                <p className="text-sm">Les revenus et dépenses apparaîtront ici.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
