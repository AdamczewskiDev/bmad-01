'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Wallet, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto shadow-lg"></div>
          <p className="mt-4 text-slate-600 text-lg font-medium">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const cards = [
    {
      title: 'Portfele',
      description: 'Zarządzaj swoimi portfelami, zapraszaj członków i śledź salda w różnych walutach.',
      href: '/wallets',
      icon: Wallet,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Transakcje',
      description: 'Dodawaj i zarządzaj transakcjami. Automatyczna konwersja walut i kategoryzacja.',
      href: '/transactions',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Raporty',
      description: 'Analizuj wydatki, kategorie i postęp w osiąganiu celów oszczędnościowych.',
      href: '/reports',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-2xl">
                <Wallet className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Witaj w b-home
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Zarządzaj swoim budżetem domowym w prosty i intuicyjny sposób
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => {
              const Icon = card.icon;
              const colorMap: Record<string, string> = {
                'from-blue-500 to-blue-600': 'from-emerald-500 to-teal-600',
                'from-green-500 to-green-600': 'from-teal-500 to-cyan-600',
                'from-purple-500 to-purple-600': 'from-cyan-500 to-blue-600',
              };
              const newColor = colorMap[card.color] || card.color;
              
              return (
                <motion.div
                  key={card.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Link href={card.href}>
                    <div className="card-gradient h-full group cursor-pointer">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${newColor} mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                        {card.title}
                      </h2>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {card.description}
                      </p>
                      <div className="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700">
                        <span>Przejdź</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
