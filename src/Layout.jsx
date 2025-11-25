import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Home, Users, Calendar, Settings, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const u = await base44.auth.me();
      setUser(u);
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  const navItems = [
    { name: 'Home', page: 'Home', icon: Home },
    { name: 'My Dashboard', page: 'PersonalDashboard', icon: Sparkles },
    { name: 'Blackjack', page: 'NumerologyBlackjack', icon: Sparkles },
    { name: 'Community', page: 'Community', icon: Users },
    { name: 'Add Member', page: 'AddFamilyMember', icon: Users },
    { name: 'Calendar', page: 'CalendarEvents', icon: Calendar },
    { name: 'Admin', page: 'AdminNumerology', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-white font-bold text-lg">Maher Legacy</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map(item => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentPageName === item.page 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <span className="text-gray-300 text-sm">{user.full_name || user.email}</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden bg-black/50 backdrop-blur-sm border-t border-white/10 px-4 py-4 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  currentPageName === item.page 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-300'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-400 w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}