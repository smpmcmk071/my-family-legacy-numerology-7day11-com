import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Loader2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { DAILY_SONGS } from '../utils/songRecommendations';
import NumberBadge from './NumberBadge';

// Get current date in EST timezone
const getESTDate = () => {
  const now = new Date();
  const year = now.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' });
  const month = now.toLocaleString('en-US', { timeZone: 'America/New_York', month: '2-digit' });
  const day = now.toLocaleString('en-US', { timeZone: 'America/New_York', day: '2-digit' });
  return `${year}-${month}-${day}`;
};

export default function DailySongs() {
  const [dayNumber, setDayNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayDate, setTodayDate] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [aiSongs, setAiSongs] = useState([]);

  useEffect(() => {
    loadTodayNumber();
  }, []);

  useEffect(() => {
    if (useAI && dayNumber) {
      generateAISongs();
    }
  }, [useAI, dayNumber]);

  const loadTodayNumber = async () => {
    setIsLoading(true);
    const today = getESTDate();
    setTodayDate(today);
    
    const response = await base44.functions.invoke('calculateNumerology', {
      type: 'dayNumbers',
      date: today
    });

    if (response.data?.success) {
      setDayNumber(response.data.data.universalDay);
    }
    setIsLoading(false);
  };

  const generateAISongs = async () => {
    setIsLoading(true);
    try {
      const meanings = {
        1: 'Leadership and new beginnings',
        2: 'Balance and partnerships',
        3: 'Creativity and self-expression',
        4: 'Structure and foundation',
        5: 'Freedom and adventure',
        6: 'Nurturing and responsibility',
        7: 'Spirituality and introspection',
        8: 'Power and achievement',
        9: 'Completion and wisdom',
        11: 'Intuition and inspiration',
        22: 'Master builder energy',
        33: 'Master teacher energy'
      };

      const prompt = `Generate a personalized music playlist for today based on numerology:

Universal Day Number: ${dayNumber}
Energy Theme: ${meanings[dayNumber] || 'Unique energy'}

Create 3 song recommendations that align with today's numerological energy. For each song include:
- Song title and artist (real, well-known songs from any era)
- Brief reason why it matches today's energy (1-2 sentences)

Make the recommendations diverse across genres and meaningful.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            songs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  song: { type: 'string' },
                  artist: { type: 'string' },
                  reason: { type: 'string' }
                }
              }
            }
          }
        }
      });

      if (response?.songs) {
        setAiSongs(response.songs);
      }
    } catch (err) {
      console.error('AI song generation failed:', err);
    }
    setIsLoading(false);
  };

  const songs = useAI ? aiSongs : (dayNumber ? (DAILY_SONGS[dayNumber] || DAILY_SONGS[dayNumber % 9 || 9]) : []);

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Music className="w-5 h-5 text-purple-400" />
            Today's Playlist
            <NumberBadge number={dayNumber} size="sm" />
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setUseAI(!useAI)}
            disabled={isLoading}
            className={useAI ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white/10 hover:bg-white/20 text-white'}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            {useAI ? 'AI' : 'Curated'}
          </Button>
        </div>
        <p className="text-sm text-gray-400">
          Songs for {new Date(todayDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-3">
          {songs.map((item, idx) => (
            <div key={idx} className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
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
      </CardContent>
    </Card>
  );
}