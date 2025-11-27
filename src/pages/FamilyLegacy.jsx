import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Sparkles, ArrowLeft, Settings, ChevronUp, ChevronDown, Users, Loader2, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import NumberBadge from '../components/legacy/NumberBadge';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function FamilyLegacy() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    setLoading(true);
    const user = await base44.auth.me();
    
    // Find user's family
    let memberRecord = await base44.entities.FamilyMember.filter({ email: user.email });
    let selfMember = memberRecord.find(m => m.relationship === 'self') || memberRecord[0];
    
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
      selfMember = createdMembers[0];
    }
    
    if (selfMember?.family_id) {
      const families = await base44.entities.Family.filter({ id: selfMember.family_id });
      if (families.length > 0) {
        setFamily(families[0]);
        const familyMembers = await base44.entities.FamilyMember.filter({ family_id: selfMember.family_id });
        // Sort by generation, then by created_date
        familyMembers.sort((a, b) => {
          const genA = a.generation || 99;
          const genB = b.generation || 99;
          if (genA !== genB) return genA - genB;
          return new Date(a.created_date) - new Date(b.created_date);
        });
        setMembers(familyMembers);
      }
    }
    setLoading(false);
  };

  const handlePrint = () => window.print();

  const moveUp = (index) => {
    if (index === 0) return;
    const newMembers = [...members];
    [newMembers[index - 1], newMembers[index]] = [newMembers[index], newMembers[index - 1]];
    setMembers(newMembers);
  };

  const moveDown = (index) => {
    if (index === members.length - 1) return;
    const newMembers = [...members];
    [newMembers[index], newMembers[index + 1]] = [newMembers[index + 1], newMembers[index]];
    setMembers(newMembers);
  };

  const updateGeneration = (index, generation) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], generation: parseInt(generation) };
    setMembers(newMembers);
  };

  const saveOrder = async () => {
    setSaving(true);
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      await base44.entities.FamilyMember.update(member.id, {
        generation: member.generation,
        display_order: i
      });
    }
    setSaving(false);
    setEditMode(false);
  };

  // Group members by generation
  const generations = {};
  members.forEach(m => {
    const gen = m.generation || 0;
    if (!generations[gen]) generations[gen] = [];
    generations[gen].push(m);
  });

  const generationLabels = {
    1: 'Great-Grandparents',
    2: 'Grandparents', 
    3: 'Parents',
    4: 'Children',
    0: 'Unassigned'
  };

  // Find common numbers across family
  const numberCounts = {};
  members.forEach(m => {
    [m.life_path_western, m.expression_western, m.soul_urge_western, m.personality_western].forEach(n => {
      if (n) numberCounts[n] = (numberCounts[n] || 0) + 1;
    });
    if (m.master_numbers) {
      m.master_numbers.split(',').forEach(n => {
        const num = parseInt(n.trim());
        if (num) numberCounts[num] = (numberCounts[num] || 0) + 1;
      });
    }
  });

  const topNumbers = Object.entries(numberCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([num]) => parseInt(num));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Family Found</h2>
            <p className="text-gray-600 mb-4">Add yourself as a family member to create your legacy page.</p>
            <Link to={createPageUrl('AddFamilyMember')}>
              <Button className="bg-amber-600 hover:bg-amber-700">Get Started</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4 print:hidden">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The {family.name.replace(' Family', '')} Legacy
            </h1>
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-xl text-gray-600 italic">
            {Object.keys(generations).filter(g => g !== '0').length} Generations of Numerological Heritage
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 print:hidden">
            <Button onClick={handlePrint} className="bg-amber-600 hover:bg-amber-700">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEditMode(!editMode)}
              className={editMode ? 'bg-amber-100' : ''}
            >
              <Settings className="w-4 h-4 mr-2" />
              {editMode ? 'Cancel Edit' : 'Edit Order'}
            </Button>
          </div>
        </div>

        {/* Edit Mode */}
        {editMode && (
          <Card className="mb-8 border-amber-300 bg-amber-50 print:hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Arrange Family Members</span>
                <Button onClick={saveOrder} disabled={saving} className="bg-green-600 hover:bg-green-700">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Set generations and reorder members. Changes affect how they appear in the legacy document.
              </p>
              <div className="space-y-2">
                {members.map((member, idx) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="sm" onClick={() => moveUp(idx)} disabled={idx === 0} className="h-6 w-6 p-0">
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => moveDown(idx)} disabled={idx === members.length - 1} className="h-6 w-6 p-0">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{member.full_name}</p>
                      <p className="text-sm text-gray-500">{member.relationship || 'No relationship set'}</p>
                    </div>
                    <Select value={String(member.generation || '')} onValueChange={(v) => updateGeneration(idx, v)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select generation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Great-Grandparents</SelectItem>
                        <SelectItem value="2">2 - Grandparents</SelectItem>
                        <SelectItem value="3">3 - Parents</SelectItem>
                        <SelectItem value="4">4 - Children</SelectItem>
                        <SelectItem value="5">5 - Grandchildren</SelectItem>
                      </SelectContent>
                    </Select>
                    {member.life_path_western && <NumberBadge number={member.life_path_western} size="sm" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Introduction */}
        <div className="mb-12 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border-l-4 border-amber-600">
          <p className="text-gray-700 leading-relaxed text-lg">
            This is the numerological story of the {family.name}—{members.length} souls connected through numbers, 
            purpose, and destiny. Each member carries unique vibrations that contribute to the family's collective legacy.
            <span className="print:hidden"> Click any number to explore its deeper meaning.</span>
          </p>
        </div>

        {/* Family Tree by Generation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-8 h-8 text-amber-600" />
            The Family Tree
          </h2>
          
          {Object.entries(generations)
            .filter(([gen]) => gen !== '0')
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([gen, genMembers]) => (
              <div key={gen} className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-amber-200 pb-2">
                  Generation {gen}: {generationLabels[gen] || `Generation ${gen}`}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {genMembers.map(member => (
                    <Card key={member.id} className="bg-gradient-to-br from-white to-amber-50 border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{member.full_name}</h4>
                            {member.nickname && member.nickname !== member.full_name.split(' ')[0] && (
                              <p className="text-sm text-gray-500">"{member.nickname}"</p>
                            )}
                            <p className="text-xs text-amber-600 capitalize">{member.relationship}</p>
                          </div>
                          {member.sun_sign && (
                            <span className="text-sm text-gray-500">{member.sun_sign}</span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {member.life_path_western && (
                            <div>
                              <p className="text-[10px] text-gray-400">Life</p>
                              <NumberBadge number={member.life_path_western} onClick={setSelectedNumber} size="sm" />
                            </div>
                          )}
                          {member.expression_western && (
                            <div>
                              <p className="text-[10px] text-gray-400">Expr</p>
                              <NumberBadge number={member.expression_western} onClick={setSelectedNumber} size="sm" />
                            </div>
                          )}
                          {member.soul_urge_western && (
                            <div>
                              <p className="text-[10px] text-gray-400">Soul</p>
                              <NumberBadge number={member.soul_urge_western} onClick={setSelectedNumber} size="sm" />
                            </div>
                          )}
                          {member.personality_western && (
                            <div>
                              <p className="text-[10px] text-gray-400">Pers</p>
                              <NumberBadge number={member.personality_western} onClick={setSelectedNumber} size="sm" />
                            </div>
                          )}
                        </div>
                        
                        {member.master_numbers && (
                          <div className="mt-3 pt-2 border-t border-amber-200">
                            <p className="text-[10px] text-gray-400 mb-1">Master Numbers</p>
                            <div className="flex gap-1 flex-wrap">
                              {member.master_numbers.split(',').map((n, i) => (
                                <NumberBadge key={i} number={parseInt(n.trim())} onClick={setSelectedNumber} size="sm" />
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

          {/* Unassigned members */}
          {generations[0]?.length > 0 && (
            <div className="mb-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-600 mb-3">
                Unassigned Generation ({generations[0].length} members)
              </h3>
              <p className="text-sm text-gray-500 mb-3">Click "Edit Order" above to assign these members to generations.</p>
              <div className="flex flex-wrap gap-2">
                {generations[0].map(member => (
                  <span key={member.id} className="px-3 py-1 bg-white rounded-full text-sm border">
                    {member.full_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Family's Core Numbers */}
        {topNumbers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Family's Core Numbers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topNumbers.map(num => {
                const membersWithNum = members.filter(m => 
                  m.life_path_western === num || 
                  m.expression_western === num || 
                  m.soul_urge_western === num || 
                  m.personality_western === num ||
                  m.master_numbers?.includes(String(num))
                );
                const colors = [
                  'bg-blue-50 border-blue-600',
                  'bg-purple-50 border-purple-600',
                  'bg-amber-50 border-amber-600',
                  'bg-pink-50 border-pink-600',
                  'bg-green-50 border-green-600',
                  'bg-teal-50 border-teal-600'
                ];
                return (
                  <div key={num} className={`p-4 rounded-lg border-l-4 ${colors[topNumbers.indexOf(num) % colors.length]}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <NumberBadge number={num} onClick={setSelectedNumber} size="lg" />
                      <span className="font-semibold text-gray-900">
                        {numerologyMeanings[num]?.title || `Number ${num}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Found in: {membersWithNum.map(m => m.nickname || m.full_name.split(' ')[0]).join(', ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Family Summary */}
        <div className="mb-12 p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Family's Numerological Signature</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            The {family.name} carries a unique blend of energies across {Object.keys(generations).filter(g => g !== '0').length} generations 
            and {members.length} members. Your most prominent numbers are{' '}
            {topNumbers.slice(0, 3).map((num, i) => (
              <span key={num}>
                <NumberBadge number={num} onClick={setSelectedNumber} size="sm" />
                {i < 2 ? ', ' : ''}
              </span>
            ))}
            {' '}—creating a family tapestry of {topNumbers.slice(0, 3).map(n => numerologyMeanings[n]?.keywords?.[0] || 'power').join(', ')}.
          </p>
          <p className="text-gray-900 font-bold text-xl">
            Every number in your family tree contributes to a greater purpose. Together, you are more than the sum of your parts.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "The numbers do not direct your fate—they remind you of the gifts you carry 
            and the legacy you continue."
          </blockquote>
          <div className="mt-6 pt-6 border-t-2 border-gray-300">
            <p className="text-lg font-semibold text-gray-900">{family.name}</p>
            <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
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
              {numerologyMeanings[selectedNumber]?.title || `Number ${selectedNumber}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Meaning</h3>
              <p className="text-gray-700 leading-relaxed">
                {numerologyMeanings[selectedNumber]?.meaning || 'This number carries unique vibrations and energies.'}
              </p>
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
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
}