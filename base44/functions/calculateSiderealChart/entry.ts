/**
 * Reliable Sidereal Birth Chart (Whole Sign houses, Lahiri ayanamsa)
 *
 * Uses Astronomy Engine (VSOP87-based, +/-1 arcminute) for true-geocentric
 * ecliptic longitudes of date, computes a coordinate-based Ascendant from
 * Local Sidereal Time + geographic latitude + obliquity, applies a Lahiri
 * ayanamsa, and assigns Whole Sign houses.
 *
 * Provenance / confidence is returned with every result so the UI never labels
 * an estimate as precise.
 *
 * Inputs (JSON body):
 *   birthDate     "YYYY-MM-DD" (required)
 *   birthTime     "HH:MM AM/PM" | "HH:MM" (24h) | "" (optional, exact)
 *   birthPeriod   "early_morning" | "morning" | "afternoon" | "evening" | "unknown" (optional fallback)
 *   birthPlace    "City, ST" or "City, Country" (optional, geocoded via Nominatim)
 *   latitude      number (optional, bypasses geocoding)
 *   longitude     number (optional, bypasses geocoding)
 *   timezone       IANA tz name (optional; resolved from coords otherwise)
 *
 * Author: Maher Family Legacy
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import * as Astronomy from 'npm:astronomy-engine@2.1.19';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];
const SIGN_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

const PLANETS = [
  { key: 'Sun',     body: Astronomy.Body.Sun,     glyph: '☉', name: 'Sun' },
  { key: 'Moon',    body: Astronomy.Body.Moon,    glyph: '☽', name: 'Moon' },
  { key: 'Mercury', body: Astronomy.Body.Mercury, glyph: '☿', name: 'Mercury' },
  { key: 'Venus',   body: Astronomy.Body.Venus,   glyph: '♀', name: 'Venus' },
  { key: 'Mars',    body: Astronomy.Body.Mars,    glyph: '♂', name: 'Mars' },
  { key: 'Jupiter', body: Astronomy.Body.Jupiter, glyph: '♃', name: 'Jupiter' },
  { key: 'Saturn',  body: Astronomy.Body.Saturn,  glyph: '♄', name: 'Saturn' },
  { key: 'Uranus',  body: Astronomy.Body.Uranus,  glyph: '♅', name: 'Uranus' },
  { key: 'Neptune', body: Astronomy.Body.Neptune, glyph: '♆', name: 'Neptune' },
  { key: 'Pluto',   body: Astronomy.Body.Pluto,   glyph: '♇', name: 'Pluto' }
];

const HOUSE_MEANINGS = {
  1:  'Self, body, appearance, first impressions, the path you walk.',
  2:  'Resources, money, possessions, what you value, earned income.',
  3:  'Communication, siblings, short journeys, learning, immediate environment.',
  4:  'Home, family, roots, private life, the foundation beneath you.',
  5:  'Creativity, romance, children, pleasure, self-expression, play.',
  6:  'Daily work, health, routines, service, the body\'s upkeep.',
  7:  'Partnerships, marriage, contracts, open enemies, the other.',
  8:  'Transformation, shared resources, intimacy, death and rebirth, hidden things.',
  9:  'Higher learning, long travel, philosophy, religion, meaning, the guru.',
  10: 'Career, public image, authority, reputation, contribution to the world.',
  11: 'Friends, groups, community, hopes and wishes, long-range ideals.',
  12: 'Solitude, the subconscious, retreat, loss, liberation, the unseen.'
};

const AYANAMSA_J2000 = 23.854;          // Lahiri ayanamsa at J2000.0 (degrees)
const PRECESSION_PER_CENTURY = 1.39716; // general precession in longitude (deg/century)

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function norm360(n) {
  n = n % 360;
  return n < 0 ? n + 360 : n;
}
function signOf(deg) {
  return Math.floor(norm360(deg) / 30);
}
function degInSign(deg) {
  return norm360(deg) % 30;
}
function ayanamsaForDate(jd) {
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000 (UT)
  return AYANAMSA_J2000 + PRECESSION_PER_CENTURY * T;
}
function meanObliquity(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const sec = 21.448 - 46.8150 * T - 0.00059 * T * T + 0.001813 * T * T * T;
  return 23 + (26 / 60) + (sec / 3600); // degrees
}
function jdFromUtcMs(utcMs) {
  return utcMs / 86400000 + 2440587.5;
}

// Parse a birth time string to {hour, minute, exact} or null
function parseBirthTime(timeStr, periodStr) {
  if (timeStr) {
    const s = String(timeStr).toUpperCase().trim();
    const m12 = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/);
    const m24 = s.match(/^(\d{1,2}):(\d{2})/);
    if (m12) {
      let h = parseInt(m12[1]);
      const mi = parseInt(m12[2]);
      const p = m12[3];
      if (p === 'PM' && h !== 12) h += 12;
      if (p === 'AM' && h === 12) h = 0;
      return { hour: h, minute: mi, exact: true };
    }
    if (m24) {
      return { hour: parseInt(m24[1]), minute: parseInt(m24[2]), exact: true };
    }
  }
  const periods = {
    early_morning: { hour: 3,  minute: 0, exact: false },
    morning:      { hour: 9,  minute: 0, exact: false },
    afternoon:    { hour: 15, minute: 0, exact: false },
    evening:      { hour: 21, minute: 0, exact: false }
  };
  if (periodStr && periods[periodStr]) return periods[periodStr];
  return null;
}

// ---------------------------------------------------------------------------
// Timezone: offset from IANA name (uses Intl, full historical DST support)
// ---------------------------------------------------------------------------
function offsetMinutesForZone(utcMs, ianaTz) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaTz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  });
  const map = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) map[p.type] = p.value;
  let h = parseInt(map.hour);
  if (h === 24) h = 0;
  const asUtc = Date.UTC(
    parseInt(map.year), parseInt(map.month) - 1, parseInt(map.day),
    h, parseInt(map.minute), parseInt(map.second)
  );
  return Math.round((asUtc - utcMs) / 60000); // local = utc + offsetMinutes
}

function localToUtcMs(y, m, d, h, mi, ianaTz, longitudeDeg) {
  const wall = Date.UTC(y, m - 1, d, h, mi, 0);
  if (ianaTz) {
    let off = offsetMinutesForZone(wall, ianaTz);
    let utc = wall - off * 60000;
    // one iteration for DST-boundary safety
    off = offsetMinutesForZone(utc, ianaTz);
    return utc - off * 60000;
  }
  // fallback: longitude-based standard offset (no DST)
  const offsetHours = Math.round(longitudeDeg / 15);
  return wall - offsetHours * 3600000;
}

// ---------------------------------------------------------------------------
// Geocoding (OpenStreetMap Nominatim, keyless)
// ---------------------------------------------------------------------------
async function geocode(place) {
  if (!place) return null;
  try {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
      encodeURIComponent(place);
    const res = await fetch(url, {
      headers: {
        'User-Agent': '7day11-family-legacy/1.0 (numerology app)',
        'Accept-Language': 'en'
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const arr = await res.json();
    if (Array.isArray(arr) && arr.length > 0) {
      return {
        latitude: parseFloat(arr[0].lat),
        longitude: parseFloat(arr[0].lon),
        display: arr[0].display_name
      };
    }
  } catch (e) { /* fall through */ }
  return null;
}

