import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { UserPlus, Calculator, Loader2, CheckCircle2, Sparkles, Users, RefreshCw, MapPin, Music, Mail } from 'lucide-react';
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
    birth_year: '',
    birth_month: '',
    birth_day: '',
    birth_hour: '',
    birth_minute: '',
    birth_ampm: '',
    birth_time_period: '',
    birth_place: '',
    birth_city: '',
    birth_state: '',
    relationship: '',
    generation: '',
    family_name: '',
  });
  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedData, setCalculatedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userFamily, setUserFamily] = useState(null);
  const [existingMembers, setExistingMembers] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [displayMethod, setDisplayMethod] = useState('western'); // 'western' or 'chaldean'
  const [memberLimit, setMemberLimit] = useState(5); // Free tier = 5 members

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
        const lastName = user.full_name?.split(' ').pop() || '';
        setFormData(prev => ({
          ...prev,
          full_name: user.full_name || '',
          email: user.email,
          relationship: 'self',
          family_name: lastName ? `${lastName} Family` : ''
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
        // Check if they have premium slots
        setMemberLimit(families[0].member_limit || 5);
      } else if (isSetupSelf) {
        // Don't create family yet - wait for user to enter family name
        // Family will be created when they save their profile
      }
    };
    loadUserFamily();
  }, []);

  const loadMemberForEdit = (member) => {
    setEditingMemberId(member.id);
    // Parse masked birth date (MM/DD format)
    const dateParts = member.birth_date?.split('/') || [];
    // Parse birth place
    const placeParts = member.birth_place?.split(',') || [];
    
    setFormData({
      full_name: member.full_name || '',
      nickname: member.nickname || '',
      email: member.email || '',
      birth_year: '', // Year is encrypted, leave blank for re-entry
      birth_month: dateParts[0] || '',
      birth_day: dateParts[1] || '',
      birth_hour: '',
      birth_minute: '',
      birth_ampm: '',
      birth_time_period: member.birth_time || '',
      birth_place: '',
      birth_city: placeParts[0]?.trim() || '',
      birth_state: placeParts[placeParts.length - 1]?.trim() || member.birth_place || '',
      relationship: member.relationship || '',
      generation: member.generation?.toString() || ''
    });
    setCalculatedData(null);
    setErrors({});
  };

  const clearForm = () => {
    setEditingMemberId(null);
    setFormData({
      full_name: '',
      nickname: '',
      email: '',
      birth_year: '',
      birth_month: '',
      birth_day: '',
      birth_hour: '',
      birth_minute: '',
      birth_ampm: '',
      birth_time_period: '',
      birth_place: '',
      birth_city: '',
      birth_state: '',
      relationship: '',
      generation: ''
    });
    setCalculatedData(null);
    setSaved(false);
    setErrors({});
  };

  // Build birth date from parts
  const getBirthDate = () => {
    if (formData.birth_year && formData.birth_month && formData.birth_day) {
      return `${formData.birth_year}-${formData.birth_month}-${formData.birth_day}`;
    }
    return '';
  };

  // Build birth time from parts
  const getBirthTime = () => {
    if (formData.birth_hour && formData.birth_minute && formData.birth_ampm) {
      return `${formData.birth_hour}:${formData.birth_minute} ${formData.birth_ampm}`;
    }
    return formData.birth_time_period || '';
  };

  // Build birth place from parts
  const getBirthPlace = () => {
    if (formData.birth_city && formData.birth_state) {
      return `${formData.birth_city}, ${formData.birth_state}`;
    }
    return formData.birth_place || '';
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.birth_year || !formData.birth_month || !formData.birth_day) {
      newErrors.birth_date = 'Complete birth date is required';
    } else {
      // Validate date is real
      const year = parseInt(formData.birth_year);
      const month = parseInt(formData.birth_month);
      const day = parseInt(formData.birth_day);
      const testDate = new Date(year, month - 1, day);
      if (testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
        newErrors.birth_date = 'Invalid date (e.g., Feb 30 doesn\'t exist)';
      }
      if (year > new Date().getFullYear()) {
        newErrors.birth_date = 'Year cannot be in the future';
      }
    }
    
    if (!userFamily && !formData.family_name?.trim()) {
      newErrors.family_name = 'Family name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async () => {
        if (!validateForm()) return;

        setIsCalculating(true);
        setCalculatedData(null);

        const birthDate = getBirthDate();
        const birthTime = getBirthTime();
        const birthPlace = getBirthPlace();

        const response = await base44.functions.invoke('calculateNumerology', {
          type: 'name',
          name: formData.full_name,
          birthDate,
          birthTime,
          birthPlace
        });

        if (response.data?.success) {
          setCalculatedData(response.data.data);
        }
        setIsCalculating(false);
      };

  const handleSave = async () => {
        if (!calculatedData) return;

        setIsSaving(true);

        // Create family if doesn't exist and we have a name
        let familyToUse = userFamily;
        if (!familyToUse && formData.family_name) {
          const user = await base44.auth.me();
          familyToUse = await base44.entities.Family.create({
            name: formData.family_name,
            admin_email: user.email,
            description: `Family group for ${formData.family_name}`
          });
          setUserFamily(familyToUse);
        }

        if (!familyToUse) {
          setIsSaving(false);
          return;
        }

        const birthDate = getBirthDate();
        const birthTime = getBirthTime();
        const birthPlace = getBirthPlace();

        // Encrypt sensitive data
        const encryptResponse = await base44.functions.invoke('encryptData', {
          action: 'encrypt',
          data: {
            birth_date: birthDate,
            birth_place: birthPlace,
            birth_time: birthTime,
            email: formData.email
          }
        });

        const encrypted = encryptResponse.data?.encrypted || {};

        // Mask display values (show month/day only for birth_date, state only for place)
        const maskedBirthDate = formData.birth_month && formData.birth_day ? `${formData.birth_month}/${formData.birth_day}` : '';
        const maskedPlace = formData.birth_state || birthPlace;
        const maskedEmail = formData.email ? formData.email.replace(/(.{2}).*(@.*)/, '$1***$2') : null;

        const calcData = buildMemberDataFromCalc(calculatedData);
          const memberData = {
            family_id: familyToUse.id,
            full_name: formData.full_name,
            nickname: formData.nickname || formData.full_name.split(' ')[0],
            email: maskedEmail,
            email_encrypted: encrypted.email_encrypted,
            birth_date: maskedBirthDate,
            birth_date_encrypted: encrypted.birth_date_encrypted,
            birth_time: formData.birth_time_period || 'unknown',
            birth_time_encrypted: encrypted.birth_time_encrypted,
            birth_place: maskedPlace,
            birth_place_encrypted: encrypted.birth_place_encrypted,
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
    const members = await base44.entities.FamilyMember.filter({ family_id: familyToUse.id });
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
          {userFamily && (
            <p className="text-gray-400 text-sm mt-1">
              {existingMembers.length} / {memberLimit} members used
              {existingMembers.length >= memberLimit && !editingMemberId && (
                <span className="text-red-400 ml-2">• Limit reached</span>
              )}
            </p>
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
              {/* Family Name - show if no family yet */}
              {!userFamily && (
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Family Name *</label>
                  <Input
                    value={formData.family_name}
                    onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                    placeholder="Smith Family"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${errors.family_name ? 'border-red-500' : ''}`}
                  />
                  {errors.family_name && (
                    <p className="text-red-400 text-xs mt-1">{errors.family_name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">This will be your family group name</p>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Full Name *</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Francis Smith"
                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${errors.full_name ? 'border-red-500' : ''}`}
                />
                {errors.full_name && (
                  <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>
                )}
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
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="family@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 flex-1"
                  />
                  {formData.email && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open(`/invite?email=${encodeURIComponent(formData.email)}`, '_blank');
                      }}
                      className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
                      title="Invite this person to the app"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Invite
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Link to their user account for personal dashboard</p>
              </div>

              {/* Birth Date */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Birth Date *</label>
                <div className="grid grid-cols-3 gap-2">
                  <Select 
                    value={formData.birth_month} 
                    onValueChange={(v) => setFormData({ ...formData, birth_month: v })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { val: '01', label: 'January' },
                        { val: '02', label: 'February' },
                        { val: '03', label: 'March' },
                        { val: '04', label: 'April' },
                        { val: '05', label: 'May' },
                        { val: '06', label: 'June' },
                        { val: '07', label: 'July' },
                        { val: '08', label: 'August' },
                        { val: '09', label: 'September' },
                        { val: '10', label: 'October' },
                        { val: '11', label: 'November' },
                        { val: '12', label: 'December' },
                      ].map(m => (
                        <SelectItem key={m.val} value={m.val}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={formData.birth_day} 
                    onValueChange={(v) => setFormData({ ...formData, birth_day: v })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(day => (
                        <SelectItem key={day} value={day}>{parseInt(day)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={formData.birth_year} 
                    onValueChange={(v) => setFormData({ ...formData, birth_year: v })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.birth_date && (
                  <p className="text-red-400 text-xs mt-1">{errors.birth_date}</p>
                )}
              </div>

              {/* Birth Time */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Birth Time (optional)</label>
                <div className="space-y-2">
                  {/* Approximate time */}
                  <Select 
                    value={formData.birth_time_period} 
                    onValueChange={(v) => setFormData({ ...formData, birth_time_period: v })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select approximate time..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early_morning">Early Morning (12am - 6am)</SelectItem>
                      <SelectItem value="morning">Morning (6am - 12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm - 6pm)</SelectItem>
                      <SelectItem value="evening">Evening (6pm - 12am)</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Exact time */}
                  <p className="text-xs text-gray-500">Or enter exact time:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Select 
                      value={formData.birth_hour} 
                      onValueChange={(v) => setFormData({ ...formData, birth_hour: v })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(hour => (
                          <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={formData.birth_minute} 
                      onValueChange={(v) => setFormData({ ...formData, birth_minute: v })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(min => (
                          <SelectItem key={min} value={min}>{min}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={formData.birth_ampm} 
                      onValueChange={(v) => setFormData({ ...formData, birth_ampm: v })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Birth Place */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Birth Place (optional)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={formData.birth_city}
                    onChange={(e) => setFormData({ ...formData, birth_city: e.target.value })}
                    placeholder="City"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  />
                  <Select 
                    value={formData.birth_state} 
                    onValueChange={(v) => setFormData({ ...formData, birth_state: v })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {[
                        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
                        'DC', 'Other'
                      ].map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500 mt-1">For more accurate astrology calculations</p>
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
                disabled={!formData.full_name || !formData.birth_year || !formData.birth_month || !formData.birth_day || isCalculating || (!userFamily && !formData.family_name)}
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
                        <NumberBadge 
                          number={displayMethod === 'western' ? calculatedData.lifePath?.reduced : calculatedData.lifePathChaldean?.reduced} 
                          rawTotal={displayMethod === 'western' ? calculatedData.lifePath?.total : calculatedData.lifePathChaldean?.total}
                          size="lg" 
                        />
                        <span className="text-white text-sm">{displayMethod === 'western' ? calculatedData.lifePath?.display : calculatedData.lifePathChaldean?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Expression</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge 
                          number={displayMethod === 'western' ? calculatedData.expression?.reduced : calculatedData.expressionChaldean?.reduced} 
                          rawTotal={displayMethod === 'western' ? calculatedData.expression?.sum : calculatedData.expressionChaldean?.sum}
                          size="lg" 
                        />
                        <span className="text-white text-sm">{displayMethod === 'western' ? calculatedData.expression?.display : calculatedData.expressionChaldean?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Soul Urge</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge 
                          number={displayMethod === 'western' ? calculatedData.soulUrge?.reduced : calculatedData.soulUrgeChaldean?.reduced} 
                          rawTotal={displayMethod === 'western' ? calculatedData.soulUrge?.sum : calculatedData.soulUrgeChaldean?.sum}
                          size="lg" 
                        />
                        <span className="text-white text-sm">{displayMethod === 'western' ? calculatedData.soulUrge?.display : calculatedData.soulUrgeChaldean?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Personality</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge 
                          number={displayMethod === 'western' ? calculatedData.personality?.reduced : calculatedData.personalityChaldean?.reduced} 
                          rawTotal={displayMethod === 'western' ? calculatedData.personality?.sum : calculatedData.personalityChaldean?.sum}
                          size="lg" 
                        />
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

                  {/* Check member limit */}
                  {existingMembers.length >= memberLimit && !editingMemberId ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
                        <p className="text-red-300 font-medium">Member Limit Reached</p>
                        <p className="text-red-200/70 text-sm mt-1">
                          You've used all {memberLimit} member slots
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg text-center">
                                                    <p className="text-white font-bold text-lg mb-2">Add 4 More Members - $33</p>
                                                    <p className="text-gray-300 text-sm mb-3">
                                                      Expand your family tree with 4 additional member slots
                                                    </p>
                                                    <div className="bg-white/10 rounded-lg p-3 mb-3">
                                                      <p className="text-amber-400 font-medium mb-1">💳 Zelle to donate:</p>
                                                      <p className="text-white font-mono">7day11.com@gmail.com</p>
                                                    </div>
                                                    <p className="text-gray-400 text-sm">
                                                      After payment, email us with your Family Name to activate slots
                                                    </p>
                                                    <a 
                                                      href="mailto:7day11.com@gmail.com?subject=Add%20Family%20Members%20-%20$33&body=I%20sent%20$33%20via%20Zelle%20to%20add%204%20more%20family%20member%20slots.%0A%0AFamily%20Name:%20%0AMy%20Email:%20"
                                                      className="inline-block px-6 py-2 mt-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                                    >
                                                      📧 Email After Payment
                                                    </a>
                                                  </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : saved ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          {editingMemberId ? 'Update Member' : 'Save Member'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}