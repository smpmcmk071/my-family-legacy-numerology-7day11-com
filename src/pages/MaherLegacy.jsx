import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Sparkles, ArrowLeft, AlertTriangle, Calendar, Plus, Star, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import DailySongs from '../components/legacy/DailySongs';
import { numerologyMeanings } from '../components/legacy/numerologyData';
import { base44 } from '@/api/base44Client';

export default function MaherLegacy() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [significantDays, setSignificantDays] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'personal', number: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [userMember, setUserMember] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = await base44.auth.me();
    
    // Get user's family member for life path
    let members = await base44.entities.FamilyMember.filter({ email: user.email });
    let selfMember = members.find(m => m.relationship === 'self') || members[0];
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
      selfMember = createdMembers.find(m => m.relationship === 'self') || createdMembers[0];
    }
    setUserMember(selfMember);
    
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
      lifePath: selfMember?.life_path_western
    });
    
    if (response.data?.success) {
      const significant = response.data.data.predictions.filter(d => 
        d.is_master_day || d.is_power_day || d.is_aligned
      );
      setSignificantDays(significant);
    }
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    setIsAdding(true);
    
    // Calculate numerology for the date
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
    
    setNewEvent({ title: '', date: '', type: 'personal', number: '' });
    setShowAddEvent(false);
    setIsAdding(false);
    loadData();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4 print:hidden">
            <ArrowLeft className="w-4 h-4" />
            Back to Family
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The Maher Legacy
            </h1>
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-xl text-gray-600 italic">Four Generations of Vision, Power & Love</p>
          <Button
            onClick={handlePrint}
            className="mt-6 print:hidden bg-amber-600 hover:bg-amber-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border-l-4 border-amber-600">
          <p className="text-gray-700 leading-relaxed text-lg">
            From Thomas Francis and Mary Agnes through John Francis and Elizabeth JoAnn, to Stephen and Amy, down to Christian, Kyle, and Melanie—
            this is the story of a family woven together by master numbers, wisdom, achievement, and unconditional love.
            <span className="print:hidden"> Click any number to explore its deeper meaning.</span>
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Our Family's Master Number Map
          </h2>
          <FamilyTable onNumberClick={setSelectedNumber} />
        </div>

        {/* Calendar & Significant Days */}
        {(upcomingEvents.length > 0 || significantDays.length > 0) && (
          <div className="mb-12 print:hidden">
            <div className="p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Important Dates
                </h3>
                <Button 
                  size="sm" 
                  onClick={() => setShowAddEvent(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Event
                </Button>
              </div>
              
              {/* Add Event Form */}
              {showAddEvent && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-purple-200 space-y-3">
                  <Input
                    placeholder="Event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="border-purple-200"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="border-purple-200 flex-1"
                    />
                    <Select value={newEvent.type} onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}>
                      <SelectTrigger className="w-32 border-purple-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                        <SelectItem value="spiritual">Spiritual</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addEvent} disabled={!newEvent.title || !newEvent.date || isAdding} className="bg-purple-600 hover:bg-purple-700">
                      {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Event'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddEvent(false)}>Cancel</Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {/* Significant Numerology Days */}
                {significantDays.slice(0, 3).map(day => {
                  const dayDate = new Date(day.date + 'T12:00:00');
                  const today = new Date();
                  const daysUntil = Math.ceil((dayDate - today) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div 
                      key={day.date} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        day.is_master_day ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300' :
                        day.is_power_day ? 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300' :
                        'bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {day.is_master_day ? <Star className="w-4 h-4 text-amber-600" /> :
                         day.is_power_day ? <Zap className="w-4 h-4 text-green-600" /> :
                         <Sparkles className="w-4 h-4 text-blue-600" />}
                        <div>
                          <p className="font-medium text-gray-900">
                            {day.is_master_day ? `Master ${day.universal_day_number} Day` :
                             day.is_power_day ? 'Power Day' : 'Aligned Day'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={day.universal_day_number} size="sm" onClick={setSelectedNumber} />
                        <span className="text-sm text-gray-500">
                          {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
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
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isToday ? 'bg-red-100 border border-red-300' : 
                        isSoon ? 'bg-amber-100 border border-amber-300' : 
                        'bg-white/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {(isToday || isSoon) && <AlertTriangle className={`w-4 h-4 ${isToday ? 'text-red-600' : 'text-amber-600'}`} />}
                        <div>
                          <p className="font-medium text-gray-900">{event.event_title}</p>
                          <p className="text-sm text-gray-600">
                            {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            {' • '}<span className="capitalize">{event.event_type}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.universal_day_number && (
                          <NumberBadge number={event.universal_day_number} size="sm" onClick={setSelectedNumber} />
                        )}
                        <span className={`text-sm font-medium ${isToday ? 'text-red-600' : isSoon ? 'text-amber-600' : 'text-gray-500'}`}>
                          {isToday ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link to={createPageUrl('CalendarEvents')} className="inline-flex items-center gap-1 mt-4 text-purple-700 hover:text-purple-900 text-sm font-medium">
                View Full Calendar →
              </Link>
            </div>
          </div>
        )}

        {/* Daily Songs */}
        <div className="mb-12 print:hidden">
          <DailySongs />
        </div>

        {/* The Weave of Power Through Generations */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Weave of Power Through Generations</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Thomas Francis & Mary Agnes</strong> (Great-Grandparents): The foundation with 
              <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> master vision, <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> humanitarian wisdom, 
              and <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> achievement power—establishing the family's spiritual architecture.
            </p>
            <p>
              <strong className="text-gray-900">John Francis & Elizabeth JoAnn</strong> (Grandparents): The builders with 
              <NumberBadge number={22} onClick={setSelectedNumber} size="sm" /> master building, <NumberBadge number={33} onClick={setSelectedNumber} size="sm" /> master healing, 
              and <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> wisdom—creating an unshakeable foundation of love and insight.
            </p>
            <p>
              <strong className="text-gray-900">Stephen, David & Kenneth</strong> (The Brothers): The bridge generation carrying 
              <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> wisdom, triple <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> vision, 
              <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> completion, and <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> achievement forward.
            </p>
            <p>
              <strong className="text-gray-900">Stephen & Amy</strong> (Parents): Rare double <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> visionaries 
              with <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> power and <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> nurturing—
              guiding the next generation with love and purpose.
            </p>
            <p>
              <strong className="text-gray-900">Christian, Kyle & Melanie</strong> (The Children): The inheritors—carrying double <NumberBadge number={8} onClick={setSelectedNumber} size="sm" />, 
              master <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />, <NumberBadge number={33} onClick={setSelectedNumber} size="sm" /> healing, 
              and the complete legacy of four generations into the future.
            </p>
          </div>
        </div>

        {/* Key Family Numbers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Family's Core Numbers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={7} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Wisdom Thread</span>
              </div>
              <p className="text-gray-700">Mary Agnes ➡️ John Francis ➡️ Stephen ➡️ Christian. The seekers who look beyond the surface.</p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={8} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Achievement Power</span>
              </div>
              <p className="text-gray-700">Mary Agnes ➡️ Elizabeth ➡️ Stephen/Amy ➡️ Christian/Kyle. The builders who manifest dreams.</p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={11} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Master Visionary Channel</span>
              </div>
              <p className="text-gray-700">Thomas ➡️ John Francis ➡️ Stephen/Amy/Kenneth/David ➡️ Christian. The illuminators.</p>
            </div>

            <div className="p-6 bg-pink-50 rounded-lg border-l-4 border-pink-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={6} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Nurturing Foundation</span>
              </div>
              <p className="text-gray-700">Thomas (personality) ➡️ Elizabeth JoAnn ➡️ Amy ➡️ Christian/Melanie. The caregivers and harmonizers.</p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={33} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Master Healer</span>
              </div>
              <p className="text-gray-700">Elizabeth JoAnn ➡️ Melanie. The silent guides who teach through compassion.</p>
            </div>

            <div className="p-6 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={9} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Humanitarian Line</span>
              </div>
              <p className="text-gray-700">Mary Agnes ➡️ John Francis ➡️ David/Kenneth ➡️ Amy. Completing cycles with wisdom and love.</p>
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Family Legacy Means</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            The Maher family is not built by chance—it is architected by destiny. Four generations of 
            <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> wisdom, 
            <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> achievement, 
            <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> vision, 
            <NumberBadge number={22} onClick={setSelectedNumber} size="sm" /> building, and 
            <NumberBadge number={33} onClick={setSelectedNumber} size="sm" /> healing converge to create a legacy of purpose.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            The <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> nurturing thread—woven through Thomas's personality, 
            Elizabeth JoAnn's life path, Amy's personality, and into Christian and Melanie—ensures this power is always balanced with love, 
            responsibility, and care for others.
          </p>
          <p className="text-gray-900 font-bold text-xl">
            This is more than a family tree—it is a constellation of purpose, where every number proves that the Mahers 
            were meant to build, heal, teach, and illuminate the world.
          </p>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "The numbers do not direct your fate—they remind you that you are never alone. 
            You carry all of us in you: a builder, a seeker, and a healer for the world."
          </blockquote>
          <div className="mt-6 pt-6 border-t-2 border-gray-300">
            <p className="text-lg font-semibold text-gray-900">The Maher Family</p>
            <p className="text-gray-600">November 2025</p>
          </div>
        </div>
      </div>

      {/* Number Explanation Modal */}
      <Dialog open={!!selectedNumber} onOpenChange={() => setSelectedNumber(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                {selectedNumber}
              </span>
              {numerologyMeanings[selectedNumber]?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">General Meaning</h3>
              <p className="text-gray-700 leading-relaxed">{numerologyMeanings[selectedNumber]?.meaning}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">In the Maher Family</h3>
              <p className="text-gray-700 leading-relaxed">{numerologyMeanings[selectedNumber]?.familyContext}</p>
            </div>
            {numerologyMeanings[selectedNumber]?.keywords && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Key Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {numerologyMeanings[selectedNumber].keywords.map((keyword, idx) => (
                    <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:mb-8 {
            margin-bottom: 2rem !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}