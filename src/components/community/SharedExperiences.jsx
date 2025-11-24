import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { MessageSquare, Plus, Heart, User, Calendar, Loader2, Sparkles } from 'lucide-react';
import NumberBadge from '@/components/legacy/NumberBadge';

const CATEGORIES = [
  { value: 'insight', label: 'Insight', color: 'bg-blue-500/20 text-blue-300' },
  { value: 'synchronicity', label: 'Synchronicity', color: 'bg-purple-500/20 text-purple-300' },
  { value: 'manifestation', label: 'Manifestation', color: 'bg-green-500/20 text-green-300' },
  { value: 'challenge', label: 'Challenge', color: 'bg-orange-500/20 text-orange-300' },
  { value: 'breakthrough', label: 'Breakthrough', color: 'bg-amber-500/20 text-amber-300' },
  { value: 'other', label: 'Other', color: 'bg-gray-500/20 text-gray-300' }
];

export default function SharedExperiences({ user, userMember }) {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newExperience, setNewExperience] = useState({
    title: '',
    content: '',
    category: 'insight',
    experience_date: new Date().toISOString().split('T')[0],
    is_anonymous: false
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setIsLoading(true);
    const data = await base44.entities.SharedExperience.list('-created_date', 50);
    setExperiences(data);
    setIsLoading(false);
  };

  const submitExperience = async () => {
    if (!newExperience.title || !newExperience.content) return;
    
    setIsSubmitting(true);
    
    // Get numerology for the experience date
    let numerology = {};
    if (newExperience.experience_date) {
      const response = await base44.functions.invoke('calculateNumerology', {
        type: 'dayNumbers',
        date: newExperience.experience_date,
        lifePath: userMember?.life_path_western
      });
      if (response.data?.success) {
        numerology = {
          universal_day_number: response.data.data.universalDay,
          personal_day_number: response.data.data.personalDay
        };
      }
    }
    
    await base44.entities.SharedExperience.create({
      ...newExperience,
      ...numerology,
      user_name: newExperience.is_anonymous ? 'Anonymous' : (userMember?.nickname || user?.full_name || 'User'),
      life_path_number: userMember?.life_path_western,
      likes_count: 0
    });
    
    setNewExperience({
      title: '',
      content: '',
      category: 'insight',
      experience_date: new Date().toISOString().split('T')[0],
      is_anonymous: false
    });
    setShowForm(false);
    loadExperiences();
    setIsSubmitting(false);
  };

  const likeExperience = async (exp) => {
    await base44.entities.SharedExperience.update(exp.id, {
      likes_count: (exp.likes_count || 0) + 1
    });
    loadExperiences();
  };

  const getCategoryStyle = (cat) => CATEGORIES.find(c => c.value === cat)?.color || 'bg-gray-500/20 text-gray-300';

  return (
    <div className="space-y-6">
      {/* Add New Experience */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              Share Your Experience
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowForm(!showForm)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-1" />
              {showForm ? 'Cancel' : 'New Post'}
            </Button>
          </div>
        </CardHeader>
        {showForm && (
          <CardContent className="space-y-4">
            <Input
              value={newExperience.title}
              onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
              placeholder="Title of your experience"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
            <Textarea
              value={newExperience.content}
              onChange={(e) => setNewExperience({ ...newExperience, content: e.target.value })}
              placeholder="Describe what happened and how it connected to the numbers..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 min-h-[100px]"
            />
            <div className="flex gap-4 flex-wrap">
              <Select value={newExperience.category} onValueChange={(v) => setNewExperience({ ...newExperience, category: v })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newExperience.experience_date}
                onChange={(e) => setNewExperience({ ...newExperience, experience_date: e.target.value })}
                className="bg-white/10 border-white/20 text-white w-40"
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  id="anonymous"
                  checked={newExperience.is_anonymous}
                  onCheckedChange={(checked) => setNewExperience({ ...newExperience, is_anonymous: checked })}
                />
                <label htmlFor="anonymous" className="text-sm text-gray-300">Post anonymously</label>
              </div>
            </div>
            <Button onClick={submitExperience} disabled={!newExperience.title || !newExperience.content || isSubmitting} className="bg-amber-600 hover:bg-amber-700">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Share Experience
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Experiences Feed */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
        </div>
      ) : experiences.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No experiences shared yet. Be the first!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map(exp => (
            <Card key={exp.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{exp.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {exp.user_name}
                      </span>
                      {exp.experience_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(exp.experience_date + 'T12:00:00').toLocaleDateString()}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryStyle(exp.category)}`}>
                        {exp.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {exp.universal_day_number && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500">U</p>
                        <NumberBadge number={exp.universal_day_number} size="sm" />
                      </div>
                    )}
                    {exp.personal_day_number && (
                      <div className="text-center">
                        <p className="text-xs text-amber-400">P</p>
                        <NumberBadge number={exp.personal_day_number} size="sm" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">{exp.content}</p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => likeExperience(exp)}
                    className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/20"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {exp.likes_count || 0}
                  </Button>
                  {exp.life_path_number && (
                    <span className="text-xs text-gray-500">Life Path {exp.life_path_number}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}