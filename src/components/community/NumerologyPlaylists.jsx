import React from 'react';
const { useState, useEffect } = React;
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { Music, Plus, Heart, Loader2, Sparkles, Palette, Activity } from 'lucide-react';
import NumberBadge from '@/components/legacy/NumberBadge';

const THEMES = [
  { value: 'creativity', label: 'Creativity', icon: '🎨', color: 'from-pink-500 to-purple-500' },
  { value: 'abundance', label: 'Abundance', icon: '💰', color: 'from-green-500 to-emerald-500' },
  { value: 'love', label: 'Love & Relationships', icon: '💕', color: 'from-red-400 to-pink-500' },
  { value: 'career', label: 'Career & Success', icon: '🚀', color: 'from-blue-500 to-indigo-500' },
  { value: 'spiritual', label: 'Spiritual Growth', icon: '🔮', color: 'from-purple-500 to-indigo-500' },
  { value: 'health', label: 'Health & Wellness', icon: '🌿', color: 'from-teal-500 to-green-500' },
  { value: 'family', label: 'Family & Home', icon: '🏠', color: 'from-amber-500 to-orange-500' },
  { value: 'general', label: 'General', icon: '✨', color: 'from-gray-500 to-slate-500' }
];

const DEFAULT_PLAYLISTS = [
  { title: 'Best Days for New Beginnings', theme_type: 'career', target_numbers: '1,8', activities: 'Start projects, sign contracts, make bold moves', affirmations: 'I am a powerful creator. Success flows to me naturally.', colors: 'Red, Gold, Orange', crystals: 'Citrine, Tiger Eye, Carnelian', is_default: true },
  { title: 'Creative Flow Days', theme_type: 'creativity', target_numbers: '3,5', activities: 'Art, writing, brainstorming, socializing', affirmations: 'My creativity is limitless. I express myself freely.', colors: 'Yellow, Orange, Turquoise', crystals: 'Carnelian, Orange Calcite, Lapis Lazuli', is_default: true },
  { title: 'Heart-Centered Days', theme_type: 'love', target_numbers: '2,6', activities: 'Quality time with loved ones, self-care, nurturing', affirmations: 'I give and receive love freely. My relationships are harmonious.', colors: 'Pink, Green, Rose Gold', crystals: 'Rose Quartz, Green Aventurine, Rhodonite', is_default: true },
  { title: 'Spiritual Insight Days', theme_type: 'spiritual', target_numbers: '7,11', activities: 'Meditation, journaling, studying, solitude', affirmations: 'I trust my inner wisdom. Divine guidance flows through me.', colors: 'Purple, Silver, White', crystals: 'Amethyst, Clear Quartz, Selenite', is_default: true },
  { title: 'Manifestation Power Days', theme_type: 'abundance', target_numbers: '8,22', activities: 'Financial planning, business decisions, goal setting', affirmations: 'I am worthy of abundance. I manifest my desires with ease.', colors: 'Green, Gold, Black', crystals: 'Pyrite, Green Jade, Black Tourmaline', is_default: true }
];

