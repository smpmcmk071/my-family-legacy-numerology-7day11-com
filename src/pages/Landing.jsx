import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Users, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-12 h-12 text-amber-400 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Your Family Legacy
              </h1>
              <Sparkles className="w-12 h-12 text-amber-400 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Discover the Numerology That Connects Your Generations
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Uncover the hidden patterns of wisdom, power, and purpose flowing through your family tree
            </p>
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition-transform">
              Explore Your Legacy
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Sample Family Table Preview */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              See Your Family's Master Number Map
            </h2>
            
            {/* Sample Table */}
            <div className="overflow-x-auto rounded-xl border-2 border-gray-200 mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                    <th className="p-4 text-left font-bold text-gray-900">Name</th>
                    <th className="p-4 text-center font-bold text-gray-900">Life Path</th>
                    <th className="p-4 text-center font-bold text-gray-900">Expression</th>
                    <th className="p-4 text-center font-bold text-gray-900">Soul Urge</th>
                    <th className="p-4 text-center font-bold text-gray-900">Main Masters</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b">
                    <td className="p-4 font-medium">Robert (Grandfather)</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">7</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">11</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">22</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-bold">11</span>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-bold">22</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="p-4 font-medium">Margaret (Grandmother)</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">6</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">8</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">33</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-bold">33</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-amber-50 border-b font-semibold">
                    <td className="p-4 font-bold text-amber-900">Michael (You)</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">8</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">8</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">11</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm font-bold">8</span>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-bold">11</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-gray-600 italic text-lg">
              Interactive clickable numbers reveal deep insights about each person's role in your family story
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          What You'll Discover
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:scale-105 transition-transform">
            <CardContent className="p-8">
              <Users className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Generational Patterns
              </h3>
              <p className="text-gray-300">
                See how wisdom, power, and gifts flow from grandparents through parents to children
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:scale-105 transition-transform">
            <CardContent className="p-8">
              <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Master Numbers
              </h3>
              <p className="text-gray-300">
                Identify rare master numbers (11, 22, 33) and understand their special significance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:scale-105 transition-transform">
            <CardContent className="p-8">
              <BookOpen className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Personal Legacy
              </h3>
              <p className="text-gray-300">
                Create beautiful, printable documents for each family member
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sample Quote Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300">
          <CardContent className="p-8 md:p-12">
            <Heart className="w-12 h-12 text-rose-600 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl italic text-gray-800 text-center mb-6">
              "The numbers do not direct your fate—they remind you that you are never alone. 
              You carry all of them in you: a builder, a seeker, and a healer for the world."
            </blockquote>
            <p className="text-center text-gray-700 font-semibold">
              — Your Family Legacy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Discover Your Family's Numbers?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Create personalized legacy documents for your entire family
        </p>
        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition-transform">
          Get Started Now
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}