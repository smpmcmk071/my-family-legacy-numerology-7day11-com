import React from 'react';

const ELEMENT_FILL = {
  Fire: 'rgba(239,68,68,0.16)',
  Earth: 'rgba(34,197,94,0.16)',
  Air: 'rgba(34,211,238,0.16)',
  Water: 'rgba(59,130,246,0.16)'
};
const ELEMENT_STROKE = {
  Fire: '#f87171', Earth: '#4ade80', Air: '#22d3ee', Water: '#60a5fa'
};

function elementOf(sign) {
  const fire = ['Aries', 'Leo', 'Sagittarius'];
  const earth = ['Taurus', 'Virgo', 'Capricorn'];
  const air = ['Gemini', 'Libra', 'Aquarius'];
  const water = ['Cancer', 'Scorpio', 'Pisces'];
  if (fire.includes(sign)) return 'Fire';
  if (earth.includes(sign)) return 'Earth';
  if (air.includes(sign)) return 'Air';
  if (water.includes(sign)) return 'Water';
  return null;
}

function norm360(n) { n = n % 360; return n < 0 ? n + 360 : n; }

function polar(cx, cy, r, deg) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

// Wedge from startAngle to endAngle (math degrees). Draws the shorter arc in the
// forward (decreasing-angle) direction, matching counter-clockwise house order.
function wedgePath(cx, cy, rInner, rOuter, startAngle, endAngle) {
  const o1 = polar(cx, cy, rOuter, startAngle);
  const o2 = polar(cx, cy, rOuter, endAngle);
  const i2 = polar(cx, cy, rInner, endAngle);
  const i1 = polar(cx, cy, rInner, startAngle);
  const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z'
  ].join(' ');
}

// Whole Sign cusp fallback for charts stored before cusps were computed.
function cuspLongitudeFor(h, idx, ascSid) {
  if (h.cuspLongitude != null) return h.cuspLongitude;
  const ascSign = Math.floor(ascSid / 30);
  return norm360((ascSign + idx) * 30);
}

export default function ChartWheel({ houses, planets, ascendant, systemLabel }) {
  const hs = houses || [];
  if (hs.length === 0) return null;
  const ascSid = ascendant?.sidereal;
  if (ascSid == null) return null;

  // Build cusp longitudes (in zodiacal order, house 1 = ASC).
  const cusps = hs.map((h, i) => cuspLongitudeFor(h, i, ascSid));
  // Offset of each cusp from ASC, kept contiguous (end may exceed 360).
  const offsets = cusps.map(c => norm360(c - ascSid));

  const V = 400;
  const cx = V / 2, cy = V / 2;
  const rOuter = 190;
  const rInner = 78;
  const rHouseNum = 172;
  const rSignGlyph = 148;
  const rPlanets = 104;

  // Planet positions with anti-overlap radius bump for close clusters.
  const planetPts = [];
  (planets || []).forEach(p => {
    if (p.sidereal == null) return;
    const off = norm360(p.sidereal - ascSid);
    const ang = 180 - off;
    let bump = 0;
    planetPts.forEach(q => { if (Math.abs(q.off - off) < 9) bump++; });
    const r = rPlanets + bump * 12;
    planetPts.push({ p, off, ang, r });
  });

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${V} ${V}`} className="w-full max-w-[420px] h-auto">
        {hs.map((h, i) => {
          let startOff = offsets[i];
          let endOff = offsets[(i + 1) % 12];
          if (endOff <= startOff) endOff += 360; // contiguous arc
          const startAng = 180 - startOff;
          const endAng = 180 - endOff;
          const midAng = 180 - (startOff + endOff) / 2;
          const el = elementOf(h.sign);
          const fill = el ? ELEMENT_FILL[el] : 'rgba(255,255,255,0.05)';
          const stroke = el ? ELEMENT_STROKE[el] : 'rgba(255,255,255,0.25)';
          const numPt = polar(cx, cy, rHouseNum, midAng);
          const glyphPt = polar(cx, cy, rSignGlyph, midAng);
          return (
            <g key={h.house}>
              <path d={wedgePath(cx, cy, rInner, rOuter, startAng, endAng)}
                fill={fill} stroke={stroke} strokeWidth="1" />
              {/* cusp line at the start of this house */}
              <line
                x1={polar(cx, cy, rInner, startAng).x} y1={polar(cx, cy, rInner, startAng).y}
                x2={polar(cx, cy, rOuter, startAng).x} y2={polar(cx, cy, rOuter, startAng).y}
                stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <circle cx={numPt.x} cy={numPt.y} r="9" fill="rgba(0,0,0,0.35)" />
              <text x={numPt.x} y={numPt.y} textAnchor="middle" dominantBaseline="central"
                fontSize="11" fill="#fbbf24" fontWeight="700">{h.house}</text>
              <text x={glyphPt.x} y={glyphPt.y} textAnchor="middle" dominantBaseline="central"
                fontSize="17" fill="#ffffff">{h.signGlyph}</text>
            </g>
          );
        })}

        {/* outer + inner rings */}
        <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={rInner} fill="rgba(2,6,23,0.6)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

        {/* Planets placed at their true sidereal longitude */}
        {planetPts.map(({ p, ang, r }) => {
          const pt = polar(cx, cy, r, ang);
          return (
            <text key={p.key} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central"
              fontSize="14" fill="#fde68a"
              title={`${p.name} · ${p.sign} ${p.degreeInSign?.toFixed(1)}° · House ${p.house}`}>
              {p.glyph}
            </text>
          );
        })}

        {/* ASC marker on the left (house 1 cusp) */}
        <g>
          <line x1={cx - rOuter} y1={cy} x2={cx - rInner} y2={cy} stroke="#fbbf24" strokeWidth="2.5" />
          <text x={cx - rOuter + 4} y={cy - 6} fontSize="9" fill="#fbbf24" fontWeight="700">ASC</text>
        </g>

        {/* Center: ascendant + Sun/Moon glyphs */}
        <text x={cx} y={cy - 26} textAnchor="middle" fontSize="9" fill="#9ca3af">Ascendant</text>
        {ascendant?.signGlyph ? (
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26" fill="#fbbf24">{ascendant.signGlyph}</text>
        ) : null}
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#e5e7eb" fontWeight="600">{ascendant?.sign || '—'}</text>
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize="7.5" fill="#9ca3af">
          {(planets || []).filter(p => p.key === 'Sun' || p.key === 'Moon').map(p => p.signGlyph).join(' · ') || '—'}
        </text>
        <text x={cx} y={cy + 40} textAnchor="middle" fontSize="6.5" fill="#6b7280">Sun · Moon</text>
      </svg>

      {/* Element legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs">
        {['Fire', 'Earth', 'Air', 'Water'].map(el => (
          <span key={el} className="flex items-center gap-1.5 text-gray-300">
            <span className="w-3 h-3 rounded-sm border" style={{ background: ELEMENT_FILL[el], borderColor: ELEMENT_STROKE[el] }} />
            {el}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 mt-2 text-center max-w-md">
        House 1 begins at the Ascendant (ASC) on the left; houses proceed counter-clockwise.
        {systemLabel === 'placidus'
          ? ' Placidus cusps make the wedges unequal; each planet sits at its exact sidereal longitude.'
          : ' Whole Sign houses are equal 30°; each planet sits at its exact sidereal longitude within its sign.'}
      </p>
    </div>
  );
}