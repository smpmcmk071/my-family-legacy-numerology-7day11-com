import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Check, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CoopMode({ familyId, currentUserEmail, onStartCoop, onCancel }) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFamilyMembers();
  }, [familyId]);

  const loadFamilyMembers = async () => {
    const members = await base44.entities.FamilyMember.filter({ family_id: familyId });
    // Filter out current user
    const others = members.filter(m => m.email && m.email !== currentUserEmail);
    setFamilyMembers(others);
    setLoading(false);
  };

  const handleStart = () => {
    if (selectedPartner) {
      onStartCoop(selectedPartner);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Co-op Mode</h3>
        <p className="text-gray-400">Team up with a family member to play together against the dealer!</p>
        <p className="text-purple-300 text-sm mt-2">
          You'll each get a hand and work together to beat the house.
        </p>
      </div>

      {/* Partner Selection */}
      <div className="space-y-2">
        <p className="text-white font-medium mb-3">Select your partner:</p>
        
        {familyMembers.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No family members with email addresses found</p>
            <p className="text-gray-500 text-sm mt-2">
              Add family members with email addresses to play co-op
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {familyMembers.map((member) => (
              <motion.button
                key={member.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPartner(member)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  selectedPartner?.id === member.id
                    ? 'bg-purple-500/30 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {member.nickname?.[0] || member.full_name?.[0] || '?'}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">
                      {member.nickname || member.full_name}
                    </p>
                    {member.life_path_western && (
                      <p className="text-purple-400 text-sm">Life Path: {member.life_path_western}</p>
                    )}
                  </div>
                </div>
                {selectedPartner?.id === member.id && (
                  <Check className="w-5 h-5 text-purple-400" />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleStart}
          disabled={!selectedPartner}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          <Users className="w-4 h-4 mr-2" />
          Start Co-op
        </Button>
      </div>
    </div>
  );
}