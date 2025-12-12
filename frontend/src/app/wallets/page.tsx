'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { walletsApi, Wallet, CreateWalletDto } from '@/lib/api/wallets';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Wallet as WalletIcon, Users, Target, Trash2, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWallet, setNewWallet] = useState<CreateWalletDto>({
    name: '',
    baseCurrency: 'PLN',
  });

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadWallets();
    }
  }, [isAuthenticated]);

  const loadWallets = async () => {
    try {
      setIsLoading(true);
      const data = await walletsApi.getAll();
      setWallets(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd ładowania portfeli');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await walletsApi.create(newWallet);
      setShowCreateModal(false);
      setNewWallet({ name: '', baseCurrency: 'PLN' });
      loadWallets();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd tworzenia portfela');
    }
  };

  const handleDeleteWallet = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten portfel?')) return;
    try {
      await walletsApi.delete(id);
      loadWallets();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd usuwania portfela');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfele</h1>
                <p className="text-gray-600">Zarządzaj swoimi portfelami i zapraszaj członków</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nowy portfel</span>
              </motion.button>
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
                <p className="mt-4 text-gray-600 text-lg">Ładowanie portfeli...</p>
              </div>
            ) : wallets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200"
              >
                <WalletIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-6">Nie masz jeszcze żadnych portfeli</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Utwórz pierwszy portfel</span>
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wallets.map((wallet, index) => (
                  <motion.div
                    key={wallet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="card group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                          <WalletIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {wallet.name}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            {wallet.baseCurrency}
                          </p>
                        </div>
                      </div>
                      {wallet.ownerId === wallet.owner?.id && (
                        <button
                          onClick={() => handleDeleteWallet(wallet.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {wallet.goalAmount && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Target className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">
                            Cel: <span className="font-semibold text-gray-900">
                              {wallet.goalAmount.toFixed(2)} {wallet.baseCurrency}
                            </span>
                          </span>
                        </div>
                      )}
                      {wallet.limitAmount && (
                        <div className="flex items-center space-x-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-orange-600" />
                          <span className="text-gray-600">
                            Limit: <span className="font-semibold text-gray-900">
                              {wallet.limitAmount.toFixed(2)} {wallet.baseCurrency}
                            </span>
                          </span>
                        </div>
                      )}
                      {wallet.memberships && wallet.memberships.length > 0 && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">Członkowie:</span>
                          </div>
                          <div className="space-y-1">
                            {wallet.memberships.map((membership) => (
                              <div key={membership.id} className="text-xs text-gray-500 pl-6">
                                {membership.user.email} ({membership.role})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Modal tworzenia portfela */}
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
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Nowy portfel</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleCreateWallet} className="space-y-4">
                  <div>
                    <label className="label">Nazwa portfela</label>
                    <input
                      type="text"
                      required
                      value={newWallet.name}
                      onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                      className="input"
                      placeholder="np. Portfel Domowy"
                    />
                  </div>
                  <div>
                    <label className="label">Waluta bazowa</label>
                    <select
                      value={newWallet.baseCurrency}
                      onChange={(e) =>
                        setNewWallet({
                          ...newWallet,
                          baseCurrency: e.target.value as 'PLN' | 'EUR' | 'USD',
                        })
                      }
                      className="input"
                    >
                      <option value="PLN">PLN</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Cel oszczędnościowy (opcjonalne)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newWallet.goalAmount || ''}
                      onChange={(e) =>
                        setNewWallet({
                          ...newWallet,
                          goalAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="input"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="label">Limit wydatków (opcjonalne)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newWallet.limitAmount || ''}
                      onChange={(e) =>
                        setNewWallet({
                          ...newWallet,
                          limitAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="input"
                      placeholder="0.00"
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