// US state -> IANA timezone. The app collects a US state; the platform's
// Intl runtime (full IANA tz database) then applies the correct historical
// UTC offset including daylight-saving for the birth moment.
const STATE_TZ = {
  CT:'America/New_York', DE:'America/New_York', DC:'America/New_York',
  FL:'America/New_York', GA:'America/New_York', IN:'America/New_York',
  ME:'America/New_York', MD:'America/New_York', MA:'America/New_York',
  MI:'America/New_York', NH:'America/New_York', NJ:'America/New_York',
  NY:'America/New_York', NC:'America/New_York', OH:'America/New_York',
  PA:'America/New_York', RI:'America/New_York', SC:'America/New_York',
  VT:'America/New_York', VA:'America/New_York', WV:'America/New_York',
  KY:'America/New_York',
  AL:'America/Chicago', AR:'America/Chicago', IL:'America/Chicago',
  IA:'America/Chicago', KS:'America/Chicago', LA:'America/Chicago',
  MN:'America/Chicago', MS:'America/Chicago', MO:'America/Chicago',
  NE:'America/Chicago', ND:'America/Chicago', OK:'America/Chicago',
  SD:'America/Chicago', TN:'America/Chicago', TX:'America/Chicago',
  WI:'America/Chicago',
  AZ:'America/Phoenix', CO:'America/Denver', MT:'America/Denver',
  NM:'America/Denver', UT:'America/Denver', WY:'America/Denver', ID:'America/Denver',
  CA:'America/Los_Angeles', NV:'America/Los_Angeles', OR:'America/Los_Angeles',
  WA:'America/Los_Angeles',
  AK:'America/Anchorage', HI:'Pacific/Honolulu'
};
function tzFromState(state) {
  if (!state) return null;
  return STATE_TZ[String(state).toUpperCase()] || null;
}

