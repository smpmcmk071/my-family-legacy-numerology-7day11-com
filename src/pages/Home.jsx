import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Sparkles, Calculator, Swords, Spade, Users, Calendar, BookOpen, UserPlus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [user, setUser] = useState(null);
  const [familyMember, setFamilyMember] = useState(null);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Find family member record for this user
        const members = await base44.entities.FamilyMember.filter({ email: currentUser.email });
        if (members.length > 0) {
          setFamilyMember(members[0]);
          // Load family info
          const families = await base44.entities.Family.filter({ id: members[0].family_id });
          if (families.length > 0) {
            setFamily(families[0]);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const apps = [
    {
      name: 'Numerology Battle',
      description: 'Battle family members using numerology-powered stats',
      icon: Swords,
      page: 'NumerologyBattle',
      gradient: 'from-red-500 to-orange-600'
    },
    {
            name: 'Numerology War',
            description: 'Battle with cards - highest numerology value wins!',
            icon: Spade,
            page: 'NumerologyWar',
            gradient: 'from-red-500 to-rose-600'
          },
    {
      name: 'Personal Dashboard',
      description: 'View your daily numerology insights and forecasts',
      icon: Sparkles,
      page: 'PersonalDashboard',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Calendar',
      description: 'Numerology-enhanced calendar with daily vibes',
      icon: Calendar,
      page: 'CalendarEvents',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Community',
      description: 'Share experiences and connect with family',
      icon: Users,
      page: 'Community',
      gradient: 'from-amber-500 to-yellow-600'
    },
    {
      name: 'Add Family Member',
      description: 'Calculate numerology and add family members',
      icon: UserPlus,
      page: 'AddFamilyMember',
      gradient: 'from-teal-500 to-cyan-600'
    },
    {
      name: 'About Numerology',
      description: 'Learn about the ancient systems of numerology',
      icon: BookOpen,
      page: 'AboutNumerology',
      gradient: 'from-indigo-500 to-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-12 h-12 text-amber-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              7day11.com
            </h1>
            <Sparkles className="w-12 h-12 text-amber-400" />
          </div>
          <p className="text-xl text-gray-300 italic">
            Discover Your Numerological Legacy
          </p>
          {family && (
            <p className="text-lg text-amber-400 mt-4">
              Welcome, {family.name}
            </p>
          )}
          {!familyMember && (
            <div className="mt-6 p-4 bg-amber-500/20 border border-amber-500/50 rounded-lg max-w-md mx-auto">
              <p className="text-amber-300">
                Get started by adding yourself as a family member to unlock all features!
              </p>
              <Link 
                to={createPageUrl('AddFamilyMember')}
                className="inline-block mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Set Up Your Profile
              </Link>
            </div>
          )}
        </div>

        {/* Apps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app, idx) => {
            const Icon = app.icon;
            return (
              <Link key={idx} to={createPageUrl(app.page)}>
                <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${app.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">
                      {app.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {app.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        {familyMember && (
          <div className="mt-16 p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Core Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {familyMember.life_path_western && (
                <div className="p-4 bg-white/5 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Life Path</p>
                  <p className="text-3xl font-bold text-amber-400">{familyMember.life_path_western}</p>
                </div>
              )}
              {familyMember.expression_western && (
                <div className="p-4 bg-white/5 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Expression</p>
                  <p className="text-3xl font-bold text-purple-400">{familyMember.expression_western}</p>
                </div>
              )}
              {familyMember.soul_urge_western && (
                <div className="p-4 bg-white/5 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Soul Urge</p>
                  <p className="text-3xl font-bold text-pink-400">{familyMember.soul_urge_western}</p>
                </div>
              )}
              {familyMember.personality_western && (
                <div className="p-4 bg-white/5 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Personality</p>
                  <p className="text-3xl font-bold text-blue-400">{familyMember.personality_western}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}