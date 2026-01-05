import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Home, Users, Calendar, Settings, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';

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
            { name: 'Dashboard', page: 'PersonalDashboard', icon: Sparkles },
            { name: 'Family Legacy', page: 'FamilyLegacy', icon: Users },
            { name: 'Horoscopes', page: 'Horoscopes', icon: Sparkles },
            { name: 'Transits', page: 'PlanetaryTransits', icon: Sparkles },
            { name: 'Compatibility', page: 'ZodiacCompatibility', icon: Users },
            { name: 'Learn Astrology', page: 'AstrologyLearning', icon: Sparkles },
            { name: 'Games', page: 'Games', icon: Sparkles },
            { name: 'Community', page: 'Community', icon: Users },
            { name: 'Add Member', page: 'AddFamilyMember', icon: Users },
            { name: 'Join Family', page: 'JoinFamily', icon: Users },
            { name: 'Cosmic Calendar', page: 'CalendarEvents', icon: Calendar },
            { name: 'About', page: 'AboutNumerology', icon: Sparkles },
            { name: 'Admin', page: 'AdminNumerology', icon: Settings },
          ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm">7day11.com</span>
                          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors text-xs ${
                  currentPageName === item.page 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-3 h-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="hidden lg:flex items-center gap-2">
            {user && (
              <span className="text-gray-300 text-xs">{user.full_name || user.email}</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-white hover:bg-white/10 text-xs px-2 py-1"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="lg:hidden bg-black/50 backdrop-blur-sm border-t border-white/10 px-4 py-4 space-y-2">
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

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} 7day11.com. All Rights Reserved.
          </p>
        </div>
      </footer>
      <Toaster richColors position="top-center" />
      </div>
      );
      }