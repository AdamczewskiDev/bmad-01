'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Wallet, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-700 transition-all duration-300">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span>b-home</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
              <Link
                href="/wallets"
                className="nav-link"
              >
                Portfele
              </Link>
              <Link
                href="/transactions"
                className="nav-link"
              >
                Transakcje
              </Link>
              <Link
                href="/reports"
                className="nav-link"
              >
                Raporty
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Wyloguj</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/wallets"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Portfele
            </Link>
            <Link
              href="/transactions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Transakcje
            </Link>
            <Link
              href="/reports"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Raporty
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
