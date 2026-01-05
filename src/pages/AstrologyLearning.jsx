import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Stars, Zap, Users } from 'lucide-react';

export default function AstrologyLearning() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Learn Astrology</h1>
          <p className="text-gray-300">Master the language of the cosmos</p>
        </div>

        <Tabs defaultValue="basics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="planets">Planets</TabsTrigger>
            <TabsTrigger value="houses">Houses</TabsTrigger>
            <TabsTrigger value="aspects">Aspects</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  The 12 Zodiac Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  The zodiac is divided into 12 signs, each representing different personality archetypes and life themes. Understanding your Sun sign is just the beginning—your Moon and Rising signs reveal deeper layers.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      🔥 Fire Signs
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">Passionate, dynamic, temperamental</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-400">♈ Aries • ♌ Leo • ♐ Sagittarius</p>
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      🌍 Earth Signs
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">Grounded, practical, reliable</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-400">♉ Taurus • ♍ Virgo • ♑ Capricorn</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      💨 Air Signs
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">Intellectual, social, analytical</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-400">♊ Gemini • ♎ Libra • ♒ Aquarius</p>
                    </div>
                  </div>

                  <div className="p-4 bg-cyan-500/20 rounded-lg border border-cyan-500/30 md:col-span-3">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      💧 Water Signs
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">Emotional, intuitive, sensitive</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-400">♋ Cancer • ♏ Scorpio • ♓ Pisces</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Stars className="w-5 h-5 text-purple-400" />
                  Modalities: Cardinal, Fixed, Mutable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-500/20 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Cardinal</h3>
                    <p className="text-gray-300 text-sm mb-3">Initiators, leaders, starters</p>
                    <p className="text-gray-400 text-xs">Aries, Cancer, Libra, Capricorn</p>
                  </div>
                  
                  <div className="p-4 bg-amber-500/20 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Fixed</h3>
                    <p className="text-gray-300 text-sm mb-3">Stubborn, persistent, stable</p>
                    <p className="text-gray-400 text-xs">Taurus, Leo, Scorpio, Aquarius</p>
                  </div>
                  
                  <div className="p-4 bg-teal-500/20 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Mutable</h3>
                    <p className="text-gray-300 text-sm mb-3">Adaptable, flexible, changeable</p>
                    <p className="text-gray-400 text-xs">Gemini, Virgo, Sagittarius, Pisces</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planets" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Planetary Rulerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { planet: 'Sun ☉', rules: 'Leo', theme: 'Identity, ego, vitality' },
                    { planet: 'Moon ☽', rules: 'Cancer', theme: 'Emotions, instincts, needs' },
                    { planet: 'Mercury ☿', rules: 'Gemini, Virgo', theme: 'Communication, thinking' },
                    { planet: 'Venus ♀', rules: 'Taurus, Libra', theme: 'Love, beauty, values' },
                    { planet: 'Mars ♂', rules: 'Aries', theme: 'Action, desire, aggression' },
                    { planet: 'Jupiter ♃', rules: 'Sagittarius', theme: 'Growth, luck, wisdom' },
                    { planet: 'Saturn ♄', rules: 'Capricorn', theme: 'Structure, discipline, karma' },
                    { planet: 'Uranus ♅', rules: 'Aquarius', theme: 'Revolution, innovation' },
                    { planet: 'Neptune ♆', rules: 'Pisces', theme: 'Dreams, spirituality, illusion' },
                    { planet: 'Pluto ♇', rules: 'Scorpio', theme: 'Power, transformation, death' }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h3 className="text-white font-semibold mb-1">{p.planet}</h3>
                      <p className="text-purple-400 text-sm mb-2">Rules: {p.rules}</p>
                      <p className="text-gray-400 text-xs">{p.theme}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="houses" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  The 12 Houses of Astrology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  The 12 houses represent different life areas. Each house is associated with a zodiac sign and governs specific experiences.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { num: 1, name: 'Self & Identity', theme: 'How you appear to others' },
                    { num: 2, name: 'Values & Money', theme: 'What you own and value' },
                    { num: 3, name: 'Communication', theme: 'How you express yourself' },
                    { num: 4, name: 'Home & Family', theme: 'Your roots and foundation' },
                    { num: 5, name: 'Creativity & Romance', theme: 'Joy, children, self-expression' },
                    { num: 6, name: 'Health & Service', theme: 'Daily routines and work' },
                    { num: 7, name: 'Partnerships', theme: 'Relationships and contracts' },
                    { num: 8, name: 'Transformation', theme: 'Death, rebirth, shared resources' },
                    { num: 9, name: 'Philosophy & Travel', theme: 'Higher learning and beliefs' },
                    { num: 10, name: 'Career & Status', theme: 'Public image and achievement' },
                    { num: 11, name: 'Community & Vision', theme: 'Friends and future goals' },
                    { num: 12, name: 'Secrets & Spirituality', theme: 'Hidden matters and endings' }
                  ].map((house) => (
                    <div key={house.num} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-amber-400 font-bold">{house.num}</span>
                        <h3 className="text-white font-semibold text-sm">{house.name}</h3>
                      </div>
                      <p className="text-gray-400 text-xs">{house.theme}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aspects" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Planetary Aspects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Aspects are angles between planets that create specific energetic relationships. They reveal how different parts of your chart interact.
                </p>
                <div className="space-y-3">
                  {[
                    { name: 'Conjunction', angle: '0°', nature: 'Intense fusion of energies', color: 'purple' },
                    { name: 'Sextile', angle: '60°', nature: 'Harmonious, opportunity', color: 'green' },
                    { name: 'Square', angle: '90°', nature: 'Tension, growth through challenge', color: 'red' },
                    { name: 'Trine', angle: '120°', nature: 'Easy flow, natural talent', color: 'blue' },
                    { name: 'Opposition', angle: '180°', nature: 'Balance, awareness of opposites', color: 'orange' }
                  ].map((aspect, idx) => (
                    <div key={idx} className={`p-4 bg-${aspect.color}-500/20 rounded-lg border border-${aspect.color}-500/30`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{aspect.name}</h3>
                        <span className={`text-${aspect.color}-400 font-mono text-sm`}>{aspect.angle}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{aspect.nature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}