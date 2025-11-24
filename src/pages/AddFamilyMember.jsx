import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { UserPlus, Calculator, Loader2, CheckCircle2, Sparkles, Users, RefreshCw } from 'lucide-react';
import NumberBadge from '../components/legacy/NumberBadge';

export default function AddFamilyMember() {
  const [formData, setFormData] = useState({
    full_name: '',
    nickname: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    relationship: '',
    generation: '',
    sun_sign: ''
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedData, setCalculatedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userFamily, setUserFamily] = useState(null);
  const [existingMembers, setExistingMembers] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);

  // Get current user and their family
  useEffect(() => {
    const loadUserFamily = async () => {
      const user = await base44.auth.me();
      // Check if user has a family or is admin
      const families = await base44.entities.Family.filter({ admin_email: user.email });
      if (families.length > 0) {
        setUserFamily(families[0]);
        // Load existing members
        const members = await base44.entities.FamilyMember.filter({ family_id: families[0].id });
        setExistingMembers(members);
      } else {
        // Create family for this user
        const newFamily = await base44.entities.Family.create({
          name: `${user.full_name?.split(' ').pop() || 'My'} Family`,
          admin_email: user.email
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
      birth_date: member.birth_date || '',
      birth_time: member.birth_time || '',
      birth_place: member.birth_place || '',
      relationship: member.relationship || '',
      generation: member.generation?.toString() || '',
      sun_sign: member.sun_sign || ''
    });
    setCalculatedData(null);
  };

  const clearForm = () => {
    setEditingMemberId(null);
    setFormData({
      full_name: '',
      nickname: '',
      birth_date: '',
      birth_time: '',
      birth_place: '',
      relationship: '',
      generation: '',
      sun_sign: ''
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
      birthDate: formData.birth_date
    });

    if (response.data?.success) {
      setCalculatedData(response.data.data);
    }
    setIsCalculating(false);
  };

  const handleSave = async () => {
    if (!calculatedData || !userFamily) return;

    setIsSaving(true);

    const memberData = {
      family_id: userFamily.id,
      full_name: formData.full_name,
      nickname: formData.nickname || formData.full_name.split(' ')[0],
      birth_date: formData.birth_date,
      birth_time: formData.birth_time,
      birth_place: formData.birth_place,
      relationship: formData.relationship,
      generation: formData.generation ? parseInt(formData.generation) : null,
      sun_sign: formData.sun_sign,
      // Western (primary)
      life_path_western: calculatedData.lifePath?.reduced,
      life_path_chaldean: calculatedData.lifePathChaldean?.reduced,
      life_path_master: calculatedData.lifePath?.display,
      birthday_vibe: calculatedData.birthday?.display,
      birthday_number: calculatedData.birthday?.reduced,
      birthday_month_number: calculatedData.birthdayMonth?.reduced,
      expression_western: calculatedData.expression?.reduced,
      expression_chaldean: calculatedData.expressionChaldean?.reduced,
      expression_master: calculatedData.expression?.display,
      life_purpose: calculatedData.expression?.reduced,
      soul_urge_western: calculatedData.soulUrge?.reduced,
      soul_urge_chaldean: calculatedData.soulUrgeChaldean?.reduced,
      soul_urge_master: calculatedData.soulUrge?.display,
      personality_western: calculatedData.personality?.reduced,
      personality_chaldean: calculatedData.personalityChaldean?.reduced,
      personality_master: calculatedData.personality?.display,
      master_numbers: calculatedData.masterNumbers?.join(',') || '',
      pythagorean_total: calculatedData.pythagorean?.total,
      chaldean_total: calculatedData.chaldean?.total,
      gematria_total: calculatedData.gematria?.total,
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

  const sunSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

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
                    className={editingMemberId === member.id ? "bg-amber-600" : "border-white/20 text-white hover:bg-white/10"}
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
                <label className="text-sm text-gray-300 mb-1 block">Birth Date *</label>
                <Input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Birth Time</label>
                <Input
                  value={formData.birth_time}
                  onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                  placeholder="11:06 PM EST"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Birth Place</label>
                <Input
                  value={formData.birth_place}
                  onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
                  placeholder="Drexel Hill, PA"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
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

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Sun Sign</label>
                <Select value={formData.sun_sign} onValueChange={(v) => setFormData({ ...formData, sun_sign: v })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select sun sign" />
                  </SelectTrigger>
                  <SelectContent>
                    {sunSigns.map(sign => (
                      <SelectItem key={sign} value={sign}>{sign}</SelectItem>
                    ))}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Life Path</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={calculatedData.lifePath?.reduced} size="lg" />
                        <span className="text-white text-sm">{calculatedData.lifePath?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Expression</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={calculatedData.expression?.reduced} size="lg" />
                        <span className="text-white text-sm">{calculatedData.expression?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Soul Urge</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={calculatedData.soulUrge?.reduced} size="lg" />
                        <span className="text-white text-sm">{calculatedData.soulUrge?.display}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Personality</p>
                      <div className="flex items-center gap-2">
                        <NumberBadge number={calculatedData.personality?.reduced} size="lg" />
                        <span className="text-white text-sm">{calculatedData.personality?.display}</span>
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
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Name Totals</p>
                    <div className="flex gap-4 text-sm text-gray-300">
                      <span>Pythagorean: {calculatedData.pythagorean?.total}</span>
                      <span>Chaldean: {calculatedData.chaldean?.total}</span>
                      <span>Gematria: {calculatedData.gematria?.total}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={isSaving || saved}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {saved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {editingMemberId ? 'Updated!' : 'Saved!'}
                      </>
                    ) : isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingMemberId ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {editingMemberId ? 'Update Member' : 'Save Family Member'}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}