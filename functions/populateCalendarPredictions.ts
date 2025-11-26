/**
 * Populate Calendar Predictions
 * Generates future calendar events with numerology predictions
 * based on universal and personal day numbers
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Reduce number to single digit (preserve master numbers)
function reduceToDigit(n, keepMaster = true) {
  if (n < 0) n = Math.abs(n);
  const masterNumbers = [11, 22, 33];
  
  if (keepMaster && masterNumbers.includes(n)) {
    return n;
  }
  
  while (n > 9) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d), 0);
    if (keepMaster && [11, 22, 33].includes(n)) {
      return n;
    }
  }
  
  return n;
}

// Calculate universal and personal day numbers
function calculateDayNumbers(dateStr, lifePath = null) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const universalYear = reduceToDigit(year);
  
  // For month calculation: show both master and reduced if month is 11 or 22
  const monthSum = universalYear + month;
  const universalMonthReduced = reduceToDigit(monthSum, false); // Always reduce
  const universalMonthMaster = [11, 22].includes(month) ? month : null; // Preserve original master month
  
  // Use reduced for day calculation
  const universalDay = reduceToDigit(universalMonthReduced + day);

  const result = {
    date: dateStr,
    day,
    month,
    year,
    universalYear,
    universalMonth: universalMonthReduced,
    universalMonthMaster, // Shows 11 or 22 if applicable
    universalDay
  };

  if (lifePath) {
    const personalYear = reduceToDigit(lifePath + universalYear);
    const personalMonthSum = personalYear + month;
    const personalMonthReduced = reduceToDigit(personalMonthSum, false);
    const personalMonthMaster = [11, 22].includes(month) ? month : null;
    const personalDay = reduceToDigit(personalMonthReduced + day);

    result.lifePath = lifePath;
    result.personalYear = personalYear;
    result.personalMonth = personalMonthReduced;
    result.personalMonthMaster = personalMonthMaster;
    result.personalDay = personalDay;
  }

  return result;
}

// Get vibe summary for a number
function getVibeSummary(num) {
  const vibes = {
    1: "New beginnings, leadership, independence",
    2: "Partnerships, diplomacy, cooperation",
    3: "Creativity, self-expression, joy",
    4: "Foundation building, organization, hard work",
    5: "Change, freedom, adventure",
    6: "Responsibility, family, nurturing",
    7: "Reflection, spirituality, inner wisdom",
    8: "Abundance, power, achievement",
    9: "Completion, compassion, universal love",
    11: "Spiritual insight, intuition, inspiration",
    22: "Master Builder, manifesting visions",
    33: "Master Teacher, healing, selfless service"
  };
  return vibes[num] || vibes[reduceToDigit(num, false)];
}

// Get recommendations for a number
function getRecommendations(num) {
  const recs = {
    1: "Start something new. Take the lead. Trust your original ideas.",
    2: "Collaborate with others. Practice patience. Seek harmony.",
    3: "Express yourself creatively. Socialize. Have fun.",
    4: "Build foundations. Organize. Focus on practical goals.",
    5: "Embrace change. Try something new. Be adaptable.",
    6: "Nurture family. Take responsibility. Create beauty at home.",
    7: "Spend time alone. Meditate or study. Trust your intuition.",
    8: "Focus on business. Manage finances. Manifest abundance.",
    9: "Let go of what no longer serves. Practice compassion.",
    11: "Trust your intuition. Seek spiritual insights. Stay grounded.",
    22: "Think big. Build lasting structures. Turn dreams into reality.",
    33: "Heal and teach. Practice unconditional love. Serve humanity."
  };
  return recs[num] || recs[reduceToDigit(num, false)];
}

// Get event type suggestions based on numbers
function suggestEventTypes(universalDay, personalDay) {
  const suggestions = [];
  
  // Universal day suggestions
  if ([1, 8].includes(universalDay)) suggestions.push('work', 'business');
  if ([2, 6].includes(universalDay)) suggestions.push('family');
  if ([3, 5].includes(universalDay)) suggestions.push('social', 'creative');
  if ([7, 11].includes(universalDay)) suggestions.push('spiritual');
  if ([4].includes(universalDay)) suggestions.push('planning');
  if ([9, 33].includes(universalDay)) suggestions.push('charity', 'healing');
  
  // Personal day additions
  if (personalDay && [1, 8, 22].includes(personalDay)) suggestions.push('career');
  if (personalDay && [6].includes(personalDay)) suggestions.push('home');
  
  return [...new Set(suggestions)];
}

// Identify special days
function identifySpecialDays(universalDay, personalDay, lifePath) {
  const special = [];
  
  // Master number days
  if ([11, 22, 33].includes(universalDay)) {
    special.push(`Master ${universalDay} Universal Day`);
  }
  if (personalDay && [11, 22, 33].includes(personalDay)) {
    special.push(`Master ${personalDay} Personal Day`);
  }
  
  // Alignment days
  if (personalDay && universalDay === personalDay) {
    special.push('Aligned Day - Universal & Personal match');
  }
  
  // Life path power days
  if (lifePath && universalDay === lifePath) {
    special.push('Life Path Power Day');
  }
  
  return special;
}

// Identify days of caution based on life path
function identifyCautionDays(universalDay, personalDay, lifePath, karmicDebt = []) {
  const cautions = [];
  
  // Life Path specific caution days
  const lifepathChallenges = {
    1: { numbers: [2, 6], reason: "Cooperation challenges - ego may clash with need for harmony" },
    2: { numbers: [1, 8], reason: "Assertiveness pressure - may feel overwhelmed by aggressive energy" },
    3: { numbers: [4, 7], reason: "Expression blocked - structure or solitude may feel stifling" },
    4: { numbers: [3, 5], reason: "Chaos alert - scattered energy disrupts your need for order" },
    5: { numbers: [4, 8], reason: "Freedom restricted - rigid expectations may feel suffocating" },
    6: { numbers: [5, 7], reason: "Family disconnect - restlessness or isolation may strain bonds" },
    7: { numbers: [4, 8], reason: "Spiritual fog - material focus can lead to overthinking & isolation" },
    8: { numbers: [2, 7], reason: "Power diffused - introspection may slow momentum" },
    9: { numbers: [1, 8], reason: "Ego trap - personal ambition conflicts with humanitarian calling" },
    11: { numbers: [4, 8], reason: "Intuition blocked - material concerns cloud spiritual vision" },
    22: { numbers: [5, 7], reason: "Building disrupted - instability or withdrawal threatens projects" },
    33: { numbers: [1, 8], reason: "Service strain - personal ambition conflicts with healing mission" }
  };
  
  const reducedLifePath = lifePath > 9 && ![11, 22, 33].includes(lifePath) ? reduceToDigit(lifePath, false) : lifePath;
  const challenges = lifepathChallenges[reducedLifePath];
  
  if (challenges) {
    // Check universal day
    if (challenges.numbers.includes(universalDay)) {
      cautions.push({
        type: 'universal',
        level: 'moderate',
        message: `Universal ${universalDay} Day: ${challenges.reason}`
      });
    }
    // Check personal day - higher caution
    if (personalDay && challenges.numbers.includes(personalDay)) {
      cautions.push({
        type: 'personal',
        level: 'high',
        message: `Personal ${personalDay} Day: ${challenges.reason}`
      });
    }
    // Double whammy - both universal and personal are challenging
    if (challenges.numbers.includes(universalDay) && personalDay && challenges.numbers.includes(personalDay)) {
      cautions.push({
        type: 'combined',
        level: 'critical',
        message: `Double caution day - both energies challenge your Life Path ${lifePath}`
      });
    }
  }
  
  // Karmic debt days - extra caution if your karmic numbers appear
  if (karmicDebt && karmicDebt.length > 0) {
    // Check if personal day reduces from a karmic number pattern
    const karmicDayPatterns = {
      13: [4], // 13 reduces to 4
      14: [5], // 14 reduces to 5
      16: [7], // 16 reduces to 7
      19: [1]  // 19 reduces to 1
    };
    
    karmicDebt.forEach(debt => {
      const debtNum = parseInt(debt);
      const reducedDebt = karmicDayPatterns[debtNum];
      if (reducedDebt && (reducedDebt.includes(universalDay) || reducedDebt.includes(personalDay))) {
        cautions.push({
          type: 'karmic',
          level: 'high',
          message: `Karmic Debt ${debtNum} activation - past patterns may resurface. Stay mindful.`
        });
      }
    });
  }
  
  // 7 specific warnings (for deep seekers who can slip into isolation/overthinking)
  if (reducedLifePath === 7 || lifePath === 7) {
    if (universalDay === 7 || personalDay === 7) {
      cautions.push({
        type: 'lifepath_echo',
        level: 'moderate', 
        message: '7 on 7: Risk of over-analysis & isolation. Stay connected, don\'t retreat too deep.'
      });
    }
    if ((universalDay === 4 && personalDay === 8) || (universalDay === 8 && personalDay === 4)) {
      cautions.push({
        type: 'material_trap',
        level: 'high',
        message: 'Heavy material energy today - skepticism & frustration may arise. Ground in nature.'
      });
    }
  }
  
  return cautions;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { startDate, endDate, familyMemberId, lifePath, createEvents = false } = body;
    
    if (!startDate || !endDate) {
      return Response.json({ error: 'startDate and endDate required' }, { status: 400 });
    }
    
    // Get life path from family member if provided
    let memberLifePath = lifePath;
    if (familyMemberId && !lifePath) {
      const members = await base44.entities.FamilyMember.filter({ id: familyMemberId });
      if (members.length > 0) {
        memberLifePath = members[0].life_path_western || members[0].life_path_chaldean;
      }
    }
    
    const predictions = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get karmic debt if family member provided
    let memberKarmicDebt = [];
    if (familyMemberId) {
      const members = await base44.entities.FamilyMember.filter({ id: familyMemberId });
      if (members.length > 0 && members[0].karmic_debt_number) {
        memberKarmicDebt = members[0].karmic_debt_number.split(',').map(n => n.trim()).filter(Boolean);
      }
    }
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayNumbers = calculateDayNumbers(dateStr, memberLifePath);
      
      const specialDays = identifySpecialDays(
        dayNumbers.universalDay, 
        dayNumbers.personalDay, 
        memberLifePath
      );
      
      const cautionDays = identifyCautionDays(
        dayNumbers.universalDay,
        dayNumbers.personalDay,
        memberLifePath,
        memberKarmicDebt
      );
      
      const prediction = {
        date: dateStr,
        universal_day_number: dayNumbers.universalDay,
        personal_day_number: dayNumbers.personalDay || null,
        universal_vibe: getVibeSummary(dayNumbers.universalDay),
        personal_vibe: dayNumbers.personalDay ? getVibeSummary(dayNumbers.personalDay) : null,
        recommendations: getRecommendations(dayNumbers.personalDay || dayNumbers.universalDay),
        suggested_activities: suggestEventTypes(dayNumbers.universalDay, dayNumbers.personalDay),
        special_significance: specialDays,
        caution_alerts: cautionDays,
        is_caution_day: cautionDays.length > 0,
        caution_level: cautionDays.length > 0 ? 
          (cautionDays.some(c => c.level === 'critical') ? 'critical' : 
           cautionDays.some(c => c.level === 'high') ? 'high' : 'moderate') : null,
        is_master_day: [11, 22, 33].includes(dayNumbers.universalDay) || 
                       [11, 22, 33].includes(dayNumbers.personalDay),
        is_aligned: dayNumbers.personalDay && dayNumbers.universalDay === dayNumbers.personalDay,
        is_power_day: memberLifePath && dayNumbers.universalDay === memberLifePath
      };
      
      predictions.push(prediction);
      
      // Create calendar events if requested (only for special days)
      if (createEvents && (prediction.is_master_day || prediction.is_aligned || prediction.is_power_day)) {
        const eventTitle = specialDays.length > 0 
          ? specialDays[0] 
          : `Special Numerology Day (U:${dayNumbers.universalDay} P:${dayNumbers.personalDay || '-'})`;
        
        await base44.entities.CalendarEvent.create({
          user_id: user.id,
          family_member_id: familyMemberId || null,
          event_date: dateStr,
          event_title: eventTitle,
          event_type: 'spiritual',
          universal_day_number: dayNumbers.universalDay,
          personal_day_number: dayNumbers.personalDay || null,
          vibe_summary: prediction.universal_vibe,
          recommendations: prediction.recommendations
        });
      }
    }
    
    // Summary statistics
    const summary = {
      total_days: predictions.length,
      master_days: predictions.filter(p => p.is_master_day).length,
      aligned_days: predictions.filter(p => p.is_aligned).length,
      power_days: predictions.filter(p => p.is_power_day).length,
      best_days_for_new_starts: predictions.filter(p => p.universal_day_number === 1).map(p => p.date),
      best_days_for_business: predictions.filter(p => [1, 8, 22].includes(p.universal_day_number)).map(p => p.date),
      best_days_for_family: predictions.filter(p => [2, 6].includes(p.universal_day_number)).map(p => p.date),
      best_days_for_creativity: predictions.filter(p => [3, 5].includes(p.universal_day_number)).map(p => p.date),
      best_days_for_reflection: predictions.filter(p => [7, 11].includes(p.universal_day_number)).map(p => p.date)
    };
    
    return Response.json({ 
      success: true, 
      data: {
        predictions,
        summary,
        life_path_used: memberLifePath || null
      }
    });
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});