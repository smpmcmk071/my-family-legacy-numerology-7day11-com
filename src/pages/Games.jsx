import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Swords, Spade, Gamepad2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Games() {
  const games = [
    {
      name: 'Numerology Battle',
      description: 'Battle family members using numerology-powered stats in turn-based combat',
      icon: Swords,
      page: 'NumerologyBattle',
      gradient: 'from-red-500 to-orange-600'
    },
    {
      name: 'Numerology War',
      description: 'Classic War card game - highest numerology value wins! Master numbers stay powerful!',
      icon: Spade,
      page: 'NumerologyWar',
      gradient: 'from-red-500 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home */}
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="text-gray-300 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-12 h-12 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Numerology Games
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Play games powered by the ancient wisdom of numbers
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {games.map((game, idx) => {
            const Icon = game.icon;
            return (
              <Link key={idx} to={createPageUrl(game.page)}>
                <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white text-center">
                      {game.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed text-center">
                      {game.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}