'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { transactionsApi, Transaction, CreateTransactionDto } from '@/lib/api/transactions';
import { walletsApi, Wallet } from '@/lib/api/wallets';
import { categoriesApi, Category } from '@/lib/api/categories';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, ArrowDownCircle, ArrowUpCircle, Trash2, Filter, X, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState<CreateTransactionDto>({
    type: 'EXPENSE',
    amount: 0,
    currency: 'PLN',
    walletId: '',
  });

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, selectedWallet]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [transactionsData, walletsData, categoriesData] = await Promise.all([
        transactionsApi.getAll(selectedWallet || undefined),
        walletsApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setTransactions(transactionsData);
      setWallets(walletsData);
      setCategories(categoriesData);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd ładowania danych');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.walletId) {
      setError('Wybierz portfel');
      return;
    }
    try {
      await transactionsApi.create(newTransaction);
      setShowCreateModal(false);
      setNewTransaction({
        type: 'EXPENSE',
        amount: 0,
        currency: 'PLN',
        walletId: '',
      });
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd tworzenia transakcji');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę transakcję?')) return;
    try {
      await transactionsApi.delete(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd usuwania transakcji');
    }
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === newTransaction.type || newTransaction.type === undefined
  );

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.amountBase), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.amountBase), 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Transakcje</h1>
                <p className="text-gray-600">Zarządzaj swoimi przychodami i wydatkami</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nowa transakcja</span>
              </motion.button>
            </div>

            {/* Statystyki */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Przychody</p>
                    <p className="text-2xl font-bold">{totalIncome.toFixed(2)} PLN</p>
                  </div>
                  <ArrowUpCircle className="w-8 h-8 text-green-200" />
                </div>
              </div>
              <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm mb-1">Wydatki</p>
                    <p className="text-2xl font-bold">{totalExpenses.toFixed(2)} PLN</p>
                  </div>
                  <ArrowDownCircle className="w-8 h-8 text-red-200" />
                </div>
              </div>
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Bilans</p>
                    <p className="text-2xl font-bold">{(totalIncome - totalExpenses).toFixed(2)} PLN</p>
                  </div>
                  <Tag className="w-8 h-8 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Filtr */}
            <div className="mb-6 card">
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Filtruj po portfelu</label>
              </div>
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="input"
              >
                <option value="">Wszystkie portfele</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-600 text-lg">Ładowanie transakcji...</p>
              </div>
            ) : transactions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200"
              >
                <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-6">Nie masz jeszcze żadnych transakcji</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Dodaj pierwszą transakcję</span>
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          transaction.type === 'INCOME'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? (
                          <ArrowUpCircle className="w-5 h-5" />
                        ) : (
                          <ArrowDownCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-gray-900">
                            {parseFloat(transaction.amount).toFixed(2)} {transaction.currency}
                          </span>
                          {transaction.currency !== transaction.wallet?.baseCurrency && (
                            <span className="text-sm text-gray-500">
                              ({parseFloat(transaction.amountBase).toFixed(2)} {transaction.wallet?.baseCurrency})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          {transaction.category && (
                            <span className="text-sm text-gray-600 flex items-center">
                              <Tag className="w-3 h-3 mr-1" />
                              {transaction.category.name}
                            </span>
                          )}
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(transaction.bookedAt).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                        {transaction.note && (
                          <p className="text-sm text-gray-600 mt-1">{transaction.note}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Modal tworzenia transakcji */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Nowa transakcja</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleCreateTransaction} className="space-y-4">
                  <div>
                    <label className="label">Typ transakcji</label>
                    <select
                      value={newTransaction.type}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          type: e.target.value as 'INCOME' | 'EXPENSE',
                        })
                      }
                      className="input"
                    >
                      <option value="EXPENSE">Wydatek</option>
                      <option value="INCOME">Przychód</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Portfel</label>
                    <select
                      required
                      value={newTransaction.walletId}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, walletId: e.target.value })
                      }
                      className="input"
                    >
                      <option value="">Wybierz portfel</option>
                      {wallets.map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>
                          {wallet.name} ({wallet.baseCurrency})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Kwota</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={newTransaction.amount || ''}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="input"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="label">Waluta</label>
                      <select
                        value={newTransaction.currency}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            currency: e.target.value as 'PLN' | 'EUR' | 'USD',
                          })
                        }
                        className="input"
                      >
                        <option value="PLN">PLN</option>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Kategoria (opcjonalne)</label>
                    <select
                      value={newTransaction.categoryId || ''}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          categoryId: e.target.value || undefined,
                        })
                      }
                      className="input"
                    >
                      <option value="">Brak kategorii</option>
                      {filteredCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Notatka (opcjonalne)</label>
                    <input
                      type="text"
                      value={newTransaction.note || ''}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, note: e.target.value || undefined })
                      }
                      className="input"
                      placeholder="Opis transakcji"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="btn-secondary"
                    >
                      Anuluj
                    </button>
                    <button type="submit" className="btn-primary">
                      Utwórz
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
