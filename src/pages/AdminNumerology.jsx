import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { Calendar, Database, Loader2, CheckCircle2, AlertCircle, Users, RefreshCw, ShieldAlert, Sparkles, Star, Settings, Swords, Gamepad2, MessageSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { buildMemberDataFromCalc } from '../components/utils/numerologyHelpers';

export default function AdminNumerology() {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const [results, setResults] = useState(null);
  
  // Family members state
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isUpdatingMembers, setIsUpdatingMembers] = useState(false);
  const [memberStatus, setMemberStatus] = useState(null);
  
  // Import state
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [allFamilies, setAllFamilies] = useState([]);
  const [selectedFamilyForImport, setSelectedFamilyForImport] = useState('');
  
  // Calendar predictions state
  const [predictionStart, setPredictionStart] = useState('2025-01-01');
  const [predictionEnd, setPredictionEnd] = useState('2025-01-31');
  const [selectedMemberForPrediction, setSelectedMemberForPrediction] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [predictionSummary, setPredictionSummary] = useState(null);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  
  // Admin check
  const [isAdmin, setIsAdmin] = useState(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
  // Family settings
  const [family, setFamily] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    setCheckingAdmin(true);
    const user = await base44.auth.me();
    
    // Check if user is admin in User entity OR has is_admin in FamilyMember
    if (user.role === 'admin') {
      setIsAdmin(true);
      loadFamilyMembers(null);
      setCheckingAdmin(false);
      return;
    }
    
    // Check FamilyMember for is_admin flag
    let userMembers = await base44.entities.FamilyMember.filter({ email: user.email });
    let selfMember = userMembers.find(m => m.relationship === 'self') || userMembers[0];
    
    // Fallback: check created_by
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
      selfMember = createdMembers.find(m => m.relationship === 'self') || createdMembers[0];
    }
    
    if (selfMember?.is_admin === true) {
      setIsAdmin(true);
      loadFamilyMembers(selfMember.family_id);
      loadFamilySettings(selfMember.family_id);
      loadAllFamilies();
    } else if (user.role === 'admin') {
      loadAllFamilies();
    }
    setCheckingAdmin(false);
  };
  
  const loadAllFamilies = async () => {
    const families = await base44.entities.Family.list();
    setAllFamilies(families);
  };
  
  const loadFamilySettings = async (familyId) => {
    if (!familyId) return;
    const allFamilies = await base44.entities.Family.list();
    const family = allFamilies.find(f => f.id === familyId);
    if (family) {
      setFamily(family);
    }
  };
  
  const updateFamilySetting = async (setting, value) => {
    if (!family) return;
    setSavingSettings(true);
    await base44.entities.Family.update(family.id, { [setting]: value });
    setFamily(prev => ({ ...prev, [setting]: value }));
    setSavingSettings(false);
  };

  const loadFamilyMembers = async (familyId) => {
    if (!familyId) {
      // Try to get family_id from user's member record
      const user = await base44.auth.me();
      let userMembers = await base44.entities.FamilyMember.filter({ email: user.email });
      let selfMember = userMembers[0];
      if (!selfMember) {
        const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
        selfMember = createdMembers[0];
      }
      familyId = selfMember?.family_id;
    }
    
    if (familyId) {
      const members = await base44.entities.FamilyMember.filter({ family_id: familyId });
      setFamilyMembers(members);
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllMembers = () => {
    if (selectedMembers.length === familyMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(familyMembers.map(m => m.id));
    }
  };

  const recalculateMember = async (member) => {
    const response = await base44.functions.invoke('calculateNumerology', {
      type: 'name',
      name: member.full_name,
      birthDate: member.birth_date,
      birthTime: member.birth_time,
      birthPlace: member.birth_place
    });

    if (response.data?.success) {
      const calc = response.data.data;
      const memberData = buildMemberDataFromCalc(calc);
      await base44.entities.FamilyMember.update(member.id, memberData);
      return true;
    }
    return false;
  };

  const importMembers = async () => {
    if (!importData.trim() || !selectedFamilyForImport) return;
    
    setIsImporting(true);
    setMemberStatus('Importing members...');
    
    try {
      // Parse CSV or line-by-line format: name, birthdate, relationship, generation
      const lines = importData.trim().split('\n');
      let imported = 0;
      
      // Use selected family
      const familyId = selectedFamilyForImport;
      
      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(',').map(p => p.trim());
        const [full_name, birth_date, relationship, generation, birth_time, birth_place] = parts;
        
        if (full_name && birth_date) {
          await base44.entities.FamilyMember.create({
            family_id: familyId,
            full_name,
            nickname: full_name.split(' ')[0],
            birth_date,
            relationship: relationship || 'self',
            generation: generation ? parseInt(generation) : null,
            birth_time: birth_time || '',
            birth_place: birth_place || '',
            is_active: true
          });
          imported++;
        }
      }
      
      setMemberStatus(`Imported ${imported} members!`);
      setImportData('');
      loadFamilyMembers(selectedFamilyForImport);
    } catch (e) {
      setMemberStatus(`Error: ${e.message}`);
    }
    
    setIsImporting(false);
  };

  const updateSelectedMembers = async () => {
    if (selectedMembers.length === 0) return;
    
    setIsUpdatingMembers(true);
    setMemberStatus(`Updating ${selectedMembers.length} members...`);
    
    let success = 0;
    let errors = 0;
    
    for (const memberId of selectedMembers) {
      const member = familyMembers.find(m => m.id === memberId);
      if (member) {
        try {
          const result = await recalculateMember(member);
          if (result) success++;
          else errors++;
        } catch (e) {
          errors++;
        }
      }
      setMemberStatus(`Updated ${success} of ${selectedMembers.length}...`);
    }
    
    setMemberStatus(`Complete! ${success} updated, ${errors} errors`);
    setIsUpdatingMembers(false);
    setSelectedMembers([]);
    loadFamilyMembers();
  };

  const populateCalendar = async () => {
    setIsLoading(true);
    setProgress(0);
    setStatus('Calculating numerology for date range...');
    setResults(null);

    // Calculate date range in chunks to avoid timeout
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    const chunkSize = 30; // Process 30 days at a time
    let processed = 0;
    let errors = [];

    for (let chunkStart = new Date(start); chunkStart <= end; ) {
      const chunkEnd = new Date(chunkStart);
      chunkEnd.setDate(chunkEnd.getDate() + chunkSize - 1);
      if (chunkEnd > end) chunkEnd.setTime(end.getTime());

      try {
        setStatus(`Calculating ${chunkStart.toISOString().split('T')[0]} to ${chunkEnd.toISOString().split('T')[0]}...`);
        
        // Call the function to calculate the date range
        const response = await base44.functions.invoke('calculateNumerology', {
          type: 'dateRange',
          startDate: chunkStart.toISOString().split('T')[0],
          endDate: chunkEnd.toISOString().split('T')[0]
        });

        if (response.data?.success && response.data?.data) {
          // Bulk insert into DateNumerology entity
          setStatus(`Saving ${response.data.data.length} dates to database...`);
          await base44.entities.DateNumerology.bulkCreate(response.data.data);
          processed += response.data.data.length;
        }
      } catch (error) {
        errors.push(`${chunkStart.toISOString().split('T')[0]}: ${error.message}`);
      }

      // Move to next chunk
      chunkStart.setDate(chunkStart.getDate() + chunkSize);
      setProgress(Math.round((processed / totalDays) * 100));
    }

    setIsLoading(false);
    setProgress(100);
    setResults({
      total: totalDays,
      processed,
      errors
    });
    setStatus(errors.length === 0 ? 'Complete!' : 'Completed with some errors');
  };

  const clearData = async () => {
    if (!confirm('Are you sure you want to delete ALL DateNumerology records?')) return;
    
    setIsLoading(true);
    setStatus('Clearing all records...');
    
    try {
      const existing = await base44.entities.DateNumerology.list();
      for (const record of existing) {
        await base44.entities.DateNumerology.delete(record.id);
      }
      setStatus('All records cleared');
      setResults(null);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto mb-4" />
          <p className="text-gray-300">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md">
          <CardContent className="py-12 text-center">
            <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">You don't have admin privileges to access this page.</p>
            <p className="text-gray-400 text-sm mt-4">Contact your family admin to request access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Numerology Admin</h1>
          <p className="text-gray-300">Populate the DateNumerology calendar database</p>
        </div>

        {/* Family App Settings */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Family App Settings
              {savingSettings && <Loader2 className="w-4 h-4 animate-spin text-amber-400" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {family ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-red-400" />
                    <span className="text-white text-sm">Battle</span>
                  </div>
                  <Switch
                    checked={family.enable_battle !== false}
                    onCheckedChange={(v) => updateFamilySetting('enable_battle', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">Blackjack</span>
                  </div>
                  <Switch
                    checked={family.enable_blackjack !== false}
                    onCheckedChange={(v) => updateFamilySetting('enable_blackjack', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm">Community</span>
                  </div>
                  <Switch
                    checked={family.enable_community !== false}
                    onCheckedChange={(v) => updateFamilySetting('enable_community', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">Calendar</span>
                  </div>
                  <Switch
                    checked={family.enable_calendar !== false}
                    onCheckedChange={(v) => updateFamilySetting('enable_calendar', v)}
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No family settings found</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Populate Date Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={populateCalendar}
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700 flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Populate Calendar
                  </>
                )}
              </Button>
              
              <Button
                onClick={clearData}
                disabled={isLoading}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/20"
              >
                Clear All Data
              </Button>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-400 text-center">{progress}%</p>
              </div>
            )}

            {status && (
              <div className={`p-4 rounded-lg flex items-center gap-2 ${
                status.includes('Error') || status.includes('error') 
                  ? 'bg-red-500/20 text-red-300' 
                  : status === 'Complete!' 
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-blue-500/20 text-blue-300'
              }`}>
                {status === 'Complete!' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : status.includes('Error') ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {status}
              </div>
            )}

            {results && (
              <div className="p-4 bg-white/5 rounded-lg space-y-2">
                <h3 className="font-semibold text-white">Results</h3>
                <p className="text-gray-300">Total days: {results.total}</p>
                <p className="text-green-400">Processed: {results.processed}</p>
                {results.errors.length > 0 && (
                  <div className="text-red-400">
                    <p>Errors: {results.errors.length}</p>
                    <ul className="text-sm mt-1">
                      {results.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Quick Ranges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => { setStartDate('2025-01-01'); setEndDate('2025-12-31'); }}
            >
              2025
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => { setStartDate('2026-01-01'); setEndDate('2026-12-31'); }}
            >
              2026
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => { setStartDate('2025-01-01'); setEndDate('2030-12-31'); }}
            >
              2025-2030
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => { setStartDate('1950-01-01'); setEndDate('2050-12-31'); }}
            >
              1950-2050 (Big!)
            </Button>
          </CardContent>
        </Card>

        {/* Import Family Members */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Import Family Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Select Target Family *</label>
              <Select value={selectedFamilyForImport} onValueChange={setSelectedFamilyForImport}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select a family to import into" />
                </SelectTrigger>
                <SelectContent>
                  {allFamilies.map(f => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} ({f.admin_email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-gray-500 text-xs">
              Format: Name, YYYY-MM-DD, Relationship, Gen, Time, Place
            </p>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Name, YYYY-MM-DD, relationship, gen, time, place"
              className="w-full h-16 bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder:text-gray-500 text-xs font-mono"
            />
            <div className="flex gap-2">
              <Button
                onClick={importMembers}
                disabled={!importData.trim() || !selectedFamilyForImport || isImporting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Import Members
                  </>
                )}
              </Button>
              <Button
                onClick={async () => {
                  const members = await base44.entities.FamilyMember.list();
                  setFamilyMembers(members);
                  setSelectedMembers(members.map(m => m.id));
                  await updateSelectedMembers();
                }}
                disabled={familyMembers.length === 0 || isUpdatingMembers}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isUpdatingMembers ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recalculate All
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Premium Calendar Predictions */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Premium Calendar Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Start Date</label>
                <Input
                  type="date"
                  value={predictionStart}
                  onChange={(e) => setPredictionStart(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">End Date</label>
                <Input
                  type="date"
                  value={predictionEnd}
                  onChange={(e) => setPredictionEnd(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Family Member</label>
                <Select value={selectedMemberForPrediction} onValueChange={setSelectedMemberForPrediction}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Universal only" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="universal">Universal Only</SelectItem>
                    <SelectItem value="all_family">📊 All Family Members</SelectItem>
                    {familyMembers.map(m => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.nickname || m.full_name} (LP: {m.life_path_western || '?'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={async () => {
                setIsLoadingPredictions(true);
                
                if (selectedMemberForPrediction === 'all_family') {
                  // Generate for all family members
                  const allPredictions = [];
                  const allSummaries = { total_days: 0, master_days: 0, aligned_days: 0, power_days: 0, best_days_for_new_starts: [] };
                  
                  for (const member of familyMembers) {
                    const response = await base44.functions.invoke('populateCalendarPredictions', {
                      startDate: predictionStart,
                      endDate: predictionEnd,
                      familyMemberId: member.id
                    });
                    if (response.data?.success) {
                      const memberPreds = response.data.data.predictions.map(p => ({
                        ...p,
                        member_name: member.nickname || member.full_name?.split(' ')[0]
                      }));
                      allPredictions.push(...memberPreds);
                      allSummaries.total_days += response.data.data.summary.total_days;
                      allSummaries.master_days += response.data.data.summary.master_days;
                      allSummaries.aligned_days += response.data.data.summary.aligned_days;
                      allSummaries.power_days += response.data.data.summary.power_days;
                    }
                  }
                  setPredictions(allPredictions);
                  setPredictionSummary(allSummaries);
                } else {
                  const response = await base44.functions.invoke('populateCalendarPredictions', {
                    startDate: predictionStart,
                    endDate: predictionEnd,
                    familyMemberId: selectedMemberForPrediction && selectedMemberForPrediction !== 'universal' ? selectedMemberForPrediction : null
                  });
                  if (response.data?.success) {
                    setPredictions(response.data.data.predictions);
                    setPredictionSummary(response.data.data.summary);
                  }
                }
                setIsLoadingPredictions(false);
              }}
              disabled={isLoadingPredictions}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isLoadingPredictions ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Predictions
                </>
              )}
            </Button>

            {predictionSummary && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-white/5 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{predictionSummary.total_days}</p>
                  <p className="text-xs text-gray-400">Total Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">{predictionSummary.master_days}</p>
                  <p className="text-xs text-gray-400">Master Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{predictionSummary.aligned_days}</p>
                  <p className="text-xs text-gray-400">Aligned Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{predictionSummary.power_days}</p>
                  <p className="text-xs text-gray-400">Power Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">{predictionSummary.best_days_for_new_starts?.length || 0}</p>
                  <p className="text-xs text-gray-400">New Start Days</p>
                </div>
              </div>
            )}

            {predictions && predictions.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-slate-900 z-10">
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">U-Day</TableHead>
                      <TableHead className="text-gray-300">P-Day</TableHead>
                      <TableHead className="text-gray-300">Universal Vibe</TableHead>
                      <TableHead className="text-gray-300">Special</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {predictions.map((p, idx) => (
                      <TableRow key={`${p.date}-${p.member_name || idx}`} className={`border-white/10 ${p.is_master_day ? 'bg-amber-500/10' : p.is_aligned ? 'bg-green-500/10' : p.is_power_day ? 'bg-purple-500/10' : ''}`}>
                        <TableCell className="text-white font-medium">
                          {p.date}
                          {p.member_name && <span className="text-xs text-gray-400 ml-2">({p.member_name})</span>}
                        </TableCell>
                        <TableCell className="text-amber-400 font-bold">{p.universal_day_number}</TableCell>
                        <TableCell className="text-purple-400 font-bold">{p.personal_day_number || '-'}</TableCell>
                        <TableCell className="text-gray-300 text-xs">{p.universal_vibe}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {p.is_master_day && <Star className="w-4 h-4 text-amber-400" />}
                            {p.is_aligned && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                            {p.is_power_day && <Sparkles className="w-4 h-4 text-purple-400" />}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family Members Recalculation */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Family Members ({familyMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllMembers}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {selectedMembers.length === familyMembers.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                onClick={updateSelectedMembers}
                disabled={selectedMembers.length === 0 || isUpdatingMembers}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isUpdatingMembers ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recalculate Selected ({selectedMembers.length})
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadFamilyMembers}
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {memberStatus && (
              <div className={`p-3 rounded-lg text-sm ${
                memberStatus.includes('Complete') ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {memberStatus}
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-white/10 max-h-[500px] overflow-y-auto">
                                <Table>
                                  <TableHeader className="sticky top-0 bg-slate-900 z-10">
                                    <TableRow className="border-white/10">
                                      <TableHead className="text-gray-300 w-10"></TableHead>
                                      <TableHead className="text-gray-300">Name</TableHead>
                                      <TableHead className="text-gray-300">Birth Date</TableHead>
                                      <TableHead className="text-gray-300">LP (W)</TableHead>
                                      <TableHead className="text-gray-300">LP (C)</TableHead>
                                      <TableHead className="text-gray-300">Expr (W)</TableHead>
                                      <TableHead className="text-gray-300">Soul (W)</TableHead>
                                      <TableHead className="text-gray-300">Pers (W)</TableHead>
                                      <TableHead className="text-gray-300">Birthday</TableHead>
                                      <TableHead className="text-gray-300">Masters</TableHead>
                                      <TableHead className="text-gray-300">Karmic Debt</TableHead>
                                      <TableHead className="text-gray-300">Karmic Lessons</TableHead>
                                      <TableHead className="text-gray-300">Sun</TableHead>
                                      <TableHead className="text-gray-300">Moon</TableHead>
                                                                <TableHead className="text-gray-300">Rising</TableHead>
                                                                <TableHead className="text-gray-300">Big Three</TableHead>
                                                                <TableHead className="text-gray-300">Dom Element</TableHead>
                                                                <TableHead className="text-gray-300">Dom Modality</TableHead>
                                                                <TableHead className="text-gray-300">Element</TableHead>
                                      <TableHead className="text-gray-300">2nd Element</TableHead>
                                      <TableHead className="text-gray-300">Modality</TableHead>
                                      <TableHead className="text-gray-300">Ruler</TableHead>
                                      <TableHead className="text-gray-300">Pyth Total</TableHead>
                                      <TableHead className="text-gray-300">Chald Total</TableHead>
                                      <TableHead className="text-gray-300">Gematria</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {familyMembers.map(member => (
                                      <TableRow key={member.id} className="border-white/10">
                                        <TableCell>
                                          <Checkbox
                                            checked={selectedMembers.includes(member.id)}
                                            onCheckedChange={() => toggleMemberSelection(member.id)}
                                          />
                                        </TableCell>
                                        <TableCell className="text-white font-medium whitespace-nowrap">
                                          {member.nickname || member.full_name?.split(' ')[0]}
                                        </TableCell>
                                        <TableCell className="text-gray-300 text-sm whitespace-nowrap">
                                          {member.birth_date}
                                        </TableCell>
                                        <TableCell className="text-amber-400">
                                          {member.life_path_western || '-'}
                                        </TableCell>
                                        <TableCell className="text-blue-400">
                                          {member.life_path_chaldean || '-'}
                                        </TableCell>
                                        <TableCell className="text-purple-400">
                                          {member.expression_western || '-'}
                                        </TableCell>
                                        <TableCell className="text-pink-400">
                                          {member.soul_urge_western || '-'}
                                        </TableCell>
                                        <TableCell className="text-cyan-400">
                                          {member.personality_western || '-'}
                                        </TableCell>
                                        <TableCell className="text-orange-400">
                                          {member.birthday_vibe || '-'}
                                        </TableCell>
                                        <TableCell className="text-yellow-400">
                                          {member.master_numbers || '-'}
                                        </TableCell>
                                        <TableCell className="text-red-400">
                                          {member.karmic_debt_number || '-'}
                                        </TableCell>
                                        <TableCell className="text-orange-300 text-xs">
                                          {member.karmic_lessons || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-300 text-sm whitespace-nowrap">
                                          {member.sun_sign || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-300 text-sm whitespace-nowrap">
                                                                      {member.moon_sign || '-'}
                                                                    </TableCell>
                                                                    <TableCell className="text-gray-300 text-sm whitespace-nowrap">
                                                                      {member.ascendant || '-'}
                                                                    </TableCell>
                                                                    <TableCell className="text-amber-400 text-sm whitespace-nowrap">
                                                                      {member.big_three || '-'}
                                                                    </TableCell>
                                                                    <TableCell className="text-emerald-400 text-sm">
                                                                      {member.dominant_element || '-'}
                                                                    </TableCell>
                                                                    <TableCell className="text-violet-400 text-sm">
                                                                      {member.dominant_modality || '-'}
                                                                    </TableCell>
                                                                    <TableCell className="text-green-400 text-sm">
                                                                      {member.element || '-'}
                                                                    </TableCell>
                                        <TableCell className="text-teal-400 text-sm">
                                          {member.secondary_element || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-400 text-sm">
                                          {member.modality || '-'}
                                        </TableCell>
                                        <TableCell className="text-indigo-400 text-sm whitespace-nowrap">
                                          {member.ruling_planet || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-400">
                                          {member.pythagorean_total || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-400">
                                          {member.chaldean_total || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-400">
                                          {member.gematria_total || '-'}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}