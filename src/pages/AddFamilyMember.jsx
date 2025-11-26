import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { UserPlus, Calculator, Loader2, CheckCircle2, Sparkles, Users, RefreshCw, MapPin, Music } from 'lucide-react';
import NumberBadge from '../components/legacy/NumberBadge';
import { buildMemberDataFromCalc } from '../components/utils/numerologyHelpers';
import { getSongRecommendations } from '../components/utils/songRecommendations';

// Simple ZIP code to City/State lookup (common US ZIP codes)
const ZIP_LOOKUP = {
  '19026': 'Drexel Hill, PA',
  '19018': 'Clifton Heights, PA',
  '19023': 'Darby, PA',
  '19064': 'Springfield, PA',
  '19082': 'Upper Darby, PA',
  '19083': 'Havertown, PA',
  '19010': 'Bryn Mawr, PA',
  '19041': 'Haverford, PA',
  '19087': 'Wayne, PA',
  '19380': 'West Chester, PA',
  '19103': 'Philadelphia, PA',
  '19104': 'Philadelphia, PA',
  '10001': 'New York, NY',
  '10002': 'New York, NY',
  '90210': 'Beverly Hills, CA',
  '33101': 'Miami, FL',
  '60601': 'Chicago, IL',
  '02101': 'Boston, MA',
  '75201': 'Dallas, TX',
  '85001': 'Phoenix, AZ',
  '98101': 'Seattle, WA',
  '30301': 'Atlanta, GA'
};