export default function NumerologyPlaylists({ user, userMember }) {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    description: '',
    theme_type: 'general',
    target_numbers: '',
    activities: '',
    affirmations: '',
    colors: '',
    crystals: '',
    is_public: true
  });

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    setIsLoading(true);
    const data = await base44.entities.NumerologyPlaylist.list('-created_date', 50);
    // Combine with defaults if no custom playlists exist
    const combined = data.length > 0 ? data : DEFAULT_PLAYLISTS;
    setPlaylists(combined);
    setIsLoading(false);
  };

  const submitPlaylist = async () => {
    if (!newPlaylist.title) return;
    
    setIsSubmitting(true);
    
    await base44.entities.NumerologyPlaylist.create({
      ...newPlaylist,
      likes_count: 0
    });
    
    setNewPlaylist({
      title: '',
      description: '',
      theme_type: 'general',
      target_numbers: '',
      activities: '',
      affirmations: '',
      colors: '',
      crystals: '',
      is_public: true
    });
    setShowForm(false);
    loadPlaylists();
    setIsSubmitting(false);
  };

  const likePlaylist = async (playlist) => {
    if (playlist.is_default) return;
    await base44.entities.NumerologyPlaylist.update(playlist.id, {
      likes_count: (playlist.likes_count || 0) + 1
    });
    loadPlaylists();
  };

  const getTheme = (type) => THEMES.find(t => t.value === type) || THEMES[THEMES.length - 1];

  return (
    <div className="space-y-6">
      {/* Create New Playlist */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-400" />
              Numerology Playlists & Themes
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowForm(!showForm)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-1" />
              {showForm ? 'Cancel' : 'Create Playlist'}
            </Button>
          </div>
        </CardHeader>
        {showForm && (
          <CardContent className="space-y-4">
            <Input
              value={newPlaylist.title}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, title: e.target.value })}
              placeholder="Playlist title (e.g., 'Best Days for Creativity')"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
            <Textarea
              value={newPlaylist.description}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
              placeholder="Describe when to use this playlist..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Select value={newPlaylist.theme_type} onValueChange={(v) => setNewPlaylist({ ...newPlaylist, theme_type: v })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {THEMES.map(theme => (
                    <SelectItem key={theme.value} value={theme.value}>{theme.icon} {theme.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={newPlaylist.target_numbers}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, target_numbers: e.target.value })}
                placeholder="Target numbers (e.g., 1,8,22)"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
            <Textarea
              value={newPlaylist.activities}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, activities: e.target.value })}
              placeholder="Recommended activities..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
            <Textarea
              value={newPlaylist.affirmations}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, affirmations: e.target.value })}
              placeholder="Affirmations for this theme..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                value={newPlaylist.colors}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, colors: e.target.value })}
                placeholder="Recommended colors"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
              <Input
                value={newPlaylist.crystals}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, crystals: e.target.value })}
                placeholder="Recommended crystals"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="public"
                checked={newPlaylist.is_public}
                onCheckedChange={(checked) => setNewPlaylist({ ...newPlaylist, is_public: checked })}
              />
              <label htmlFor="public" className="text-sm text-gray-300">Share with community</label>
            </div>
            <Button onClick={submitPlaylist} disabled={!newPlaylist.title || isSubmitting} className="bg-amber-600 hover:bg-amber-700">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Create Playlist
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Playlists Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {playlists.map((playlist, idx) => {
            const theme = getTheme(playlist.theme_type);
            return (
              <Card key={playlist.id || idx} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${theme.color}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl mb-1">{theme.icon}</p>
                      <CardTitle className="text-white text-lg">{playlist.title}</CardTitle>
                    </div>
                    {playlist.target_numbers && (
                      <div className="flex gap-1">
                        {playlist.target_numbers.split(',').map((num, i) => (
                          <NumberBadge key={i} number={parseInt(num.trim())} size="sm" />
                        ))}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {playlist.description && (
                    <p className="text-gray-400 text-sm">{playlist.description}</p>
                  )}
                  
                  {playlist.activities && (
                    <div className="p-2 bg-white/5 rounded">
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                        <Activity className="w-3 h-3" /> Activities
                      </p>
                      <p className="text-gray-300 text-sm">{playlist.activities}</p>
                    </div>
                  )}
                  
                  {playlist.affirmations && (
                    <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                      <p className="text-xs text-purple-400 mb-1">✨ Affirmations</p>
                      <p className="text-gray-300 text-sm italic">"{playlist.affirmations}"</p>
                    </div>
                  )}
                  
                  <div className="flex gap-4 text-xs">
                    {playlist.colors && (
                      <div className="flex items-center gap-1">
                        <Palette className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400">{playlist.colors}</span>
                      </div>
                    )}
                    {playlist.crystals && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">💎</span>
                        <span className="text-gray-400">{playlist.crystals}</span>
                      </div>
                    )}
                  </div>
                  
                  {!playlist.is_default && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => likePlaylist(playlist)}
                      className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/20"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {playlist.likes_count || 0}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}