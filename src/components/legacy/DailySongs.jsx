import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { DAILY_SONGS } from '../utils/songRecommendations';
import NumberBadge from './NumberBadge';

// Get current date in EST timezone
const getESTDate = () => {
  const now = new Date();
  const estParts = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  return estParts; // Returns YYYY-MM-DD format directly
};

export default function DailySongs() {
  const [dayNumber, setDayNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    loadTodayNumber();
  }, []);

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

  const songs = dayNumber ? (DAILY_SONGS[dayNumber] || DAILY_SONGS[dayNumber % 9 || 9]) : [];

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
        <CardTitle className="flex items-center gap-2 text-white">
          <Music className="w-5 h-5 text-purple-400" />
          Today's Playlist
          <NumberBadge number={dayNumber} size="sm" />
        </CardTitle>
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