export default function AddFamilyMember() {
  const [formData, setFormData] = useState({
    full_name: '',
    nickname: '',
    email: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    relationship: '',
    generation: '',
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedData, setCalculatedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userFamily, setUserFamily] = useState(null);
  const [existingMembers, setExistingMembers] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [displayMethod, setDisplayMethod] = useState('western'); // 'western' or 'chaldean'

  // ZIP code lookup effect
  useEffect(() => {
    if (formData.zip_code?.length === 5 && ZIP_LOOKUP[formData.zip_code]) {
      setFormData(prev => ({ ...prev, birth_place: ZIP_LOOKUP[formData.zip_code] }));
    }
  }, [formData.zip_code]);

  // Get current user and their family
  useEffect(() => {
    const loadUserFamily = async () => {
      const user = await base44.auth.me();
      
      // Check if this is a self-setup flow
      const urlParams = new URLSearchParams(window.location.search);
      const isSetupSelf = urlParams.get('setupSelf') === 'true';
      
      if (isSetupSelf) {
        // Pre-fill with user's info for self-setup
        setFormData(prev => ({
          ...prev,
          full_name: user.full_name || '',
          email: user.email,
          relationship: 'self'
        }));
      }
      
      // First check if user already has a family member profile with a family_id
      let existingMemberWithFamily = await base44.entities.FamilyMember.filter({ email: user.email });
      if (existingMemberWithFamily.length > 0 && existingMemberWithFamily[0].family_id) {
        // User already belongs to a family
        const familyId = existingMemberWithFamily[0].family_id;
        const families = await base44.entities.Family.filter({ id: familyId });
        if (families.length > 0) {
          setUserFamily(families[0]);
          const members = await base44.entities.FamilyMember.filter({ family_id: familyId });
          setExistingMembers(members);
          return;
        }
      }
      
      // Check if user is admin of a family
      const families = await base44.entities.Family.filter({ admin_email: user.email });
      if (families.length > 0) {
        setUserFamily(families[0]);
        // Load existing members
        const members = await base44.entities.FamilyMember.filter({ family_id: families[0].id });
        setExistingMembers(members);
      } else if (isSetupSelf) {
        // Only create a new family if this is self-setup (new user creating profile)
        const newFamily = await base44.entities.Family.create({
          name: `${user.full_name?.split(' ').pop() || 'My'} Family`,
          admin_email: user.email,
          description: `Family group for ${user.full_name || user.email}`
        });
        setUserFamily(newFamily);
      }
    };
    loadUserFamily();
  }, []);

  const loadMemberForEdit = (member) => {
    setEditingMemberId(member.id);
    setFormData({
      full_name: member.full_name || '',
      nickname: member.nickname || '',
      email: member.email || '',
      birth_date: member.birth_date || '',
      birth_time: member.birth_time || '',
      birth_place: member.birth_place || '',
      relationship: member.relationship || '',
      generation: member.generation?.toString() || ''
    });
    setCalculatedData(null);
  };

  const clearForm = () => {
    setEditingMemberId(null);
    setFormData({
      full_name: '',
      nickname: '',
      email: '',
      birth_date: '',
      birth_time: '',
      birth_place: '',
      relationship: '',
      generation: ''
    });
    setCalculatedData(null);
    setSaved(false);
  };

  const handleCalculate = async () => {
        if (!formData.full_name || !formData.birth_date) return;

        setIsCalculating(true);
        setCalculatedData(null);

        const response = await base44.functions.invoke('calculateNumerology', {
          type: 'name',
          name: formData.full_name,
          birthDate: formData.birth_date,
          birthTime: formData.birth_time_exact || formData.birth_time,
          birthPlace: formData.birth_place
        });

        if (response.data?.success) {
          setCalculatedData(response.data.data);
        }
        setIsCalculating(false);
      };

  const handleSave = async () => {
    if (!calculatedData || !userFamily) return;

    setIsSaving(true);

    const calcData = buildMemberDataFromCalc(calculatedData);
      const memberData = {
        family_id: userFamily.id,
        full_name: formData.full_name,
        nickname: formData.nickname || formData.full_name.split(' ')[0],
        email: formData.email || null,
        birth_date: formData.birth_date,
        birth_time: formData.birth_time_exact || formData.birth_time || '',
        birth_place: formData.birth_place,
        relationship: formData.relationship,
        generation: formData.generation ? parseInt(formData.generation) : null,
        ...calcData,
        is_active: true
      };

    if (editingMemberId) {
      await base44.entities.FamilyMember.update(editingMemberId, memberData);
    } else {
      await base44.entities.FamilyMember.create(memberData);
    }
    
    // Refresh members list
    const members = await base44.entities.FamilyMember.filter({ family_id: userFamily.id });
    setExistingMembers(members);
    
    setIsSaving(false);
    setSaved(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      clearForm();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {editingMemberId ? 'Update Family Member' : 'Add Family Member'}
          </h1>
          <p className="text-gray-300">Enter details and calculate numerology</p>
          {userFamily && (
            <p className="text-amber-400 mt-2">{userFamily.name}</p>
          )}
        </div>

        {/* Existing Members */}
        {existingMembers.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Existing Members ({existingMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {existingMembers.map(member => (
                  <Button
                    key={member.id}
                    variant={editingMemberId === member.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => loadMemberForEdit(member)}
                    className={editingMemberId === member.id ? "bg-amber-600" : "border-white/20 text-gray-300 bg-white/5 hover:bg-white/10"}
                  >
                    {member.nickname || member.full_name.split(' ')[0]}
                    {member.life_path && <span className="ml-1 text-xs opacity-70">LP:{member.life_path}</span>}
                  </Button>
                ))}
                {editingMemberId && (
                  <Button variant="ghost" size="sm" onClick={clearForm} className="text-gray-400 hover:text-white">
                    <RefreshCw className="w-4 h-4 mr-1" /> New
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Member Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Full Name *</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Francis Maher"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Nickname</label>
                <Input
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="Grandpop"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Email (for dashboard access)</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="family@example.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Link to their user account for personal dashboard</p>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Birth Date *</label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.birth_date?.split('-')[0] || ''} 
                    onValueChange={(year) => {
                      const parts = (formData.birth_date || '--').split('-');
                      setFormData({ ...formData, birth_date: `${year}-${parts[1] || ''}-${parts[2] || ''}` });
                    }}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white flex-1">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={formData.birth_date?.split('-')[1] || ''} 
                    onValueChange={(month) => {
                      const parts = (formData.birth_date || '--').split('-');
                      setFormData({ ...formData, birth_date: `${parts[0] || ''}-${month}-${parts[2] || ''}` });
                    }}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white flex-1">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {['01-Jan','02-Feb','03-Mar','04-Apr','05-May','06-Jun','07-Jul','08-Aug','09-Sep','10-Oct','11-Nov','12-Dec'].map(m => (
                        <SelectItem key={m.split('-')[0]} value={m.split('-')[0]}>{m.split('-')[1]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={formData.birth_date?.split('-')[2] || ''} 
                    onValueChange={(day) => {
                      const parts = (formData.birth_date || '--').split('-');
                      setFormData({ ...formData, birth_date: `${parts[0] || ''}-${parts[1] || ''}-${day}` });
                    }}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white flex-1">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Birth Time</label>
                <Select value={formData.birth_time} onValueChange={(v) => setFormData({ ...formData, birth_time: v })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select time of day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6am - 12pm)</SelectItem>
                    <SelectItem value="midday">Midday (12pm - 2pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2pm - 6pm)</SelectItem>
                    <SelectItem value="evening">Evening (6pm - 9pm)</SelectItem>
                    <SelectItem value="night">Night (9pm - 12am)</SelectItem>
                    <SelectItem value="late_night">Late Night (12am - 6am)</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={formData.birth_time_exact || ''}
                  onChange={(e) => setFormData({ ...formData, birth_time_exact: e.target.value })}
                  placeholder="Or enter exact time (e.g., 11:06 PM EST)"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 mt-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Birth Place</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.zip_code || ''}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    placeholder="ZIP Code"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 w-28"
                    maxLength={5}
                  />
                  <Input
                    value={formData.birth_place}
                    onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
                    placeholder="City, State"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Relationship</label>
                <Select value={formData.relationship} onValueChange={(v) => setFormData({ ...formData, relationship: v })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="great-grandparent">Great-Grandparent</SelectItem>
                    <SelectItem value="grandparent">Grandparent</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="uncle">Uncle</SelectItem>
                    <SelectItem value="aunt">Aunt</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="cousin">Cousin</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="self">Self</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Generation</label>
                <Select value={formData.generation} onValueChange={(v) => setFormData({ ...formData, generation: v })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select generation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Great-Grandparents</SelectItem>
                    <SelectItem value="2">2 - Grandparents</SelectItem>
                    <SelectItem value="3">3 - Parents</SelectItem>
                    <SelectItem value="4">4 - Children</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCalculate}
                disabled={!formData.full_name || !formData.birth_date || isCalculating}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Numerology
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Numerology Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!calculatedData ? (
                <div className="text-center text-gray-400 py-12">
                  Enter name and birthdate, then click Calculate
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Method Toggle */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={displayMethod === 'western' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDisplayMethod('western')}
                      className={displayMethod === 'western' ? 'bg-amber-600' : 'border-white/20 text-white hover:bg-white/10'}
                    >
                      Western (Pythagorean)
                    </Button>
                    <Button
                      variant={displayMethod === 'chaldean' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDisplayMethod('chaldean')}
                      className={displayMethod === 'chaldean' ? 'bg-amber-600' : 'border-white/20 text-white hover:bg-white/10'}
                    >
                      Chaldean (Eastern)
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    {displayMethod === 'western' 
                      ? 'Western: Add full numbers (11+7+1969=1987→25/7)' 
                      : 'Chaldean: Sum all digits (1+1+0+7+1+9+6+9=34/7)'}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Life Path</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={displayMethod === 'western' ? calculatedData.lifePath?.reduced : calculatedData.lifePathChaldean?.reduced} size="lg" />
                        <span className="text-white text-sm">{displayMethod === 'western' ? calculatedData.lifePath?.display : calculatedData.lifePathChaldean?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Expression</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={displayMethod === 'western' ? calculatedData.expression?.reduced : calculatedData.expressionChaldean?.reduced} size="lg" />
                        <span className="text-white text-sm">{displayMethod === 'western' ? calculatedData.expression?.display : calculatedData.expressionChaldean?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Soul Urge</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={displayMethod === 'western' ? calculatedData.soulUrge?.reduced : calculatedData.soulUrgeChaldean?.reduced} size="lg" />
                        <span className="text-white text-sm">{displayMethod === 'western' ? calculatedData.soulUrge?.display : calculatedData.soulUrgeChaldean?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Personality</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={displayMethod === 'western' ? calculatedData.personality?.reduced : calculatedData.personalityChaldean?.reduced} size="lg" />
                        <span className="text-white text-sm">{displayMethod === 'western' ? calculatedData.personality?.display : calculatedData.personalityChaldean?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Birthday Vibe</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={calculatedData.birthday?.reduced} size="lg" />
                        <span className="text-white text-sm">{calculatedData.birthday?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Master Numbers</p>
                      <div className="flex gap-1 flex-wrap">
                        {calculatedData.masterNumbers?.length > 0 ? (
                          calculatedData.masterNumbers.map((num, i) => (
                            <NumberBadge key={i} number={num} size="sm" />
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-gray-400 mb-1">Karmic Debt</p>
                                                <div className="flex gap-1 flex-wrap">
                                                  {calculatedData.karmicDebt?.numbers?.length > 0 ? (
                                                    calculatedData.karmicDebt.numbers.map((num, i) => (
                                                      <span key={i} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">{num}</span>
                                                    ))
                                                  ) : (
                                                    <span className="text-gray-500 text-sm">None</span>
                                                  )}
                                                </div>
                                              </div>
                                              <div className="p-3 bg-white/5 rounded-lg col-span-2">
                                                <p className="text-xs text-gray-400 mb-1">Karmic Lessons (Missing Numbers)</p>
                                                <div className="flex gap-1 flex-wrap">
                                                  {calculatedData.karmicLessons?.lessons?.length > 0 ? (
                                                    calculatedData.karmicLessons.lessons.map((num, i) => (
                                                      <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm" title={calculatedData.karmicLessons.lessonMeanings?.find(l => l.number === num)?.meaning}>
                                                        {num}
                                                      </span>
                                                    ))
                                                  ) : (
                                                    <span className="text-gray-500 text-sm">None - all numbers present!</span>
                                                  )}
                                                </div>
                                                {calculatedData.karmicLessons?.lessons?.length > 0 && (
                                                  <div className="mt-2 text-xs text-gray-400">
                                                    {calculatedData.karmicLessons.lessonMeanings?.map((lesson, i) => (
                                                      <p key={i} className="mt-1">
                                                        <span className="text-orange-400">{lesson.number}:</span> {lesson.meaning}
                                                      </p>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                  <div className="pt-4 border-t border-white/10">
                                            <p className="text-xs text-gray-400 mb-2">Astrology - Big Three</p>
                                            <div className="flex gap-4 text-sm text-gray-300 flex-wrap mb-2">
                                              <span title="Sun Sign">☉ {calculatedData.astrology?.sunSign || '-'}</span>
                                              <span title="Moon Sign">☽ {calculatedData.astrology?.moonSign || '-'}</span>
                                              <span title="Rising/Ascendant">↑ {calculatedData.astrology?.ascendantDisplay || calculatedData.astrology?.ascendant || '-'}</span>
                                            </div>
                                            {calculatedData.astrology?.bigThree && (
                                              <p className="text-amber-400 text-sm font-medium mb-2">
                                                {calculatedData.astrology.bigThree}
                                              </p>
                                            )}
                                            <div className="flex gap-4 text-xs text-gray-400 mb-2">
                                              <span>♇ {calculatedData.astrology?.rulingPlanet || '-'}</span>
                                              <span>{calculatedData.astrology?.modality || '-'}</span>
                                            </div>
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                calculatedData.astrology?.sunElement === 'Water' ? 'bg-blue-500/30 text-blue-300' :
                                                calculatedData.astrology?.sunElement === 'Fire' ? 'bg-red-500/30 text-red-300' :
                                                calculatedData.astrology?.sunElement === 'Air' ? 'bg-cyan-500/30 text-cyan-300' :
                                                'bg-green-500/30 text-green-300'
                                              }`}>
                                                {calculatedData.astrology?.sunElement || calculatedData.astrology?.element || '-'} ☉
                                              </span>
                                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                calculatedData.astrology?.moonElement === 'Water' ? 'bg-blue-500/30 text-blue-300' :
                                                calculatedData.astrology?.moonElement === 'Fire' ? 'bg-red-500/30 text-red-300' :
                                                calculatedData.astrology?.moonElement === 'Air' ? 'bg-cyan-500/30 text-cyan-300' :
                                                'bg-green-500/30 text-green-300'
                                              }`}>
                                                {calculatedData.astrology?.moonElement || '-'} ☽
                                              </span>
                                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                calculatedData.astrology?.ascendantElement === 'Water' ? 'bg-blue-500/30 text-blue-300' :
                                                calculatedData.astrology?.ascendantElement === 'Fire' ? 'bg-red-500/30 text-red-300' :
                                                calculatedData.astrology?.ascendantElement === 'Air' ? 'bg-cyan-500/30 text-cyan-300' :
                                                'bg-green-500/30 text-green-300'
                                              }`}>
                                                {calculatedData.astrology?.ascendantElement || '-'} ↑
                                              </span>
                                            </div>
                                            {calculatedData.astrology?.dominantElement && (
                                              <div className="mt-3 p-2 bg-white/5 rounded">
                                                <p className="text-xs text-gray-400">Dominant Traits</p>
                                                <p className="text-sm text-white">
                                                  <span className={`font-medium ${
                                                    calculatedData.astrology?.dominantElement === 'Water' ? 'text-blue-300' :
                                                    calculatedData.astrology?.dominantElement === 'Fire' ? 'text-red-300' :
                                                    calculatedData.astrology?.dominantElement === 'Air' ? 'text-cyan-300' :
                                                    'text-green-300'
                                                  }`}>{calculatedData.astrology?.dominantElement}</span>
                                                  {' + '}
                                                  <span className="text-purple-300">{calculatedData.astrology?.dominantModality}</span>
                                                </p>
                                              </div>
                                            )}
                                            {calculatedData.astrology?.secondaryElement && calculatedData.astrology?.secondaryElement !== calculatedData.astrology?.element && (
                                              <div className="mt-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                  calculatedData.astrology?.secondaryElement === 'Water' ? 'bg-blue-500/30 text-blue-300' :
                                                  calculatedData.astrology?.secondaryElement === 'Fire' ? 'bg-red-500/30 text-red-300' :
                                                  calculatedData.astrology?.secondaryElement === 'Air' ? 'bg-cyan-500/30 text-cyan-300' :
                                                  'bg-green-500/30 text-green-300'
                                                }`}>
                                                  {calculatedData.astrology?.secondaryElement} (Life Path)
                                                </span>
                                              </div>
                                            )}
                                          </div>

                                          <div className="pt-4 border-t border-white/10">
                                            <p className="text-xs text-gray-400 mb-2">Name Totals</p>
                                            <div className="flex gap-4 text-sm text-gray-300">
                                              <span>Pythagorean: {calculatedData.pythagorean?.total}</span>
                                              <span>Chaldean: {calculatedData.chaldean?.total}</span>
                                              <span>Gematria: {calculatedData.gematria?.total}</span>
                                            </div>
                                          </div>

                  {/* Song Recommendations */}
                  {calculatedData && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <Music className="w-3 h-3" /> Song Recommendations
                      </p>
                      <div className="space-y-2">
                        {getSongRecommendations(
                          displayMethod === 'western' ? calculatedData.lifePath?.reduced : calculatedData.lifePathChaldean?.reduced,
                          displayMethod === 'western' ? calculatedData.expression?.reduced : calculatedData.expressionChaldean?.reduced,
                          calculatedData.birthday?.reduced
                        ).map((rec, idx) => (
                          <div key={idx} className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-purple-400">{rec.type} ({rec.number})</span>
                            </div>
                            <p className="text-white font-medium text-sm">🎵 "{rec.song}" - {rec.artist}</p>
                            <p className="text-gray-400 text-xs">{rec.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-center">
                    <p className="text-yellow-300 font-medium">🚧 Out of Order 🚧</p>
                    <p className="text-yellow-200/70 text-sm mt-1">Saving is temporarily disabled</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}