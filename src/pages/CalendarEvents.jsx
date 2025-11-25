import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { Calendar, Plus, Loader2, Sparkles, User, Repeat, Trash2 } from 'lucide-react';
import NumberBadge from '../components/legacy/NumberBadge';

// Get current date in EST timezone
const getESTDate = () => {
  const now = new Date();
  const estParts = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  return estParts; // Returns YYYY-MM-DD format directly
};

export default function CalendarEvents() {
  const [selectedDate, setSelectedDate] = useState(() => {
  // Force current EST date
  const now = new Date();
  const year = now.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' });
  const month = now.toLocaleString('en-US', { timeZone: 'America/New_York', month: '2-digit' });
  const day = now.toLocaleString('en-US', { timeZone: 'America/New_York', day: '2-digit' });
  return `${year}-${month}-${day}`;
});
  const [events, setEvents] = useState([]);
  const [dayCalc, setDayCalc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userMember, setUserMember] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    event_title: '', 
    event_type: 'personal',
    is_recurring: false,
    recurrence_type: 'none',
    recurrence_count: 1,
    attach_numerology: true
  });
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
    
    // Find family member by email first
    let members = await base44.entities.FamilyMember.filter({ email: user.email });
    let selfMember = members.find(m => m.relationship === 'self') || members[0];
    
    // Fallback: check members created by user
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
      selfMember = createdMembers.find(m => m.relationship === 'self') || createdMembers[0];
    }
    
    if (selfMember) {
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
    if (!newEvent.event_title || !selectedDate) return;
    
    setIsAdding(true);
    
    const datesToCreate = [selectedDate];
    
    // Generate recurring dates
    if (newEvent.is_recurring && newEvent.recurrence_type !== 'none' && newEvent.recurrence_count > 1) {
      const baseDate = new Date(selectedDate + 'T12:00:00');
      for (let i = 1; i < newEvent.recurrence_count; i++) {
        const newDate = new Date(baseDate);
        if (newEvent.recurrence_type === 'daily') {
          newDate.setDate(baseDate.getDate() + i);
        } else if (newEvent.recurrence_type === 'weekly') {
          newDate.setDate(baseDate.getDate() + (i * 7));
        } else if (newEvent.recurrence_type === 'monthly') {
          newDate.setMonth(baseDate.getMonth() + i);
        } else if (newEvent.recurrence_type === 'yearly') {
          newDate.setFullYear(baseDate.getFullYear() + i);
        }
        datesToCreate.push(newDate.toISOString().split('T')[0]);
      }
    }
    
    // Create events for each date with accurate numerology
    for (const eventDate of datesToCreate) {
      let eventNumerology = { universalDay: null, personalDay: null, vibeSummary: '', recommendations: '' };
      
      if (newEvent.attach_numerology) {
        // Calculate accurate numerology for each specific date
        const calcResponse = await base44.functions.invoke('calculateNumerology', {
          type: 'dayNumbers',
          date: eventDate,
          lifePath: userMember?.life_path_western || null
        });
        
        if (calcResponse.data?.success) {
          eventNumerology = {
            universalDay: calcResponse.data.data.universalDay,
            personalDay: calcResponse.data.data.personalDay,
            vibeSummary: calcResponse.data.data.vibeSummary || '',
            recommendations: calcResponse.data.data.recommendations || ''
          };
        }
      }
      
      await base44.entities.CalendarEvent.create({
        event_date: eventDate,
        event_title: newEvent.event_title,
        event_type: newEvent.event_type,
        universal_day_number: eventNumerology.universalDay,
        personal_day_number: eventNumerology.personalDay,
        vibe_summary: eventNumerology.vibeSummary,
        recommendations: eventNumerology.recommendations,
        user_id: userMember?.id,
        family_member_id: userMember?.id
      });
    }
    
    setNewEvent({ 
      event_title: '', 
      event_type: 'personal',
      is_recurring: false,
      recurrence_type: 'none',
      recurrence_count: 1,
      attach_numerology: true
    });
    loadEvents();
    setIsAdding(false);
  };

  const deleteEvent = async (eventId) => {
    await base44.entities.CalendarEvent.delete(eventId);
    loadEvents();
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
              Add Event for {selectedDate}
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
            </div>
            
            {/* Recurring Options */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="recurring" 
                  checked={newEvent.is_recurring}
                  onCheckedChange={(checked) => setNewEvent({ ...newEvent, is_recurring: checked })}
                />
                <label htmlFor="recurring" className="text-sm text-gray-300 flex items-center gap-1">
                  <Repeat className="w-4 h-4" /> Recurring
                </label>
              </div>
              
              {newEvent.is_recurring && (
                <>
                  <Select value={newEvent.recurrence_type} onValueChange={(v) => setNewEvent({ ...newEvent, recurrence_type: v })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white w-32">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="2"
                      max="52"
                      value={newEvent.recurrence_count}
                      onChange={(e) => setNewEvent({ ...newEvent, recurrence_count: parseInt(e.target.value) || 2 })}
                      className="bg-white/10 border-white/20 text-white w-20"
                    />
                    <span className="text-gray-400 text-sm">occurrences</span>
                  </div>
                </>
              )}
            </div>

            {/* Attach Numerology */}
            <div className="flex items-center gap-2">
              <Checkbox 
                id="attach-numerology" 
                checked={newEvent.attach_numerology}
                onCheckedChange={(checked) => setNewEvent({ ...newEvent, attach_numerology: checked })}
              />
              <label htmlFor="attach-numerology" className="text-sm text-gray-300 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" /> Attach personalized numerology insights to event
              </label>
            </div>

            <Button onClick={addEvent} disabled={!newEvent.event_title || !selectedDate || isAdding} className="bg-amber-600 hover:bg-amber-700 w-full md:w-auto">
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating {newEvent.is_recurring ? `${newEvent.recurrence_count} events...` : 'event...'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event {newEvent.is_recurring ? `(${newEvent.recurrence_count}x)` : ''}
                </>
              )}
            </Button>
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
                  <div key={event.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{event.event_title}</p>
                        <p className="text-gray-400 text-sm capitalize">{event.event_type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.universal_day_number && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500">U-Day</p>
                            <NumberBadge number={event.universal_day_number} size="sm" />
                          </div>
                        )}
                        {event.personal_day_number && (
                          <div className="text-center">
                            <p className="text-xs text-amber-400">P-Day</p>
                            <NumberBadge number={event.personal_day_number} size="sm" />
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Attached Numerology Insights */}
                    {(event.vibe_summary || event.recommendations) && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        {event.vibe_summary && (
                          <div className="p-2 bg-purple-500/10 rounded text-sm">
                            <p className="text-purple-300 text-xs mb-1">Day Vibe</p>
                            <p className="text-gray-300">{event.vibe_summary}</p>
                          </div>
                        )}
                        {event.recommendations && (
                          <div className="p-2 bg-green-500/10 rounded text-sm">
                            <p className="text-green-300 text-xs mb-1">Recommendations</p>
                            <p className="text-gray-300">{event.recommendations}</p>
                          </div>
                        )}
                      </div>
                    )}
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