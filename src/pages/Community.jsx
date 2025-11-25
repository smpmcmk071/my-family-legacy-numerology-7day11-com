import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { Users, TrendingUp, MessageSquare, Music, Loader2 } from 'lucide-react';
import FamilyTrends from '@/components/community/FamilyTrends';
import SharedExperiences from '@/components/community/SharedExperiences';
import NumerologyPlaylists from '@/components/community/NumerologyPlaylists';
import FamilyPlaylist from '@/components/community/FamilyPlaylist';

export default function Community() {
  const [user, setUser] = useState(null);
  const [userMember, setUserMember] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    
    const members = await base44.entities.FamilyMember.filter({ created_by: currentUser.email });
    setFamilyMembers(members);
    
    const selfMember = members.find(m => m.relationship === 'self') || members[0];
    setUserMember(selfMember);
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Community</h1>
          <p className="text-gray-300">Family Trends, Shared Experiences & Numerology Playlists</p>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-white/10 border border-white/20 p-1">
            <TabsTrigger value="trends" className="data-[state=active]:bg-amber-600 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Family Trends
            </TabsTrigger>
            <TabsTrigger value="experiences" className="data-[state=active]:bg-amber-600 text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Shared Experiences
            </TabsTrigger>
            <TabsTrigger value="playlists" className="data-[state=active]:bg-amber-600 text-white">
              <Music className="w-4 h-4 mr-2" />
              Playlists & Themes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <FamilyPlaylist familyMembers={familyMembers} />
            <FamilyTrends familyMembers={familyMembers} />
          </TabsContent>

          <TabsContent value="experiences">
            <SharedExperiences user={user} userMember={userMember} />
          </TabsContent>

          <TabsContent value="playlists">
            <NumerologyPlaylists user={user} userMember={userMember} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}