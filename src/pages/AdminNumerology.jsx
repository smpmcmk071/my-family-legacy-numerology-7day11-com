import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { Calendar, Database, Loader2, CheckCircle2, AlertCircle, Users, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

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

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    const members = await base44.entities.FamilyMember.list();
    setFamilyMembers(members);
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
      birthDate: member.birth_date
    });

    if (response.data?.success) {
      const calc = response.data.data;
      await base44.entities.FamilyMember.update(member.id, {
        life_path_western: calc.lifePath?.reduced,
        life_path_chaldean: calc.lifePathChaldean?.reduced,
        life_path_master: calc.lifePath?.display,
        birthday_vibe: calc.birthday?.display,
        birthday_number: calc.birthday?.reduced,
        birthday_month_number: calc.birthdayMonth?.reduced,
        expression_western: calc.expression?.reduced,
        expression_chaldean: calc.expressionChaldean?.reduced,
        expression_master: calc.expression?.display,
        life_purpose: calc.expression?.reduced,
        soul_urge_western: calc.soulUrge?.reduced,
        soul_urge_chaldean: calc.soulUrgeChaldean?.reduced,
        soul_urge_master: calc.soulUrge?.display,
        personality_western: calc.personality?.reduced,
        personality_chaldean: calc.personalityChaldean?.reduced,
        personality_master: calc.personality?.display,
        master_numbers: calc.masterNumbers?.join(',') || '',
        pythagorean_total: calc.pythagorean?.total,
        chaldean_total: calc.chaldean?.total,
        gematria_total: calc.gematria?.total,
        karmic_debt_number: calc.karmicDebt?.numbers?.join(',') || '',
        sun_sign: calc.astrology?.sunSign || member.sun_sign,
        element: calc.astrology?.element,
        ruling_planet: calc.astrology?.rulingPlanet
      });
      return true;
    }
    return false;
  };

  const importMembers = async () => {
    if (!importData.trim()) return;
    
    setIsImporting(true);
    setMemberStatus('Importing members...');
    
    try {
      // Parse CSV or line-by-line format: name, birthdate, relationship, generation
      const lines = importData.trim().split('\n');
      let imported = 0;
      
      // Get or create family
      const user = await base44.auth.me();
      let families = await base44.entities.Family.filter({ admin_email: user.email });
      let family = families[0];
      if (!family) {
        family = await base44.entities.Family.create({
          name: `${user.full_name?.split(' ').pop() || 'My'} Family`,
          admin_email: user.email
        });
      }
      
      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(',').map(p => p.trim());
        const [full_name, birth_date, relationship, generation, birth_time, birth_place] = parts;
        
        if (full_name && birth_date) {
          await base44.entities.FamilyMember.create({
            family_id: family.id,
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
      loadFamilyMembers();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Numerology Admin</h1>
          <p className="text-gray-300">Populate the DateNumerology calendar database</p>
        </div>

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
          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm">
              One per line: Name, Birth Date (YYYY-MM-DD), Relationship, Generation, Birth Time, Birth Place
            </p>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="John Francis Maher, 1940-11-22, grandparent, 2, morning, Philadelphia PA
Elizabeth JoAnn Maher, 1942-07-26, grandparent, 2
Stephen Maher, 1969-11-07, parent, 3, 11:06 PM EST, Drexel Hill PA"
              className="w-full h-40 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-gray-500 text-sm font-mono"
            />
            <div className="flex gap-2">
              <Button
                onClick={importMembers}
                disabled={!importData.trim() || isImporting}
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

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-300 w-10"></TableHead>
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Birth Date</TableHead>
                    <TableHead className="text-gray-300">LP (W)</TableHead>
                    <TableHead className="text-gray-300">LP (C)</TableHead>
                    <TableHead className="text-gray-300">Expression</TableHead>
                    <TableHead className="text-gray-300">Karmic</TableHead>
                    <TableHead className="text-gray-300">Sun Sign</TableHead>
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
                      <TableCell className="text-white font-medium">
                        {member.nickname || member.full_name?.split(' ')[0]}
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
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
                      <TableCell className="text-red-400">
                        {member.karmic_debt_number || '-'}
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {member.sun_sign || '-'}
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