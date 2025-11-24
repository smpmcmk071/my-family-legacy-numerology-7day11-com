import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { Calendar, Database, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminNumerology() {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const [results, setResults] = useState(null);

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
      </div>
    </div>
  );
}