import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, CheckCircle2, Loader2, ArrowRight, Sparkles } from 'lucide-react';

export default function JoinFamily() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [foundFamily, setFoundFamily] = useState(null);
  const [user, setUser] = useState(null);
  const [existingFamily, setExistingFamily] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    checkUserStatus();
    // Check URL for invite code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setInviteCode(code.toUpperCase());
    }
  }, []);

  const checkUserStatus = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);

    // Check if user already belongs to a family
    const members = await base44.entities.FamilyMember.filter({ email: currentUser.email });
    if (members.length > 0 && members[0].family_id) {
      const families = await base44.entities.Family.filter({ id: members[0].family_id });
      if (families.length > 0) {
        setExistingFamily(families[0]);
      }
    }
    setCheckingStatus(false);
  };

  const lookupFamily = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setLoading(true);
    setError('');
    setFoundFamily(null);

    const families = await base44.entities.Family.filter({ invite_code: inviteCode.toUpperCase().trim() });
    
    if (families.length === 0) {
      setError('No family found with that code. Check the code and try again.');
      setLoading(false);
      return;
    }

    setFoundFamily(families[0]);
    setLoading(false);
  };

  const joinFamily = async () => {
    if (!foundFamily || !user) return;

    setLoading(true);

    // Check member limit
    const existingMembers = await base44.entities.FamilyMember.filter({ family_id: foundFamily.id });
    const limit = foundFamily.member_limit || 5;
    
    if (existingMembers.length >= limit) {
      setError(`This family has reached its member limit (${limit}). Ask the family admin to upgrade.`);
      setLoading(false);
      return;
    }

    // Create a basic family member record for this user
    await base44.entities.FamilyMember.create({
      family_id: foundFamily.id,
      full_name: user.full_name || user.email.split('@')[0],
      nickname: user.full_name?.split(' ')[0] || user.email.split('@')[0],
      email: user.email,
      relationship: 'self',
      is_active: true
    });

    setSuccess(true);
    setLoading(false);
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  // Already in a family
  if (existingFamily && !success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">You're Already in a Family!</h2>
            <p className="text-gray-300 mb-6">
              You're a member of <span className="text-amber-400 font-bold">{existingFamily.name}</span>
            </p>
            <Link to={createPageUrl('Home')}>
              <Button className="bg-amber-600 hover:bg-amber-700">
                Go to Home <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full">
          <CardContent className="py-12 text-center">
            <div className="relative inline-block mb-4">
              <CheckCircle2 className="w-20 h-20 text-green-400" />
              <Sparkles className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to the Family!</h2>
            <p className="text-gray-300 mb-6">
              You've joined <span className="text-amber-400 font-bold">{foundFamily.name}</span>
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Complete your profile to calculate your numerology numbers.
            </p>
            <Link to={createPageUrl('AddFamilyMember') + '?setupSelf=true'}>
              <Button className="bg-amber-600 hover:bg-amber-700">
                Complete Your Profile <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Join a Family</CardTitle>
          <p className="text-gray-400 mt-2">Enter the invite code shared by your family member</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g., SMITH123)"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-center text-xl tracking-widest"
              maxLength={12}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {!foundFamily ? (
            <Button
              onClick={lookupFamily}
              disabled={loading || !inviteCode.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Find Family
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center">
                <p className="text-green-300 font-medium">Family Found!</p>
                <p className="text-white text-xl font-bold mt-1">{foundFamily.name}</p>
                {foundFamily.description && (
                  <p className="text-gray-400 text-sm mt-2">{foundFamily.description}</p>
                )}
              </div>
              <Button
                onClick={joinFamily}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Join {foundFamily.name}
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setFoundFamily(null); setInviteCode(''); }}
                className="w-full text-gray-400"
              >
                Try a different code
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm mb-2">Don't have a code?</p>
            <Link to={createPageUrl('AddFamilyMember')}>
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
                Create Your Own Family
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}