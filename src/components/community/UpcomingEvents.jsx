import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Calendar, Plus, Star, Zap, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '@/components/legacy/NumberBadge';

export default function UpcomingEvents({ userMember }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [significantDays, setSignificantDays] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'personal' });
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userMember]);

  const loadData = async () => {
    setIsLoading(true);
    const today = new Date();
    const nextTwoWeeks = new Date();
    nextTwoWeeks.setDate(today.getDate() + 14);
    const todayStr = today.toISOString().split('T')[0];
    const nextTwoWeeksStr = nextTwoWeeks.toISOString().split('T')[0];
    
    // Get user events
    const events = await base44.entities.CalendarEvent.list('-event_date', 100);
    const upcoming = events.filter(e => 
      e.event_date >= todayStr && e.event_date <= nextTwoWeeksStr
    ).slice(0, 5);
    setUpcomingEvents(upcoming);
    
    // Get significant numerology days
    const response = await base44.functions.invoke('populateCalendarPredictions', {
      startDate: todayStr,
      endDate: nextTwoWeeksStr,
      lifePath: userMember?.life_path_western
    });
    
    if (response.data?.success) {
      const significant = response.data.data.predictions.filter(d => 
        d.is_master_day || d.is_power_day || d.is_aligned
      );
      setSignificantDays(significant);
    }
    setIsLoading(false);
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    setIsAdding(true);
    
    let eventNumerology = {};
    const calcResponse = await base44.functions.invoke('calculateNumerology', {
      type: 'dayNumbers',
      date: newEvent.date,
      lifePath: userMember?.life_path_western || null
    });
    
    if (calcResponse.data?.success) {
      eventNumerology = {
        universal_day_number: calcResponse.data.data.universalDay,
        personal_day_number: calcResponse.data.data.personalDay,
        vibe_summary: calcResponse.data.data.vibeSummary || '',
        recommendations: calcResponse.data.data.recommendations || ''
      };
    }
    
    await base44.entities.CalendarEvent.create({
      event_date: newEvent.date,
      event_title: newEvent.title,
      event_type: newEvent.type,
      ...eventNumerology,
      user_id: userMember?.id,
      family_member_id: userMember?.id
    });
    
    setNewEvent({ title: '', date: '', type: 'personal' });
    setShowAddEvent(false);
    setIsAdding(false);
    loadData();
  };

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="py-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Upcoming Important Dates
          </CardTitle>
          <Button 
            size="sm" 
            onClick={() => setShowAddEvent(!showAddEvent)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add Event Form */}
        {showAddEvent && (
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
            <Input
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
            <div className="flex gap-2">
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="bg-white/10 border-white/20 text-white flex-1"
              />
              <Select value={newEvent.type} onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}>
                <SelectTrigger className="w-28 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="spiritual">Spiritual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addEvent} disabled={!newEvent.title || !newEvent.date || isAdding} size="sm" className="bg-amber-600 hover:bg-amber-700">
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddEvent(false)} className="text-gray-400">Cancel</Button>
            </div>
          </div>
        )}
        
        {/* Significant Numerology Days */}
        {significantDays.slice(0, 3).map(day => {
          const dayDate = new Date(day.date + 'T12:00:00');
          const today = new Date();
          const daysUntil = Math.ceil((dayDate - today) / (1000 * 60 * 60 * 24));
          
          return (
            <div 
              key={day.date} 
              className={`flex items-center justify-between p-2 rounded-lg ${
                day.is_master_day ? 'bg-amber-500/20 border border-amber-500/30' :
                day.is_power_day ? 'bg-green-500/20 border border-green-500/30' :
                'bg-blue-500/20 border border-blue-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {day.is_master_day ? <Star className="w-4 h-4 text-amber-400" /> :
                 day.is_power_day ? <Zap className="w-4 h-4 text-green-400" /> :
                 <Sparkles className="w-4 h-4 text-blue-400" />}
                <div>
                  <p className="text-white text-sm font-medium">
                    {day.is_master_day ? `Master ${day.universal_day_number}` :
                     day.is_power_day ? 'Power Day' : 'Aligned'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NumberBadge number={day.universal_day_number} size="sm" />
                <span className="text-xs text-gray-400">
                  {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tmrw' : `${daysUntil}d`}
                </span>
              </div>
            </div>
          );
        })}
        
        {/* User Events */}
        {upcomingEvents.map(event => {
          const eventDate = new Date(event.event_date + 'T12:00:00');
          const today = new Date();
          const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
          const isToday = daysUntil <= 0;
          const isSoon = daysUntil <= 3;
          
          return (
            <div 
              key={event.id} 
              className={`flex items-center justify-between p-2 rounded-lg ${
                isToday ? 'bg-red-500/20 border border-red-500/30' : 
                isSoon ? 'bg-orange-500/20 border border-orange-500/30' : 
                'bg-white/5 border border-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                {(isToday || isSoon) && <AlertTriangle className={`w-4 h-4 ${isToday ? 'text-red-400' : 'text-orange-400'}`} />}
                <div>
                  <p className="text-white text-sm font-medium">{event.event_title}</p>
                  <p className="text-gray-400 text-xs">
                    {eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {event.universal_day_number && <NumberBadge number={event.universal_day_number} size="sm" />}
                <span className={`text-xs ${isToday ? 'text-red-400' : isSoon ? 'text-orange-400' : 'text-gray-400'}`}>
                  {isToday ? 'Today!' : daysUntil === 1 ? 'Tmrw' : `${daysUntil}d`}
                </span>
              </div>
            </div>
          );
        })}

        {upcomingEvents.length === 0 && significantDays.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No upcoming events</p>
        )}

        <Link to={createPageUrl('CalendarEvents')} className="block text-center text-purple-400 hover:text-purple-300 text-sm mt-2">
          View Full Calendar →
        </Link>
      </CardContent>
    </Card>
  );
}