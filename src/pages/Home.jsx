import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const generations = [
    {
      title: 'The Children',
      members: [
        {
          name: 'Christian Stephen Maher',
          title: 'The Builder',
          description: 'Double 8, Soul 11, Birthday 25/7',
          highlight: 'Master Builder & Visionary',
          page: 'MaherLegacy',
          gradient: 'from-amber-500 to-orange-600'
        },
        {
          name: 'Kyle Maher',
          title: 'The Adventurer',
          description: 'Life Path 5, Expression 8, Soul 1',
          highlight: 'Freedom & Achievement',
          page: 'KyleLegacy',
          gradient: 'from-blue-500 to-cyan-600'
        },
        {
          name: 'Melanie Maher',
          title: 'The Healer',
          description: 'Life Path 1, Expression 3, Soul 33/6',
          highlight: 'Innovation & Compassion',
          page: 'MelanieLegacy',
          gradient: 'from-purple-500 to-pink-600'
        }
      ]
    },
    {
      title: 'The Grandparents',
      members: [
        {
          name: 'John Francis & Elizabeth JoAnn',
          title: 'The Foundation',
          description: 'Master Builder (22) & Master Healer (33)',
          highlight: 'Wisdom & Love',
          page: 'GrandparentsLegacy',
          gradient: 'from-indigo-500 to-purple-600'
        }
      ]
    },
    {
      title: 'The Parents',
      members: [
        {
          name: 'Stephen Maher',
          title: 'The Bridge',
          description: 'Life Path 7, Expression 11, Soul 8',
          highlight: 'Wisdom & Vision',
          page: 'StephenLegacy',
          gradient: 'from-slate-500 to-blue-600'
        },
        {
          name: 'Amy Maher',
          title: 'The Activator',
          description: 'Life Path 11, Expression 5, Soul 8',
          highlight: 'Vision & Action',
          page: 'AmyLegacy',
          gradient: 'from-emerald-500 to-teal-600'
        },
        {
          name: 'Letter to Our Children',
          title: 'From Mom & Dad',
          description: 'A personal message about your legacy',
          highlight: 'Love & Guidance',
          page: 'ParentsLegacy',
          gradient: 'from-rose-500 to-pink-600',
          icon: Heart
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-12 h-12 text-amber-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              The Maher Legacy
            </h1>
            <Sparkles className="w-12 h-12 text-amber-400" />
          </div>
          <p className="text-xl text-gray-300 italic">
            A family of visionaries, builders, and healers
          </p>
          <p className="text-lg text-gray-400 mt-4">
            Four generations of wisdom, power, and purpose
          </p>
        </div>

        {/* Generation Sections */}
        {generations.map((generation, genIdx) => (
          <div key={genIdx} className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {generation.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {generation.members.map((member, idx) => {
                const Icon = member.icon || Sparkles;
                return (
                  <Link key={idx} to={createPageUrl(member.page)}>
                    <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer group">
                      <CardHeader>
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-white mb-2">
                          {member.name}
                        </CardTitle>
                        <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${member.gradient} text-white text-sm font-semibold`}>
                          {member.title}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300 leading-relaxed">
                          {member.description}
                        </p>
                        <div className="pt-4 border-t border-white/20">
                          <div className="flex items-center justify-between text-amber-400 group-hover:text-amber-300 transition-colors">
                            <span className="font-semibold">{member.highlight}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Family Foundation */}
        <div className="mt-16 p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">The Foundation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-lg">
              <h3 className="text-xl font-bold text-amber-400 mb-2">Grandpop John Francis</h3>
              <p className="text-gray-300">
                The visionary (7, 11, 22) who laid the foundation of wisdom and master building for all generations
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <h3 className="text-xl font-bold text-pink-400 mb-2">Grandma Elizabeth JoAnn</h3>
              <p className="text-gray-300">
                The master healer (33/6) who anchors the family with love, intuition, and steady care
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}