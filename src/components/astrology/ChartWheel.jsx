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

function polar(cx, cy, r, deg) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

// Wedge from startAngle to endAngle (math degrees, decreasing = counter-clockwise on screen).
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

export default function ChartWheel({ chart, member }) {
  const houses = chart?.houses;
  if (!houses || houses.length === 0) return null;

  // Build house -> planets map from the canonical planet list (each planet has .house).
  const byHouse = {};
  (chart.planets || []).forEach(p => {
    if (p.house == null) return;
    (byHouse[p.house] = byHouse[p.house] || []).push(p);
  });

  const V = 400;
  const cx = V / 2, cy = V / 2;
  const rOuter = 190;
  const rInner = 78;
  const rHouseNum = 174;
  const rSignGlyph = 150;
  const rSignName = 126;
  const rPlanets = 100;

  const asc = chart.ascendant;

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${V} ${V}`} className="w-full max-w-[420px] h-auto">
        {/* Wedges */}
        {houses.map(h => {
          const startAngle = 180 - (h.house - 1) * 30;
          const endAngle = startAngle - 30;
          const el = elementOf(h.sign);
          const fill = el ? ELEMENT_FILL[el] : 'rgba(255,255,255,0.05)';
          const stroke = el ? ELEMENT_STROKE[el] : 'rgba(255,255,255,0.25)';
          const mid = (startAngle + endAngle) / 2;
          const numPt = polar(cx, cy, rHouseNum, mid);
          const glyphPt = polar(cx, cy, rSignGlyph, mid);
          const namePt = polar(cx, cy, rSignName, mid);
          const planetPt = polar(cx, cy, rPlanets, mid);
          const planets = byHouse[h.house] || [];
          return (
            <g key={h.house}>
              <path d={wedgePath(cx, cy, rInner, rOuter, startAngle, endAngle)}
                fill={fill} stroke={stroke} strokeWidth="1" />
              {/* cusp line */}
              <line x1={polar(cx, cy, rInner, startAngle).x} y1={polar(cx, cy, rInner, startAngle).y}
                x2={polar(cx, cy, rOuter, startAngle).x} y2={polar(cx, cy, rOuter, startAngle).y}
                stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              {/* house number */}
              <circle cx={numPt.x} cy={numPt.y} r="9" fill="rgba(0,0,0,0.35)" />
              <text x={numPt.x} y={numPt.y} textAnchor="middle" dominantBaseline="central"
                fontSize="11" fill="#fbbf24" fontWeight="700">{h.house}</text>
              {/* sign glyph */}
              <text x={glyphPt.x} y={glyphPt.y} textAnchor="middle" dominantBaseline="central"
                fontSize="18" fill="#ffffff">{h.signGlyph}</text>
              {/* sign name */}
              <text x={namePt.x} y={namePt.y} textAnchor="middle" dominantBaseline="central"
                fontSize="8" fill="#e5e7eb" fontWeight="600">{h.sign}</text>
              {/* planets in this house */}
              {planets.map((p, idx) => (
                <text key={p.key} x={planetPt.x} y={planetPt.y + idx * 14 - ((planets.length - 1) * 7)}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize="14" fill="#fde68a" title={`${p.name} ${p.sign} ${p.degreeInSign?.toFixed(0)}°`}>
                  {p.glyph}
                </text>
              ))}
            </g>
          );
        })}

        {/* outer ring */}
        <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        {/* inner ring */}
        <circle cx={cx} cy={cy} r={rInner} fill="rgba(2,6,23,0.6)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

        {/* ASC marker on the left cusp (house 1 start) */}
        <g>
          <line x1={cx - rOuter} y1={cy} x2={cx - rInner} y2={cy}
            stroke="#fbbf24" strokeWidth="2.5" />
          <text x={cx - rOuter + 4} y={cy - 6} fontSize="9" fill="#fbbf24" fontWeight="700">ASC</text>
        </g>

        {/* Center: ascendant + big three */}
        <text x={cx} y={cy - 26} textAnchor="middle" fontSize="9" fill="#9ca3af">Ascendant</text>
        {asc?.signGlyph ? (
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26" fill="#fbbf24">{asc.signGlyph}</text>
        ) : null}
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#e5e7eb" fontWeight="600">{asc?.sign || '—'}</text>
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize="7.5" fill="#9ca3af">
          {[chart.planets?.find(p => p.key === 'Sun')?.signGlyph,
            chart.planets?.find(p => p.key === 'Moon')?.signGlyph]
            .filter(Boolean).join(' · ') || '—'}
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
        House 1 begins at the Ascendant (ASC) on the left; houses proceed counter-clockwise. Each wedge shows its sign glyph and any planets placed in that house.
      </p>
    </div>
  );
}