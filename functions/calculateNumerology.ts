/**
 * Universal Numerology Calculator
 * Handles both DATE and NAME numerology calculations
 * 
 * Supports:
 * - Date: Eastern (1+5+11+2+0+2+5), Western (sum all), Reverse methods
 * - Date: Hebrew calendar conversion and calculations
 * - Name: Pythagorean, Chaldean, Gematria (Simple & Reverse)
 * - Name: Vowel/Consonant analysis, Expression, Soul Urge, Personality
 * - Master number preservation (11, 22, 33, 44, 55, 66, 77, 88, 99)
 * 
 * Author: Maher Family Legacy
 * Version: 2.0
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// ============================================================================
// PYTHAGOREAN MAPPING (A=1, B=2, ... cycles 1-9)
// ============================================================================
const PYTHAGOREAN = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

// ============================================================================
// CHALDEAN MAPPING (No 9 - considered sacred)
// ============================================================================
const CHALDEAN = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const MASTER_NUMBERS = [11, 22, 33, 44, 55, 66, 77, 88, 99];

// ============================================================================
// CORE REDUCTION FUNCTIONS
// ============================================================================

function reduceToDigit(n, keepMaster = true) {
  if (n < 0) n = Math.abs(n);
  
  // Check if already a master number
  if (keepMaster && MASTER_NUMBERS.includes(n)) {
    return n;
  }
  
  // Reduce by summing digits
  while (n > 9) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d), 0);
    // Check if reduction creates a master number
    if (keepMaster && [11, 22, 33].includes(n)) {
      return n;
    }
  }
  
  return n;
}

function formatWithReduction(total, keepMaster = true) {
  const reduced = reduceToDigit(total, keepMaster);
  if (total === reduced || total < 10) {
    return String(reduced);
  }
  return `${total}/${reduced}`;
}

// ============================================================================
// DATE NUMEROLOGY FUNCTIONS
// ============================================================================

function getDateVibes(day, month, year) {
  return {
    dayVibe: reduceToDigit(day),
    monthVibe: reduceToDigit(month),
    yearVibe: reduceToDigit(year)
  };
}

function calculateDateEastern(day, month, year) {
  // Eastern method: Add each component separately, then combine
  // Example: 1/5/2025 = 1 + 5 + (2+0+2+5=9) = 1+5+9 = 15/6
  const dayReduced = reduceToDigit(day);
  const monthReduced = reduceToDigit(month);
  const yearReduced = reduceToDigit(year);
  
  const total = dayReduced + monthReduced + yearReduced;
  return {
    calculation: `${dayReduced}+${monthReduced}+${yearReduced}`,
    total,
    reduced: reduceToDigit(total),
    formatted: formatWithReduction(total)
  };
}

function calculateDateWestern(day, month, year) {
  // Western method: Sum all digits together at once
  // Example: 1/5/2025 = 1+5+2+0+2+5 = 15/6
  const allDigits = `${day}${month}${year}`;
  const total = allDigits.split('').reduce((sum, d) => sum + parseInt(d), 0);
  return {
    calculation: allDigits.split('').join('+'),
    total,
    reduced: reduceToDigit(total),
    formatted: formatWithReduction(total)
  };
}

function calculateDateReverse(day, month, year) {
  // Reverse method: Year/Month/Day order (like ISO date)
  const allDigits = `${year}${month}${day}`;
  const total = allDigits.split('').reduce((sum, d) => sum + parseInt(d), 0);
  return {
    calculation: allDigits.split('').join('+'),
    total,
    reduced: reduceToDigit(total),
    formatted: formatWithReduction(total)
  };
}

function detectMasterNumbers(day, month, year) {
  const locations = [];
  const masters = new Set();
  
  // Check day
  if (MASTER_NUMBERS.includes(day)) {
    locations.push(`day:${day}`);
    masters.add(day);
  }
  
  // Check month (only 11 possible)
  if (month === 11) {
    locations.push('month:11');
    masters.add(11);
  }
  
  // Check year reduction
  const yearReduced = reduceToDigit(year);
  if ([11, 22, 33].includes(yearReduced)) {
    locations.push(`year:${yearReduced}`);
    masters.add(yearReduced);
  }
  
  // Check various calculation methods
  const eastern = calculateDateEastern(day, month, year);
  const western = calculateDateWestern(day, month, year);
  const reverse = calculateDateReverse(day, month, year);
  
  if ([11, 22, 33].includes(eastern.total) || [11, 22, 33].includes(eastern.reduced)) {
    const val = [11, 22, 33].includes(eastern.total) ? eastern.total : eastern.reduced;
    locations.push(`eastern:${val}`);
    masters.add(val);
  }
  
  if ([11, 22, 33].includes(western.total) || [11, 22, 33].includes(western.reduced)) {
    const val = [11, 22, 33].includes(western.total) ? western.total : western.reduced;
    locations.push(`western:${val}`);
    masters.add(val);
  }
  
  if ([11, 22, 33].includes(reverse.total) || [11, 22, 33].includes(reverse.reduced)) {
    const val = [11, 22, 33].includes(reverse.total) ? reverse.total : reverse.reduced;
    locations.push(`reverse:${val}`);
    masters.add(val);
  }
  
  return {
    hasMaster: masters.size > 0,
    masterNumbers: Array.from(masters).sort((a, b) => a - b).join(','),
    masterLocations: locations.join('; ')
  };
}

// ============================================================================
// HEBREW CALENDAR CONVERSION (Approximation)
// ============================================================================

function gregorianToHebrew(year, month, day) {
  // Simplified Hebrew calendar conversion
  // For accurate conversion, use a proper library in production
  
  const hebrewYear = year + 3760;
  
  // Hebrew months (simplified mapping based on Gregorian month)
  const hebrewMonths = [
    'Tevet', 'Shevat', 'Adar', 'Nisan', 'Iyar', 'Sivan',
    'Tammuz', 'Av', 'Elul', 'Tishrei', 'Cheshvan', 'Kislev'
  ];
  
  // Approximate Hebrew month (this is a simplification)
  const hebrewMonthIndex = (month + 9) % 12;
  const hebrewMonth = hebrewMonthIndex + 1;
  const hebrewMonthName = hebrewMonths[hebrewMonthIndex];
  
  // Hebrew day (approximate - actual depends on molad)
  const hebrewDay = ((day + 10) % 30) + 1;
  
  return {
    hebrewYear,
    hebrewMonth,
    hebrewDay,
    hebrewDate: `${hebrewDay} ${hebrewMonthName} ${hebrewYear}`,
    hebrewDayVibe: reduceToDigit(hebrewDay),
    hebrewMonthVibe: reduceToDigit(hebrewMonth),
    hebrewYearVibe: reduceToDigit(hebrewYear)
  };
}

function calculateShemitahPosition(hebrewYear) {
  // Shemitah cycle is every 7 years
  const position = ((hebrewYear - 1) % 7) + 1;
  const isShemitah = position === 7;
  
  return {
    position,
    isShemitah,
    alert: isShemitah ? 'SHEMITAH YEAR' : (position === 6 ? 'Pre-Shemitah' : null)
  };
}

// ============================================================================
// NAME NUMEROLOGY FUNCTIONS
// ============================================================================

function cleanName(name) {
  if (!name) return '';
  
  let cleaned = String(name).trim();
  
  // Remove common suffixes (for company names)
  const suffixPatterns = [
    /\s+(Inc|Corp|LLC|Ltd|Company|Co|Corporation|Incorporated)\.?\s*$/i,
    /\s+(Technologies|Technology|Systems|Solutions|Services|Group|Holdings?)\.?\s*$/i,
    /\s+(International|Global|Worldwide|Industries|Partners|Financial)\.?\s*$/i,
    /\s+(Common\s+Stock|Preferred\s+Stock|Class\s+[A-Z])\.?\s*$/i,
    /^The\s+/i
  ];
  
  for (const pattern of suffixPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  return cleaned.trim();
}

function pythagoreanSum(text) {
  if (!text) return 0;
  let total = 0;
  for (const ch of text.toUpperCase()) {
    if (PYTHAGOREAN[ch]) {
      total += PYTHAGOREAN[ch];
    }
  }
  return total;
}

function chaldeanSum(text) {
  if (!text) return 0;
  let total = 0;
  for (const ch of text.toUpperCase()) {
    if (CHALDEAN[ch]) {
      total += CHALDEAN[ch];
    }
  }
  return total;
}

function gematriaSimple(text) {
  // A=1, B=2, ... Z=26
  if (!text) return 0;
  let total = 0;
  for (const ch of text.toUpperCase()) {
    if (ch >= 'A' && ch <= 'Z') {
      total += ch.charCodeAt(0) - 64;
    }
  }
  return total;
}

function gematriaReverse(text) {
  // Z=1, Y=2, ... A=26
  if (!text) return 0;
  let total = 0;
  for (const ch of text.toUpperCase()) {
    if (ch >= 'A' && ch <= 'Z') {
      total += 27 - (ch.charCodeAt(0) - 64);
    }
  }
  return total;
}

function vowelConsonantAnalysis(text) {
  if (!text) return { vowelSum: 0, consonantSum: 0, ratio: 0 };
  
  let vowelSum = 0;
  let consonantSum = 0;
  
  for (const ch of text.toUpperCase()) {
    if (PYTHAGOREAN[ch]) {
      if (VOWELS.includes(ch)) {
        vowelSum += PYTHAGOREAN[ch];
      } else {
        consonantSum += PYTHAGOREAN[ch];
      }
    }
  }
  
  const ratio = consonantSum > 0 ? Math.round((vowelSum / consonantSum) * 100) / 100 : 0;
  
  return { vowelSum, consonantSum, ratio };
}

function calculateLifePathWestern(birthDate) {
  // Western/Pythagorean method: Add full numbers together, then reduce
  // Example: 11/07/1969 = 11 + 7 + 1969 = 1987 → 1+9+8+7 = 25 → 2+5 = 7
  // Preserves master numbers (11, 22, 33)
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const total = month + day + year;
  
  return {
    calculation: `${month}+${day}+${year}=${total}`,
    total,
    reduced: reduceToDigit(total),
    formatted: formatWithReduction(total)
  };
}

function calculateLifePathChaldean(birthDate) {
  // Chaldean/Eastern method: Sum ALL individual digits
  // Example: 11/07/1969 = 1+1+0+7+1+9+6+9 = 34 → 3+4 = 7
  // Also preserves master numbers (11, 22, 33)
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const allDigits = `${month}${day}${year}`;
  const total = allDigits.split('').reduce((sum, d) => sum + parseInt(d), 0);
  
  return {
    calculation: allDigits.split('').join('+') + '=' + total,
    total,
    reduced: reduceToDigit(total),
    formatted: formatWithReduction(total)
  };
}

function calculateExpressionWestern(fullName) {
  // Western Expression = Full name Pythagorean sum, then reduce
  const sum = pythagoreanSum(fullName);
  return {
    sum,
    reduced: reduceToDigit(sum),
    formatted: formatWithReduction(sum)
  };
}

function calculateExpressionChaldean(fullName) {
  // Chaldean Expression = Full name Chaldean sum, then reduce
  const sum = chaldeanSum(fullName);
  return {
    sum,
    reduced: reduceToDigit(sum),
    formatted: formatWithReduction(sum)
  };
}

function calculateSoulUrgeWestern(fullName) {
  // Soul Urge Western = Vowels only using Pythagorean
  if (!fullName) return { sum: 0, reduced: 0, formatted: '0' };
  
  let sum = 0;
  for (const ch of fullName.toUpperCase()) {
    if (VOWELS.includes(ch) && PYTHAGOREAN[ch]) {
      sum += PYTHAGOREAN[ch];
    }
  }
  
  return {
    sum,
    reduced: reduceToDigit(sum),
    formatted: formatWithReduction(sum)
  };
}

function calculateSoulUrgeChaldean(fullName) {
  // Soul Urge Chaldean = Vowels only using Chaldean
  if (!fullName) return { sum: 0, reduced: 0, formatted: '0' };
  
  let sum = 0;
  for (const ch of fullName.toUpperCase()) {
    if (VOWELS.includes(ch) && CHALDEAN[ch]) {
      sum += CHALDEAN[ch];
    }
  }
  
  return {
    sum,
    reduced: reduceToDigit(sum),
    formatted: formatWithReduction(sum)
  };
}

function calculatePersonalityWestern(fullName) {
  // Personality Western = Consonants only using Pythagorean
  if (!fullName) return { sum: 0, reduced: 0, formatted: '0' };
  
  let sum = 0;
  for (const ch of fullName.toUpperCase()) {
    if (!VOWELS.includes(ch) && PYTHAGOREAN[ch]) {
      sum += PYTHAGOREAN[ch];
    }
  }
  
  return {
    sum,
    reduced: reduceToDigit(sum),
    formatted: formatWithReduction(sum)
  };
}

function calculatePersonalityChaldean(fullName) {
  // Personality Chaldean = Consonants only using Chaldean
  if (!fullName) return { sum: 0, reduced: 0, formatted: '0' };
  
  let sum = 0;
  for (const ch of fullName.toUpperCase()) {
    if (!VOWELS.includes(ch) && CHALDEAN[ch]) {
      sum += CHALDEAN[ch];
    }
  }
  
  return {
    sum,
    reduced: reduceToDigit(sum),
    formatted: formatWithReduction(sum)
  };
}

function calculateBirthdayNumber(day) {
  return {
    day,
    reduced: reduceToDigit(day),
    formatted: formatWithReduction(day)
  };
}

function detectNameMasterNumbers(fullName, birthDate) {
  const masters = new Set();
  const locations = [];
  
  // Expression (Western - primary)
  const expression = calculateExpressionWestern(fullName);
  if ([11, 22, 33].includes(expression.sum) || [11, 22, 33].includes(expression.reduced)) {
    const val = [11, 22, 33].includes(expression.sum) ? expression.sum : expression.reduced;
    masters.add(val);
    locations.push(`expression:${val}`);
  }
  
  // Soul Urge (Western - primary)
  const soulUrge = calculateSoulUrgeWestern(fullName);
  if ([11, 22, 33].includes(soulUrge.sum) || [11, 22, 33].includes(soulUrge.reduced)) {
    const val = [11, 22, 33].includes(soulUrge.sum) ? soulUrge.sum : soulUrge.reduced;
    masters.add(val);
    locations.push(`soulUrge:${val}`);
  }
  
  // Personality (Western - primary)
  const personality = calculatePersonalityWestern(fullName);
  if ([11, 22, 33].includes(personality.sum) || [11, 22, 33].includes(personality.reduced)) {
    const val = [11, 22, 33].includes(personality.sum) ? personality.sum : personality.reduced;
    masters.add(val);
    locations.push(`personality:${val}`);
  }
  
  // Life Path (Western - primary)
  if (birthDate) {
    const lifePath = calculateLifePathWestern(birthDate);
    if ([11, 22, 33].includes(lifePath.total) || [11, 22, 33].includes(lifePath.reduced)) {
      const val = [11, 22, 33].includes(lifePath.total) ? lifePath.total : lifePath.reduced;
      masters.add(val);
      locations.push(`lifePath:${val}`);
    }
    
    // Birthday day
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    if ([11, 22].includes(day)) {
      masters.add(day);
      locations.push(`birthday:${day}`);
    }
    
    // Birthday month (November = 11)
    if (month === 11) {
      masters.add(11);
      locations.push(`month:11`);
    }
  }
  
  return {
    hasMaster: masters.size > 0,
    masterNumbers: Array.from(masters).sort((a, b) => a - b).join(','),
    masterLocations: locations.join('; ')
  };
}

// ============================================================================
// FULL CALCULATION FUNCTIONS
// ============================================================================

function calculateFullDateNumerology(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const vibes = getDateVibes(day, month, year);
  const eastern = calculateDateEastern(day, month, year);
  const western = calculateDateWestern(day, month, year);
  const reverse = calculateDateReverse(day, month, year);
  const masters = detectMasterNumbers(day, month, year);
  const hebrew = gregorianToHebrew(year, month, day);
  const shemitah = calculateShemitahPosition(hebrew.hebrewYear);
  
  // Hebrew date calculations
  const hebrewEastern = calculateDateEastern(hebrew.hebrewDay, hebrew.hebrewMonth, hebrew.hebrewYear);
  const hebrewWestern = calculateDateWestern(hebrew.hebrewDay, hebrew.hebrewMonth, hebrew.hebrewYear);
  const hebrewReverse = calculateDateReverse(hebrew.hebrewDay, hebrew.hebrewMonth, hebrew.hebrewYear);
  
  return {
    // Gregorian basics
    greg_date: dateStr,
    greg_day: day,
    greg_month: month,
    greg_year: year,
    day_vibe: vibes.dayVibe,
    month_vibe: vibes.monthVibe,
    year_vibe: vibes.yearVibe,
    
    // Gregorian calculations
    day_month_eastern: `${reduceToDigit(day)}+${reduceToDigit(month)}=${reduceToDigit(day + month)}`,
    day_month_western: formatWithReduction(day + month),
    day_month_reverse: formatWithReduction(month + day),
    full_date_eastern: eastern.formatted,
    full_date_western: western.formatted,
    full_date_reverse: reverse.formatted,
    full_date_vibe_eastern: String(eastern.reduced),
    full_date_vibe_western: String(western.reduced),
    full_date_vibe_reverse_eastern: String(eastern.reduced),
    full_date_vibe_reverse_western: String(reverse.reduced),
    
    // Method comparison flags
    greg_method_differs: eastern.reduced !== western.reduced,
    greg_reverse_equals_eastern_dm: reduceToDigit(month + day) === reduceToDigit(day + month),
    greg_reverse_equals_eastern_full: reverse.reduced === eastern.reduced,
    
    // Hebrew basics
    hebrew_date: hebrew.hebrewDate,
    hebrew_day: hebrew.hebrewDay,
    hebrew_month: hebrew.hebrewMonth,
    hebrew_year: hebrew.hebrewYear,
    hebrew_day_vibe: hebrew.hebrewDayVibe,
    hebrew_month_vibe: hebrew.hebrewMonthVibe,
    hebrew_year_vibe: hebrew.hebrewYearVibe,
    
    // Hebrew calculations
    hebrew_day_month_eastern: `${hebrew.hebrewDayVibe}+${hebrew.hebrewMonthVibe}=${reduceToDigit(hebrew.hebrewDayVibe + hebrew.hebrewMonthVibe)}`,
    hebrew_day_month_western: formatWithReduction(hebrew.hebrewDay + hebrew.hebrewMonth),
    hebrew_day_month_reverse: formatWithReduction(hebrew.hebrewMonth + hebrew.hebrewDay),
    hebrew_full_date_eastern: hebrewEastern.formatted,
    hebrew_full_date_western: hebrewWestern.formatted,
    hebrew_full_date_reverse: hebrewReverse.formatted,
    hebrew_full_date_vibe_eastern: String(hebrewEastern.reduced),
    hebrew_full_date_vibe_western: String(hebrewWestern.reduced),
    hebrew_full_date_vibe_reverse_eastern: String(hebrewEastern.reduced),
    hebrew_full_date_vibe_reverse_western: String(hebrewReverse.reduced),
    
    // Hebrew method comparison flags
    heb_method_differs: hebrewEastern.reduced !== hebrewWestern.reduced,
    heb_reverse_equals_eastern_dm: reduceToDigit(hebrew.hebrewMonth + hebrew.hebrewDay) === reduceToDigit(hebrew.hebrewDay + hebrew.hebrewMonth),
    heb_reverse_equals_eastern_full: hebrewReverse.reduced === hebrewEastern.reduced,
    
    // Master numbers
    has_master_number: masters.hasMaster ? masters.masterNumbers : null,
    master_locations: masters.masterLocations || null,
    
    // Shemitah
    shemitah_year_position: shemitah.position,
    shemitah_alert: shemitah.alert,
    
    // Combined signal (for games)
    combined_signal: generateCombinedSignal(eastern.reduced, western.reduced, masters.hasMaster)
  };
}

function generateCombinedSignal(easternVibe, westernVibe, hasMaster) {
  const signals = [];
  
  if (hasMaster) signals.push('MASTER');
  if (easternVibe === westernVibe) signals.push('ALIGNED');
  if ([7, 8, 9].includes(easternVibe)) signals.push('HIGH_ENERGY');
  if ([1, 2, 3].includes(easternVibe)) signals.push('NEW_BEGINNINGS');
  if (easternVibe === 5) signals.push('CHANGE');
  if (easternVibe === 6) signals.push('HARMONY');
  
  return signals.join('; ') || 'NEUTRAL';
}

function calculateFullNameNumerology(fullName, birthDate = null) {
  const cleanedName = cleanName(fullName);
  
  // Western calculations (Pythagorean-based) - PRIMARY for display
  const expressionWestern = calculateExpressionWestern(cleanedName);
  const soulUrgeWestern = calculateSoulUrgeWestern(cleanedName);
  const personalityWestern = calculatePersonalityWestern(cleanedName);
  
  // Chaldean calculations - stored as secondary
  const expressionChaldean = calculateExpressionChaldean(cleanedName);
  const soulUrgeChaldean = calculateSoulUrgeChaldean(cleanedName);
  const personalityChaldean = calculatePersonalityChaldean(cleanedName);
  
  const vowelConsonant = vowelConsonantAnalysis(cleanedName);
  const masters = detectNameMasterNumbers(cleanedName, birthDate);
  
  // Collect master numbers as array (from Western calculations)
  const masterNumbersArray = [];
  if ([11, 22, 33].includes(expressionWestern.sum)) masterNumbersArray.push(expressionWestern.sum);
  else if ([11, 22, 33].includes(expressionWestern.reduced)) masterNumbersArray.push(expressionWestern.reduced);
  if ([11, 22, 33].includes(soulUrgeWestern.sum)) masterNumbersArray.push(soulUrgeWestern.sum);
  else if ([11, 22, 33].includes(soulUrgeWestern.reduced)) masterNumbersArray.push(soulUrgeWestern.reduced);
  if ([11, 22, 33].includes(personalityWestern.sum)) masterNumbersArray.push(personalityWestern.sum);
  else if ([11, 22, 33].includes(personalityWestern.reduced)) masterNumbersArray.push(personalityWestern.reduced);
  
  const result = {
    // Name info
    original_name: fullName,
    cleaned_name: cleanedName,
    
    // Pythagorean - structured for UI
    pythagorean: {
      total: pythagoreanSum(cleanedName),
      reduced: reduceToDigit(pythagoreanSum(cleanedName)),
      display: formatWithReduction(pythagoreanSum(cleanedName))
    },
    
    // Chaldean - structured for UI
    chaldean: {
      total: chaldeanSum(cleanedName),
      reduced: reduceToDigit(chaldeanSum(cleanedName)),
      display: formatWithReduction(chaldeanSum(cleanedName))
    },
    
    // Gematria - structured for UI
    gematria: {
      total: gematriaSimple(cleanedName),
      simple: gematriaSimple(cleanedName),
      reverse: gematriaReverse(cleanedName)
    },
    
    // Western (Pythagorean) - PRIMARY for display
    expression: {
      sum: expressionWestern.sum,
      reduced: [11, 22, 33].includes(expressionWestern.sum) ? expressionWestern.sum : expressionWestern.reduced,
      display: [11, 22, 33].includes(expressionWestern.sum) ? String(expressionWestern.sum) : expressionWestern.formatted
    },
    soulUrge: {
      sum: soulUrgeWestern.sum,
      reduced: [11, 22, 33].includes(soulUrgeWestern.sum) ? soulUrgeWestern.sum : soulUrgeWestern.reduced,
      display: [11, 22, 33].includes(soulUrgeWestern.sum) ? String(soulUrgeWestern.sum) : soulUrgeWestern.formatted
    },
    personality: {
      sum: personalityWestern.sum,
      reduced: [11, 22, 33].includes(personalityWestern.sum) ? personalityWestern.sum : personalityWestern.reduced,
      display: [11, 22, 33].includes(personalityWestern.sum) ? String(personalityWestern.sum) : personalityWestern.formatted
    },
    
    // Chaldean versions for storage
    expressionChaldean: {
      sum: expressionChaldean.sum,
      reduced: [11, 22, 33].includes(expressionChaldean.sum) ? expressionChaldean.sum : expressionChaldean.reduced,
      display: [11, 22, 33].includes(expressionChaldean.sum) ? String(expressionChaldean.sum) : expressionChaldean.formatted
    },
    soulUrgeChaldean: {
      sum: soulUrgeChaldean.sum,
      reduced: [11, 22, 33].includes(soulUrgeChaldean.sum) ? soulUrgeChaldean.sum : soulUrgeChaldean.reduced,
      display: [11, 22, 33].includes(soulUrgeChaldean.sum) ? String(soulUrgeChaldean.sum) : soulUrgeChaldean.formatted
    },
    personalityChaldean: {
      sum: personalityChaldean.sum,
      reduced: [11, 22, 33].includes(personalityChaldean.sum) ? personalityChaldean.sum : personalityChaldean.reduced,
      display: [11, 22, 33].includes(personalityChaldean.sum) ? String(personalityChaldean.sum) : personalityChaldean.formatted
    },
    
    // Vowel/Consonant analysis
    vowel_sum: vowelConsonant.vowelSum,
    consonant_sum: vowelConsonant.consonantSum,
    vowel_consonant_ratio: vowelConsonant.ratio,
    
    // Master numbers as array for UI
    masterNumbers: [...new Set(masterNumbersArray)].sort((a, b) => a - b),
    
    // Legacy fields
    has_master_number: masters.hasMaster ? masters.masterNumbers : null,
    master_locations: masters.masterLocations || null
  };
  
  // Add life path if birthdate provided
  if (birthDate) {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    // Western life path (primary)
    const lifePathWestern = calculateLifePathWestern(birthDate);
    const lifePathChaldean = calculateLifePathChaldean(birthDate);
    const birthday = calculateBirthdayNumber(day);
    const birthdayMonth = { reduced: reduceToDigit(month), display: formatWithReduction(month) };
    
    // Check if life path is master number
    const lifePathWesternIsMaster = [11, 22, 33].includes(lifePathWestern.total);
    const lifePathChaldeanIsMaster = [11, 22, 33].includes(lifePathChaldean.total);
    
    // Western life path (primary for display)
    result.lifePath = {
      total: lifePathWestern.total,
      reduced: lifePathWesternIsMaster ? lifePathWestern.total : lifePathWestern.reduced,
      display: lifePathWesternIsMaster ? String(lifePathWestern.total) : lifePathWestern.formatted
    };
    
    // Chaldean life path (for storage)
    result.lifePathChaldean = {
      total: lifePathChaldean.total,
      reduced: lifePathChaldeanIsMaster ? lifePathChaldean.total : lifePathChaldean.reduced,
      display: lifePathChaldeanIsMaster ? String(lifePathChaldean.total) : lifePathChaldean.formatted
    };
    
    result.birthday = {
      day: day,
      reduced: [11, 22].includes(day) ? day : birthday.reduced,
      display: [11, 22].includes(day) ? String(day) : birthday.formatted
    };
    
    result.birthdayMonth = birthdayMonth;
    
    // Add life path to master numbers if applicable (use Western)
    if (lifePathWesternIsMaster && !result.masterNumbers.includes(lifePathWestern.total)) {
      result.masterNumbers.push(lifePathWestern.total);
    }
    
    // Add birthday day to master numbers if applicable (11, 22)
    if ([11, 22].includes(day) && !result.masterNumbers.includes(day)) {
      result.masterNumbers.push(day);
    }
    
    // Add birth month to master numbers if applicable (11 = November)
    if (month === 11 && !result.masterNumbers.includes(11)) {
      result.masterNumbers.push(11);
    }
    
    // Sort and dedupe
    result.masterNumbers = [...new Set(result.masterNumbers)].sort((a, b) => a - b);
  }
  
  return result;
}

// ============================================================================
// FAMILY MEMBER CALCULATIONS
// ============================================================================

function calculateFamilyMember(name, birthDate) {
  const dateCalc = calculateFullDateNumerology(birthDate);
  const nameCalc = calculateFullNameNumerology(name, birthDate);
  
  return {
    name,
    birthDate,
    ...nameCalc,
    birth_date_numerology: dateCalc
  };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { type, date, name, birthDate, familyMembers } = body;
    
    let result;
    
    switch (type) {
      case 'date':
        // Calculate numerology for a specific date
        if (!date) {
          return Response.json({ error: 'Date required' }, { status: 400 });
        }
        result = calculateFullDateNumerology(date);
        break;
        
      case 'name':
        // Calculate numerology for a name
        if (!name) {
          return Response.json({ error: 'Name required' }, { status: 400 });
        }
        result = calculateFullNameNumerology(name, birthDate);
        break;
        
      case 'family':
        // Calculate for multiple family members
        if (!familyMembers || !Array.isArray(familyMembers)) {
          return Response.json({ error: 'Family members array required' }, { status: 400 });
        }
        result = familyMembers.map(member => 
          calculateFamilyMember(member.name, member.birthDate)
        );
        break;
        
      case 'dateRange':
        // Calculate for a range of dates (for populating database)
        const { startDate, endDate } = body;
        if (!startDate || !endDate) {
          return Response.json({ error: 'Start and end dates required' }, { status: 400 });
        }
        
        const results = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          results.push(calculateFullDateNumerology(d.toISOString().split('T')[0]));
        }
        result = results;
        break;
        
      default:
        return Response.json({ error: 'Invalid type. Use: date, name, family, or dateRange' }, { status: 400 });
    }
    
    return Response.json({ success: true, data: result });
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});