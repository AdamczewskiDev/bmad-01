'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { reportsApi } from '@/lib/api/reports';
import { walletsApi, Wallet } from '@/lib/api/wallets';
import { BarChart3, TrendingUp, Target, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [goalProgress, setGoalProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    if (wallets.length > 0) {
      loadReports();
    }
  }, [selectedWallet, startDate, endDate]);

  const loadWallets = async () => {
    try {
      const data = await walletsApi.getAll();
      setWallets(data);
    } catch (err: any) {
      setError('Błąd ładowania portfeli: ' + (err.response?.data?.message || err.message));
    }
  };

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [breakdownData, progressData] = await Promise.all([
        reportsApi.getCategoryBreakdown(
          selectedWallet || undefined,
          startDate || undefined,
          endDate || undefined
        ),
        reportsApi.getGoalProgress(selectedWallet || undefined),
      ]);
      setCategoryBreakdown(breakdownData);
      setGoalProgress(progressData);
    } catch (err: any) {
      setError('Błąd ładowania raportów: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const totalExpenses = categoryBreakdown.reduce((sum, item) => sum + item.total, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Raporty</h1>
              <p className="text-gray-600">Analizuj swoje wydatki i postęp w osiąganiu celów</p>
            </div>

            {/* Filtry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Filtry</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Portfel</label>
                  <select
                    className="input"
                    value={selectedWallet}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                  >
                    <option value="">Wszystkie portfele</option>
                    {wallets.map((wallet) => (
                      <option key={wallet.id} value={wallet.id}>
                        {wallet.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Data od</label>
                  <input
                    type="date"
                    className="input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Data do</label>
                  <input
                    type="date"
                    className="input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

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
                <p className="mt-4 text-gray-600 text-lg">Ładowanie raportów...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Category Breakdown */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                >
                  <div className="flex items-center space-x-2 mb-6">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Podział według kategorii</h2>
                  </div>
                  {categoryBreakdown.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Brak danych</p>
                  ) : (
                    <div>
                      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                          {totalExpenses.toFixed(2)} PLN
                        </p>
                        <p className="text-sm text-gray-600">Łączne wydatki</p>
                      </div>
                      <div className="space-y-4">
                        {categoryBreakdown.map((item, index) => {
                          const percentage = totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0;
                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  {item.category}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {item.total.toFixed(2)} PLN ({item.count} transakcji)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                                ></motion.div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Goal Progress */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                >
                  <div className="flex items-center space-x-2 mb-6">
                    <Target className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-900">Postęp w osiąganiu celów</h2>
                  </div>
                  {goalProgress.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Brak portfeli z celami</p>
                  ) : (
                    <div className="space-y-6">
                      {goalProgress.map((goal, index) => (
                        <motion.div
                          key={goal.walletId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-gray-900">{goal.walletName}</span>
                            {goal.progress !== null && (
                              <span className="text-lg font-bold text-green-600">
                                {goal.progress.toFixed(1)}%
                              </span>
                            )}
                          </div>
                          {goal.goalAmount !== null ? (
                            <>
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>
                                  {goal.currentAmount.toFixed(2)} / {goal.goalAmount.toFixed(2)} PLN
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, goal.progress || 0)}%` }}
                                  transition={{ duration: 0.8, delay: index * 0.1 }}
                                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full"
                                ></motion.div>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Brak ustawionego celu</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
