import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Users } from 'lucide-react';
import NumberBadge from '@/components/legacy/NumberBadge';

// Family vibe songs based on dominant numbers
const FAMILY_VIBE_SONGS = {
  7: [
    { song: "Wisdom of the Ages", artist: "Various", reason: "Spiritual wisdom flows through your family" },
    { song: "The Sound of Silence", artist: "Simon & Garfunkel", reason: "Deep thinkers and seekers" },
    { song: "Imagine", artist: "John Lennon", reason: "Visionaries who see beyond" }
  ],
  8: [
    { song: "Empire State of Mind", artist: "Jay-Z", reason: "Achievement and abundance runs in your blood" },
    { song: "We Are the Champions", artist: "Queen", reason: "A family of winners" },
    { song: "Started From the Bottom", artist: "Drake", reason: "Built success through hard work" }
  ],
  22: [
    { song: "Dream On", artist: "Aerosmith", reason: "Master Builders creating legacy" },
    { song: "Lose Yourself", artist: "Eminem", reason: "Manifesting big dreams into reality" },
    { song: "Can't Hold Us", artist: "Macklemore", reason: "Unstoppable builders" }
  ],
  33: [
    { song: "Heal the World", artist: "Michael Jackson", reason: "Master Teachers spreading love" },
    { song: "What a Wonderful World", artist: "Louis Armstrong", reason: "Seeing beauty and sharing it" },
    { song: "Lean on Me", artist: "Bill Withers", reason: "Healing and supporting others" }
  ],
  11: [
    { song: "Stairway to Heaven", artist: "Led Zeppelin", reason: "Spiritual visionaries" },
    { song: "Bohemian Rhapsody", artist: "Queen", reason: "Intuitive and inspired" },
    { song: "Hallelujah", artist: "Leonard Cohen", reason: "Divine connection" }
  ],
  6: [
    { song: "We Are Family", artist: "Sister Sledge", reason: "Love and nurturing at your core" },
    { song: "Greatest Love of All", artist: "Whitney Houston", reason: "Family first always" },
    { song: "Home", artist: "Edward Sharpe", reason: "Home is where the heart is" }
  ],
  9: [
    { song: "Man in the Mirror", artist: "Michael Jackson", reason: "Humanitarian hearts" },
    { song: "We Are the World", artist: "USA for Africa", reason: "Global compassion" },
    { song: "One Love", artist: "Bob Marley", reason: "Universal love" }
  ],
  1: [
    { song: "Eye of the Tiger", artist: "Survivor", reason: "Leaders and pioneers" },
    { song: "Born This Way", artist: "Lady Gaga", reason: "Original and independent" },
    { song: "Roar", artist: "Katy Perry", reason: "Fearless family" }
  ]
};

export default function FamilyPlaylist({ familyMembers }) {
  // Calculate family's dominant numbers
  const calculateFamilyVibe = () => {
    if (!familyMembers || familyMembers.length === 0) return null;

    const numberCounts = {};
    const masterCounts = { 11: 0, 22: 0, 33: 0 };

    familyMembers.forEach(member => {
      // Count life paths
      const lp = member.life_path_western;
      if (lp) {
        if ([11, 22, 33].includes(lp)) {
          masterCounts[lp]++;
        }
        numberCounts[lp] = (numberCounts[lp] || 0) + 1;
      }
      
      // Count expressions
      const expr = member.expression_western;
      if (expr) {
        if ([11, 22, 33].includes(expr)) {
          masterCounts[expr]++;
        }
        numberCounts[expr] = (numberCounts[expr] || 0) + 1;
      }
    });

    // Find dominant master number
    const dominantMaster = Object.entries(masterCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])[0];

    // Find most common number overall
    const dominantNumber = Object.entries(numberCounts)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      dominantMaster: dominantMaster ? parseInt(dominantMaster[0]) : null,
      dominantNumber: dominantNumber ? parseInt(dominantNumber[0]) : 7,
      masterCounts,
      numberCounts
    };
  };

  const familyVibe = calculateFamilyVibe();
  
  if (!familyVibe) {
    return null;
  }

  // Prioritize master numbers for family playlist
  const playlistNumber = familyVibe.dominantMaster || familyVibe.dominantNumber;
  const songs = FAMILY_VIBE_SONGS[playlistNumber] || FAMILY_VIBE_SONGS[7];

  const vibeDescriptions = {
    7: "Seekers of Truth & Wisdom",
    8: "Achievers & Abundance Creators", 
    22: "Master Builders of Legacy",
    33: "Master Teachers & Healers",
    11: "Spiritual Visionaries",
    6: "Nurturers & Family Guardians",
    9: "Humanitarian Hearts",
    1: "Leaders & Pioneers"
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-400" />
          Family Vibe Playlist
          <NumberBadge number={playlistNumber} size="sm" />
        </CardTitle>
        <p className="text-purple-300 text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          {vibeDescriptions[playlistNumber] || "Your Family's Energy"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-3">
          {songs.map((item, idx) => (
            <div key={idx} className="p-3 bg-white/10 rounded-lg border border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎵</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">"{item.song}"</p>
                  <p className="text-sm text-purple-300">{item.artist}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1 italic">{item.reason}</p>
            </div>
          ))}
        </div>
        
        {/* Family number breakdown */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Family Energy Breakdown</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(familyVibe.masterCounts)
              .filter(([_, count]) => count > 0)
              .map(([num, count]) => (
                <span key={num} className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">
                  <NumberBadge number={parseInt(num)} size="sm" /> × {count}
                </span>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}