// ---------------------------------------------------------------------------
// Ascendant & Midheaven (tropical of date, degrees)
// ---------------------------------------------------------------------------
function ascendantTropical(ramcDeg, latDeg, epsDeg) {
  const ramc = ramcDeg * Math.PI / 180;
  const lat = latDeg * Math.PI / 180;
  const eps = epsDeg * Math.PI / 180;
  // ASC = atan2( cos(RAMC), -( sin(eps)*tan(lat) + cos(eps)*sin(RAMC) ) )
  let asc = Math.atan2(
    Math.cos(ramc),
    -(Math.sin(eps) * Math.tan(lat) + Math.cos(eps) * Math.sin(ramc))
  );
  return norm360(asc * 180 / Math.PI);
}
function midheavenTropical(ramcDeg, epsDeg) {
  const ramc = ramcDeg * Math.PI / 180;
  const eps = epsDeg * Math.PI / 180;
  // MC ecliptic longitude: atan2( sin(RAMC), cos(eps)*cos(RAMC) )
  let mc = Math.atan2(Math.sin(ramc), Math.cos(eps) * Math.cos(ramc));
  return norm360(mc * 180 / Math.PI);
}

// ---------------------------------------------------------------------------
// Main calculation
// ---------------------------------------------------------------------------
async function calculateChart(input) {
  const notes = [];

  const dateStr = input.birthDate;
  if (!dateStr) throw new Error('birthDate is required');
  const [y, mo, d] = dateStr.split('-').map(s => parseInt(s));
  if (!y || !mo || !d) throw new Error('birthDate must be YYYY-MM-DD');

  // --- Location ---
  let lat = input.latitude != null ? parseFloat(input.latitude) : null;
  let lon = input.longitude != null ? parseFloat(input.longitude) : null;
  let placeDisplay = input.birthPlace || null;

  if ((lat == null || lon == null) && input.birthPlace) {
    const geo = await geocode(input.birthPlace);
    if (geo) {
      lat = geo.latitude;
      lon = geo.longitude;
      placeDisplay = geo.display || input.birthPlace;
    } else {
      notes.push('Birth place could not be geocoded — coordinates missing.');
    }
  }
  const locationResolved = (lat != null && lon != null && !Number.isNaN(lat) && !Number.isNaN(lon));

  // --- Time ---
  const parsed = parseBirthTime(input.birthTime, input.birthPeriod);
  let hour = 12, minute = 0, exactTime = false;
  if (parsed) {
    hour = parsed.hour; minute = parsed.minute; exactTime = parsed.exact;
  } else {
    notes.push('No birth time provided — planet positions calculated for local noon; houses are unavailable.');
  }

  // --- Timezone ---
  let tzName = input.timezone || null;
  let tzSource = input.timezone ? 'provided' : null;
  if (!tzName && input.birthState) {
    const stateTz = tzFromState(input.birthState);
    if (stateTz) { tzName = stateTz; tzSource = 'state-map (Intl DST)'; }
  }
  if (!tzName && locationResolved) {
    tzSource = 'longitude-estimate (no DST)';
    notes.push('Timezone resolved from longitude only (no DST) — Ascendant may be off by up to one sign near time-zone edges.');
  }
  if (!locationResolved) {
    tzName = null;
    tzSource = null;
  }

  // --- UTC instant ---
  let utcMs;
  if (locationResolved) {
    utcMs = localToUtcMs(y, mo, d, hour, minute, tzName, lon);
  } else {
    // No location: assume noon UTC (planet signs only, no houses)
    utcMs = Date.UTC(y, mo - 1, d, 12, 0, 0);
    notes.push('No location — planet positions calculated for noon UTC.');
  }
  const jd = jdFromUtcMs(utcMs);
  const dateObj = new Date(utcMs);
  const ayanamsa = ayanamsaForDate(jd);
  const eps = meanObliquity(jd);

  // --- Sidereal time & Ascendant ---
  let ascTropical = null, mcTropical = null, ramcDeg = null;
  let ascSidereal = null, mcSidereal = null, ascSignIndex = null;
  if (locationResolved) {
    const gastHours = Astronomy.SiderealTime(dateObj); // Greenwich apparent sidereal time (hours)
    const lstHours = gastHours + lon / 15.0;
    ramcDeg = norm360(lstHours * 15.0);
    ascTropical = ascendantTropical(ramcDeg, lat, eps);
    mcTropical = midheavenTropical(ramcDeg, eps);
    ascSidereal = norm360(ascTropical - ayanamsa);
    mcSidereal = norm360(mcTropical - ayanamsa);
    ascSignIndex = signOf(ascSidereal);
  }

  // --- Planets ---
  const planets = PLANETS.map(p => {
    let tropical;
    try {
      const vec = Astronomy.GeoVector(p.body, dateObj, true);
      const ec = Astronomy.Ecliptic(vec);
      tropical = norm360(ec.elon);
    } catch (e) {
      tropical = null;
    }
    if (tropical == null) return null;
    const sidereal = norm360(tropical - ayanamsa);
    const sIdx = signOf(sidereal);
    return {
      key: p.key,
      name: p.name,
      glyph: p.glyph,
      tropical: Number(tropical.toFixed(4)),
      sidereal: Number(sidereal.toFixed(4)),
      sign: SIGNS[sIdx],
      signGlyph: SIGN_GLYPHS[sIdx],
      degreeInSign: Number(degInSign(sidereal).toFixed(2)),
      house: ascSignIndex != null ? ((sIdx - ascSignIndex + 12) % 12) + 1 : null
    };
  }).filter(Boolean);

  // --- Houses (Whole Sign) ---
  let houses = null;
  if (ascSignIndex != null) {
    houses = [];
    for (let i = 0; i < 12; i++) {
      const houseNum = i + 1;
      const signIndex = (ascSignIndex + i) % 12;
      const inHouse = planets.filter(pl => pl.house === houseNum).map(pl => ({
        key: pl.key, name: pl.name, glyph: pl.glyph,
        degreeInSign: pl.degreeInSign, sign: pl.sign
      }));
      houses.push({
        house: houseNum,
        sign: SIGNS[signIndex],
        signGlyph: SIGN_GLYPHS[signIndex],
        meaning: HOUSE_MEANINGS[houseNum],
        planets: inHouse
      });
    }
  }

  // --- Confidence ---
  const ascendantConfident = locationResolved && exactTime && tzName != null;

  if (locationResolved && !exactTime && parsed) {
    notes.push('Birth time is approximate (time period only) — Ascendant and house placements are approximate.');
  }
  if (locationResolved && tzName == null) {
    notes.push('No timezone name resolved — used longitude-based offset; Ascendant may be approximate.');
  }

  const ascendantOut = ascSidereal != null ? {
    tropical: Number(ascTropical.toFixed(4)),
    sidereal: Number(ascSidereal.toFixed(4)),
    sign: SIGNS[ascSignIndex],
    signGlyph: SIGN_GLYPHS[ascSignIndex],
    degreeInSign: Number(degInSign(ascSidereal).toFixed(2))
  } : null;
  const midheavenOut = mcSidereal != null ? {
    tropical: Number(mcTropical.toFixed(4)),
    sidereal: Number(mcSidereal.toFixed(4)),
    sign: SIGNS[signOf(mcSidereal)],
    signGlyph: SIGN_GLYPHS[signOf(mcSidereal)],
    degreeInSign: Number(degInSign(mcSidereal).toFixed(2))
  } : null;

  return {
    chart_standard: 'sidereal-whole-sign-lahiri',
    ayanamsa: Number(ayanamsa.toFixed(4)),
    ayanamsa_method: 'Lahiri (linear precession model, J2000 base)',
    ephemeris: 'astronomy-engine VSOP87 (geocentric, true equinox of date)',
    julian_day: Number(jd.toFixed(5)),
    utc_instant: new Date(utcMs).toISOString(),
    input: {
      birthDate: dateStr,
      birthTime: input.birthTime || null,
      birthPeriod: input.birthPeriod || null,
      birthPlace: placeDisplay,
      latitude: lat != null ? Number(lat.toFixed(5)) : null,
      longitude: lon != null ? Number(lon.toFixed(5)) : null,
      timezone: tzName
    },
    ascendant: ascendantOut,
    midheaven: midheavenOut,
    planets,
    houses,
    confidence: {
      time_exact: exactTime,
      location_resolved: locationResolved,
      tz_source: tzSource,
      ascendant_confident: ascendantConfident,
      notes
    },
    calculated_at: new Date().toISOString()
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    if (!body.birthDate) {
      return Response.json({ error: 'birthDate is required (YYYY-MM-DD)' }, { status: 400 });
    }

    const chart = await calculateChart(body);
    return Response.json({ success: true, data: chart });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}