import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Calendar, Plus, Loader2, Sparkles, User } from 'lucide-react';
import NumberBadge from '../components/legacy/NumberBadge';

export default function CalendarEvents() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState([]);
  const [dayCalc, setDayCalc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userMember, setUserMember] = useState(null);
  const [newEvent, setNewEvent] = useState({ event_title: '', event_type: 'personal' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadUserAndMember();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      calculateDayNumbers();
      loadEvents();
    }
  }, [selectedDate, userMember]);

  const loadUserAndMember = async () => {
    const user = await base44.auth.me();
    setCurrentUser(user);
    
    // Find family member matching user email
    const members = await base44.entities.FamilyMember.filter({ created_by: user.email });
    if (members.length > 0) {
      // Find self or first member
      const selfMember = members.find(m => m.relationship === 'self') || members[0];
      setUserMember(selfMember);
    }
  };

  const calculateDayNumbers = async () => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    
    const response = await base44.functions.invoke('calculateNumerology', {
      type: 'dayNumbers',
      date: selectedDate,
      lifePath: userMember?.life_path_western || null
    });

    if (response.data?.success) {
      setDayCalc(response.data.data);
    }
    setIsLoading(false);
  };

  const loadEvents = async () => {
    const allEvents = await base44.entities.CalendarEvent.filter({ event_date: selectedDate });
    setEvents(allEvents);
  };

  const addEvent = async () => {
    if (!newEvent.event_title) return;
    
    setIsAdding(true);
    
    await base44.entities.CalendarEvent.create({
      event_date: selectedDate,
      event_title: newEvent.event_title,
      event_type: newEvent.event_type,
      universal_day_number: dayCalc?.universalDay,
      personal_day_number: dayCalc?.personalDay,
      vibe_summary: dayCalc?.vibeSummary || '',
      recommendations: dayCalc?.recommendations || ''
    });
    
    setNewEvent({ event_title: '', event_type: 'personal' });
    loadEvents();
    setIsAdding(false);
  };

  const eventTypes = ['birthday', 'anniversary', 'holiday', 'personal', 'family', 'work', 'spiritual', 'game'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Calendar & Day Numbers</h1>
          <p className="text-gray-300">See your universal and personal day vibes</p>
        </div>

        {/* User Info */}
        {userMember && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium">{userMember.nickname || userMember.full_name}</span>
                <span className="text-gray-400">Life Path:</span>
                <NumberBadge number={userMember.life_path_western} size="sm" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Selector */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white max-w-xs"
            />
          </CardContent>
        </Card>

        {/* Day Numbers */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Day Numbers for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating...
              </div>
            ) : dayCalc ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <p className="text-xs text-gray-400 mb-2">Universal Day</p>
                    <NumberBadge number={dayCalc.universalDay} size="lg" />
                    <p className="text-white text-sm mt-2">{dayCalc.universalDayDisplay}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <p className="text-xs text-gray-400 mb-2">Universal Month</p>
                    <NumberBadge number={dayCalc.universalMonth} size="lg" />
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <p className="text-xs text-gray-400 mb-2">Universal Year</p>
                    <NumberBadge number={dayCalc.universalYear} size="lg" />
                  </div>
                  {dayCalc.personalDay && (
                    <div className="p-4 bg-amber-500/20 rounded-lg text-center border border-amber-500/30">
                      <p className="text-xs text-amber-300 mb-2">Your Personal Day</p>
                      <NumberBadge number={dayCalc.personalDay} size="lg" />
                      <p className="text-amber-200 text-sm mt-2">{dayCalc.personalDayDisplay}</p>
                    </div>
                  )}
                </div>

                {dayCalc.personalMonth && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-500/20 rounded-lg text-center border border-purple-500/30">
                      <p className="text-xs text-purple-300 mb-2">Personal Month</p>
                      <NumberBadge number={dayCalc.personalMonth} size="lg" />
                    </div>
                    <div className="p-4 bg-purple-500/20 rounded-lg text-center border border-purple-500/30">
                      <p className="text-xs text-purple-300 mb-2">Personal Year</p>
                      <NumberBadge number={dayCalc.personalYear} size="lg" />
                    </div>
                  </div>
                )}

                {dayCalc.vibeSummary && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-400 mb-2">Day Vibe</p>
                    <p className="text-white">{dayCalc.vibeSummary}</p>
                  </div>
                )}

                {dayCalc.recommendations && (
                  <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <p className="text-xs text-green-300 mb-2">Recommendations</p>
                    <p className="text-green-100">{dayCalc.recommendations}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400">Select a date to see day numbers</p>
            )}
          </CardContent>
        </Card>

        {/* Add Event */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Input
                value={newEvent.event_title}
                onChange={(e) => setNewEvent({ ...newEvent, event_title: e.target.value })}
                placeholder="Event title"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 flex-1 min-w-[200px]"
              />
              <Select value={newEvent.event_type} onValueChange={(v) => setNewEvent({ ...newEvent, event_type: v })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addEvent} disabled={!newEvent.event_title || isAdding} className="bg-amber-600 hover:bg-amber-700">
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        {events.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Events on this day ({events.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{event.event_title}</p>
                      <p className="text-gray-400 text-sm">{event.event_type}</p>
                    </div>
                    <div className="flex gap-2">
                      {event.universal_day_number && <NumberBadge number={event.universal_day_number} size="sm" />}
                      {event.personal_day_number && <NumberBadge number={event.personal_day_number} size="sm" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}