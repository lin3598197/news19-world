// art.mjs — every drawing authored in a 160 x 96 viewBox.
// Flat vector only: no gradients (a flat sky fill is the one exception), no photos,
// no text below ~5 units, nothing outside 0..160 x 0..96.

const INK = '#14161a';
const CREAM = '#fdfaf2';
const RED = '#c8352f';
const GOLD = '#e8c56a';

const SKY_DAY = '#cfe2ee';
const STONE = '#ded7c6';
const STONE_D = '#b6ad9b';
const LAWN = '#7e9a64';
const SEA = '#35617a';
const NIGHT = '#101a2e';
const NIGHT_2 = '#1a2740';
const TOWER = '#2b3a55';
const LIT = '#f2d78c';
const STEEL_D = '#3b4046';

// ---------- 1. summit ----------
function summit() {
  return `
  <rect width="160" height="96" fill="#e7ebe9"/>
  <rect x="0" y="0" width="160" height="52" fill="#dfe4e2"/>
  <!-- back wall panelling, two tall panels -->
  <rect x="30" y="0" width="100" height="52" fill="#cfd6d3"/>
  <rect x="36" y="6" width="88" height="46" fill="#dce2df"/>
  <!-- left flag: solid red -->
  <rect x="14" y="16" width="2.4" height="50" fill="${INK}"/>
  <rect x="16.4" y="17" width="17" height="11" fill="${RED}"/>
  <rect x="16.4" y="17" width="17" height="1.4" fill="#8f231f"/>
  <!-- right flag: striped -->
  <rect x="143" y="16" width="2.4" height="50" fill="${INK}"/>
  ${[0, 1, 2, 3, 4, 5].map(i =>
    `<rect x="128" y="${17 + i * 1.83}" width="17" height="1.83" fill="${i % 2 ? CREAM : INK}"/>`
  ).join('')}
  <rect x="128" y="17" width="17" height="11" fill="none" stroke="${INK}" stroke-width="0.7"/>
  <!-- clock above the three, face reads 70 -->
  <circle cx="80" cy="13" r="8.4" fill="${CREAM}" stroke="${INK}" stroke-width="1.2"/>
  <text x="80" y="16.6" font-family="Georgia,serif" font-size="8.8" font-weight="700"
        text-anchor="middle" fill="${INK}">70</text>
  <rect x="78.6" y="2" width="2.8" height="3" fill="${INK}"/>
  <!-- three seated figures in suits -->
  ${[
    { x: 58, shirt: CREAM, tie: RED },
    { x: 80, shirt: CREAM, tie: INK },
    { x: 102, shirt: CREAM, tie: RED }
  ].map(f => `
    <path d="M${f.x - 11} 66 L${f.x - 9} 51 Q${f.x} 46 ${f.x + 9} 51 L${f.x + 11} 66 Z" fill="#242b34"/>
    <path d="M${f.x - 2.6} 49 L${f.x} 62 L${f.x + 2.6} 49 Z" fill="${f.shirt}"/>
    <path d="M${f.x - 1.3} 51 L${f.x} 61 L${f.x + 1.3} 51 Z" fill="${f.tie}"/>
    <circle cx="${f.x}" cy="42" r="6.1" fill="#1d2430"/>
    <circle cx="${f.x}" cy="42" r="6.1" fill="none" stroke="#0f141c" stroke-width="0.8"/>
  `).join('')}
  <!-- long table, side on -->
  <rect x="10" y="63" width="140" height="4" fill="#4a3a2a"/>
  <rect x="10" y="63" width="140" height="1.3" fill="#6b563d"/>
  <rect x="14" y="67" width="132" height="13" fill="#3b2f23"/>
  <rect x="18" y="70" width="124" height="0.9" fill="#5b4832"/>
  <rect x="20" y="80" width="4" height="6" fill="#2e251b"/>
  <rect x="136" y="80" width="4" height="6" fill="#2e251b"/>
  <!-- papers and two carafes on the table top -->
  <rect x="44" y="60.4" width="12" height="2.6" fill="${CREAM}"/>
  <rect x="86" y="60.4" width="12" height="2.6" fill="${CREAM}"/>
  <rect x="116" y="56" width="4.4" height="7" rx="1" fill="#8fa8b8"/>
  <rect x="117.4" y="53.6" width="1.6" height="3" fill="#8fa8b8"/>`;
}

// ---------- 2. icj ----------
function icj() {
  return `
  <rect width="160" height="96" fill="${SKY_DAY}"/>
  <path d="M0 60 Q26 52 52 58 Q78 64 104 57 Q130 50 160 58 L160 96 L0 96 Z" fill="${LAWN}"/>
  <rect x="0" y="86" width="160" height="10" fill="#6d8a55"/>
  <!-- courthouse: pediment, architrave, six columns, steps -->
  <path d="M34 45 L80 27 L126 45 Z" fill="${STONE}" stroke="${INK}" stroke-width="1.1"/>
  <path d="M40 44 L80 30 L120 44 Z" fill="#efe9da"/>
  <rect x="38" y="45" width="84" height="4.6" fill="${STONE_D}" stroke="${INK}" stroke-width="0.9"/>
  ${[0, 1, 2, 3, 4, 5].map(i => {
    const x = 44 + i * 13.4;
    return `<rect x="${x}" y="50" width="5.6" height="24" fill="${CREAM}" stroke="${INK}" stroke-width="0.8"/>
            <rect x="${x - 1.2}" y="49" width="8" height="2.2" fill="${STONE_D}"/>
            <rect x="${x - 1.2}" y="73.4" width="8" height="2.4" fill="${STONE_D}"/>`;
  }).join('')}
  <rect x="40" y="76" width="80" height="3.4" fill="${STONE_D}" stroke="${INK}" stroke-width="0.7"/>
  <rect x="36" y="79.4" width="88" height="3.4" fill="${STONE}" stroke="${INK}" stroke-width="0.7"/>
  <rect x="32" y="82.8" width="96" height="3.6" fill="${STONE_D}" stroke="${INK}" stroke-width="0.7"/>
  <!-- scales on the lawn, standing in front -->
  <rect x="124" y="90" width="18" height="4" fill="${STONE_D}" stroke="${INK}" stroke-width="0.8"/>
  <rect x="131.6" y="52" width="3" height="38" fill="${INK}"/>
  <circle cx="133.1" cy="50" r="2.6" fill="${GOLD}" stroke="${INK}" stroke-width="0.7"/>
  <rect x="115" y="53.4" width="36.4" height="2.2" fill="${INK}"/>
  <path d="M115 55 L111 68 M151 55 L155 68" stroke="${INK}" stroke-width="0.9" fill="none"/>
  <path d="M107 68 Q115 76 123 68 Z" fill="${GOLD}" stroke="${INK}" stroke-width="0.9"/>
  <path d="M143 68 Q151 76 159 68 Z" fill="${GOLD}" stroke="${INK}" stroke-width="0.9"/>
  <circle cx="133.1" cy="66" r="2.2" fill="${GOLD}" stroke="${INK}" stroke-width="0.6"/>
  <!-- two small trees to balance the mass -->
  <rect x="24" y="70" width="2" height="18" fill="#4a3a24"/>
  <circle cx="25" cy="66" r="8" fill="#476c3a"/>
  <circle cx="19" cy="70" r="5.4" fill="#3d6132"/>`;
}

// ---------- 3. riyadh ----------
function riyadh() {
  // shards fall from the blown-out floors, so they hang below the black gap
  const shards = [
    [86, 26, 4.2], [97, 30, 3.4], [80, 34, 3.6], [101, 41, 2.8],
    [90, 38, 4], [75, 28, 2.6], [104, 33, 2.4], [93, 47, 3]
  ].map(([x, y, s]) =>
    `<path d="M${x} ${y} l${s} ${s * 1.6} l${-s * 1.3} ${s * 0.3} Z" fill="#cfe0ee" opacity="0.92"/>`
  ).join('');
  return `
  <rect width="160" height="96" fill="${NIGHT}"/>
  <rect x="0" y="0" width="160" height="34" fill="${NIGHT_2}"/>
  <!-- scattered stars -->
  <circle cx="24" cy="12" r="0.7" fill="#c9d6e4"/><circle cx="52" cy="7" r="0.6" fill="#c9d6e4"/>
  <circle cx="126" cy="10" r="0.7" fill="#c9d6e4"/><circle cx="146" cy="20" r="0.6" fill="#c9d6e4"/>
  <!-- distant skyline -->
  <rect x="0" y="66" width="18" height="30" fill="#16223a"/>
  <rect x="18" y="58" width="14" height="38" fill="#1b2a45"/>
  <rect x="32" y="70" width="16" height="26" fill="#16223a"/>
  <rect x="110" y="62" width="15" height="34" fill="#1b2a45"/>
  <rect x="125" y="72" width="13" height="24" fill="#16223a"/>
  <rect x="138" y="60" width="22" height="36" fill="#1b2a45"/>
  <!-- the tower: lit window grid, top rows blown out -->
  <rect x="64" y="6" width="32" height="90" fill="${TOWER}"/>
  <rect x="64" y="6" width="32" height="90" fill="none" stroke="#0a101c" stroke-width="1"/>
  ${Array.from({ length: 12 }, (_, r) => Array.from({ length: 5 }, (_, c) =>
    `<rect x="${67.4 + c * 5.6}" y="${21 + r * 5.2}" width="3.6" height="3.2"
           fill="${(r * 7 + c * 3) % 5 === 0 ? '#7d6740' : LIT}"/>`
  ).join('')).join('')}
  <!-- blown out floors at the top -->
  <path d="M64 6 L96 6 L96 20 L91 22 L87 19 L82 23 L77 18 L72 22 L68 19 L64 21 Z" fill="#05080e"/>
  <path d="M64 6 L96 6 L96 20 L91 22 L87 19 L82 23 L77 18 L72 22 L68 19 L64 21 Z"
        fill="none" stroke="#3a4a66" stroke-width="0.7"/>
  ${shards}
  <!-- contrail coming in from the upper left -->
  <path d="M0 3 L60 21" stroke="#e6eef6" stroke-width="1.5" opacity="0.55" fill="none"/>
  <path d="M0 5.4 L57 23" stroke="#e6eef6" stroke-width="0.7" opacity="0.35" fill="none"/>
  <circle cx="62" cy="23" r="1.5" fill="#fff4d8"/>`;
}

// ---------- 4. kerch ----------
function kerch() {
  return `
  <rect width="160" height="96" fill="#8fa3b3"/>
  <rect x="0" y="0" width="160" height="26" fill="#7d93a5"/>
  <!-- water -->
  <rect x="0" y="62" width="160" height="34" fill="${SEA}"/>
  <path d="M0 70 h22 M30 74 h20 M96 71 h24 M126 78 h22 M12 84 h26 M72 88 h30 M132 88 h20"
        stroke="#5b869b" stroke-width="1.4" opacity="0.8"/>
  <!-- land at each end -->
  <path d="M0 60 L24 56 L30 62 L30 96 L0 96 Z" fill="#4e5a48"/>
  <path d="M160 58 L138 54 L132 62 L132 96 L160 96 Z" fill="#4e5a48"/>
  <!-- deck: two spans with a broken gap in the middle -->
  <rect x="0" y="41" width="64" height="6" fill="${STEEL_D}"/>
  <rect x="0" y="41" width="64" height="1.6" fill="#5b6169"/>
  <rect x="96" y="41" width="64" height="6" fill="${STEEL_D}"/>
  <rect x="96" y="41" width="64" height="1.6" fill="#5b6169"/>
  <path d="M64 41 L58 44 L64 47" fill="none" stroke="#20242a" stroke-width="1.6"/>
  <path d="M96 41 L102 44 L96 47" fill="none" stroke="#20242a" stroke-width="1.6"/>
  <!-- parapet rail -->
  <path d="M0 37 H62 M98 37 H160" stroke="#20242a" stroke-width="1.1"/>
  ${[6, 18, 30, 42, 54].map(x => `<rect x="${x}" y="37" width="0.9" height="4" fill="#20242a"/>`).join('')}
  ${[104, 116, 128, 140, 152].map(x => `<rect x="${x}" y="37" width="0.9" height="4" fill="#20242a"/>`).join('')}
  <!-- piers into the water -->
  ${[10, 34, 120, 144].map(x =>
    `<rect x="${x}" y="47" width="5" height="27" fill="#2f343a"/>
     <rect x="${x - 2}" y="46" width="9" height="2.4" fill="#454b52"/>`
  ).join('')}
  <!-- the slab that fell: tilted, half in the water -->
  <g transform="rotate(-24 78 74)">
    <rect x="62" y="70" width="34" height="5" fill="${STEEL_D}" stroke="#20242a" stroke-width="0.7"/>
    <rect x="62" y="70" width="34" height="1.4" fill="#5b6169"/>
  </g>
  <!-- flame plume and smoke rising from the gap -->
  <path d="M76 42 Q70 30 76 20 Q80 27 82 20 Q86 30 84 42 Z" fill="#e2781c"/>
  <path d="M78 42 Q75 33 79 26 Q82 31 83 26 Q85 34 83 42 Z" fill="#f6c14a"/>
  <circle cx="80" cy="18" r="3.4" fill="#f6e2a8"/>
  <circle cx="70" cy="12" r="6.4" fill="#5f6773" opacity="0.85"/>
  <circle cx="84" cy="8" r="7.4" fill="#4d5561" opacity="0.9"/>
  <circle cx="60" cy="5" r="5.4" fill="#5f6773" opacity="0.75"/>
  <circle cx="98" cy="6" r="6" fill="#4d5561" opacity="0.8"/>`;
}

// ---------- 5. ipo ----------
function ipo() {
  return `
  <rect width="160" height="96" fill="#e9e4d6"/>
  <rect x="6" y="6" width="148" height="84" rx="3" fill="#f7f4ea" stroke="${INK}" stroke-width="1"/>
  <rect x="6" y="6" width="148" height="17" rx="3" fill="${INK}"/>
  <rect x="6" y="19" width="148" height="4" fill="${INK}"/>
  <text x="14" y="18" font-family="Helvetica,Arial,sans-serif" font-size="8.4"
        font-weight="700" letter-spacing="0.4" fill="${CREAM}">ANTHROPIC</text>
  <text x="146" y="18.4" font-family="Helvetica,Arial,sans-serif" font-size="9.4"
        font-weight="700" text-anchor="end" fill="${GOLD}">+17%</text>
  <!-- chart body -->
  <rect x="14" y="27" width="132" height="55" fill="#fbf9f1" stroke="#d9d3c2" stroke-width="0.8"/>
  ${[0, 1, 2, 3].map(i =>
    `<path d="M14 ${38 + i * 13} H146" stroke="#ddd7c6" stroke-width="0.7"/>`
  ).join('')}
  ${[0, 1, 2, 3, 4].map(i =>
    `<path d="M${14 + i * 33} 27 V82" stroke="#e4dfd0" stroke-width="0.7"/>`
  ).join('')}
  <!-- stepped line, lower left to upper right -->
  <path d="M18 78 H32 V70 H46 V62 H62 V54 H78 V46 H94 V38 H110 V30 H126"
        fill="none" stroke="${RED}" stroke-width="2.6" stroke-linejoin="miter"/>
  <path d="M126 30 H140" stroke="${RED}" stroke-width="2.6"/>
  <circle cx="140" cy="30" r="2.6" fill="${RED}"/>
  <!-- tooltip -->
  <rect x="104" y="36" width="26" height="13" rx="1.6" fill="${INK}"/>
  <path d="M113 49 l3 4 l3 -4 Z" fill="${INK}"/>
  <text x="117" y="46" font-family="Helvetica,Arial,sans-serif" font-size="8.2"
        font-weight="700" text-anchor="middle" fill="${CREAM}">$83</text>
  <!-- baseline + axis ticks -->
  <path d="M14 82 H146" stroke="${INK}" stroke-width="1"/>
  ${[0, 1, 2, 3, 4, 5].map(i =>
    `<path d="M${18 + i * 24} 82 V84.6" stroke="${INK}" stroke-width="0.8"/>`
  ).join('')}`;
}

// ---------- 6. cop ----------
function cop() {
  const bars = [
    [24, 40, 78], [24, 45, 88], [24, 50, 70],
    [24, 58, 86], [24, 63, 74], [24, 68, 62]
  ];
  return `
  <rect width="160" height="96" fill="#d9cfba"/>
  <rect x="4" y="4" width="152" height="88" fill="#c9bfa8"/>
  <!-- sheet of paper -->
  <rect x="16" y="7" width="106" height="82" fill="#fffdf6" stroke="#b9b0a0" stroke-width="0.9"/>
  <rect x="16" y="7" width="106" height="4" fill="#efeade"/>
  <text x="24" y="24" font-family="Helvetica,Arial,sans-serif" font-size="9.4"
        font-weight="700" letter-spacing="0.4" fill="${INK}">COP31 DRAFT</text>
  <rect x="24" y="28" width="60" height="1.4" fill="${RED}"/>
  ${bars.map(([x, y, w], i) => i === 3
    ? `<rect x="${x}" y="${y}" width="${w}" height="3.2" fill="#cfc8b6"/>
       <path d="M${x - 2} ${y + 1.6} H${x + w + 2}" stroke="${RED}" stroke-width="1.9"/>
       <path d="M${x - 2} ${y + 1.6} H${x + w + 2}" stroke="#fffdf6" stroke-width="0.5"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="3.2" fill="#cfc8b6"/>`
  ).join('')}
  <!-- pen lying across the sheet -->
  <g transform="rotate(-14 96 78)">
    <rect x="60" y="74" width="62" height="5" rx="2.5" fill="#233247"/>
    <rect x="60" y="74" width="62" height="1.6" rx="0.8" fill="#3c5169"/>
    <path d="M122 74 l7 2.5 l-7 2.5 Z" fill="${GOLD}"/>
    <rect x="66" y="76.6" width="12" height="2" fill="${GOLD}"/>
  </g>
  <!-- three stamped X discs at the corner -->
  ${[[100, 60], [112, 66], [103, 72]].map(([cx, cy]) => `
    <circle cx="${cx}" cy="${cy}" r="6.4" fill="none" stroke="${RED}" stroke-width="1.7"/>
    <path d="M${cx - 3.3} ${cy - 3.3} L${cx + 3.3} ${cy + 3.3}
             M${cx + 3.3} ${cy - 3.3} L${cx - 3.3} ${cy + 3.3}"
          stroke="${RED}" stroke-width="1.7"/>`
  ).join('')}
  <rect x="16" y="86" width="106" height="1.6" fill="#e2dccb"/>`;
}

// ---------- 7. haiti ----------
function haiti() {
  return `
  <rect width="160" height="96" fill="#d98a4e"/>
  <rect x="0" y="0" width="160" height="22" fill="#c4703c"/>
  <circle cx="126" cy="24" r="9" fill="#f2b566" opacity="0.85"/>
  <!-- dust road -->
  <rect x="0" y="62" width="160" height="34" fill="#b09475"/>
  <rect x="0" y="58" width="160" height="6" fill="#a1825f"/>
  <path d="M0 74 h18 M42 80 h22 M110 76 h30 M24 88 h26 M120 90 h28"
        stroke="#8f7452" stroke-width="1.4" opacity="0.7"/>
  <!-- two low buildings with dark windows -->
  <rect x="6" y="34" width="40" height="26" fill="#7d6a58"/>
  <rect x="6" y="32" width="40" height="3" fill="#5c4d40"/>
  <rect x="12" y="39" width="7" height="7" fill="#2b2620"/>
  <rect x="25" y="39" width="7" height="7" fill="#2b2620"/>
  <rect x="36" y="39" width="6" height="7" fill="#2b2620"/>
  <rect x="12" y="51" width="28" height="4" fill="#3a332b"/>
  <rect x="112" y="40" width="42" height="20" fill="#8a7460"/>
  <rect x="112" y="38" width="42" height="2.6" fill="#5c4d40"/>
  <rect x="118" y="44" width="8" height="6" fill="#2b2620"/>
  <rect x="132" y="44" width="8" height="6" fill="#2b2620"/>
  <rect x="145" y="44" width="6" height="6" fill="#2b2620"/>
  <!-- armoured vehicle, two wheels, slit windows -->
  <rect x="40" y="60" width="58" height="17" rx="1.6" fill="#3f4a3d"/>
  <rect x="40" y="60" width="58" height="3.4" fill="#55634f"/>
  <rect x="46" y="66" width="9" height="2.6" fill="#171c18"/>
  <rect x="59" y="66" width="9" height="2.6" fill="#171c18"/>
  <rect x="72" y="66" width="9" height="2.6" fill="#171c18"/>
  <rect x="86" y="57" width="9" height="5" fill="#2c352b"/>
  <rect x="90" y="52" width="2" height="6" fill="#2c352b"/>
  <circle cx="52" cy="78" r="7" fill="#1b1f1a"/>
  <circle cx="52" cy="78" r="3.2" fill="#4a5548"/>
  <circle cx="88" cy="78" r="7" fill="#1b1f1a"/>
  <circle cx="88" cy="78" r="3.2" fill="#4a5548"/>
  <!-- two standing figures beside it -->
  ${[[104, '#2b3038'], [116, '#3a3038']].map(([x, c]) => `
    <circle cx="${x}" cy="52" r="3.6" fill="#241d17"/>
    <path d="M${x - 3.4} 57 h6.8 l1.4 12 h-9.6 Z" fill="${c}"/>
    <path d="M${x - 2.4} 69 l-1.2 10 M${x + 2.4} 69 l1.2 10" stroke="#241d17" stroke-width="2.6"/>`
  ).join('')}`;
}

// ---------- 8. greenland ----------
function greenland() {
  return `
  <rect width="160" height="96" fill="#16283f"/>
  <rect x="0" y="0" width="160" height="20" fill="#1d3350"/>
  <circle cx="30" cy="14" r="0.9" fill="#cfe3f5"/><circle cx="70" cy="9" r="0.8" fill="#cfe3f5"/>
  <circle cx="120" cy="12" r="0.9" fill="#cfe3f5"/><circle cx="96" cy="6" r="0.7" fill="#cfe3f5"/>
  <!-- ice shelf -->
  <rect x="0" y="66" width="160" height="30" fill="#95b3c8"/>
  <rect x="0" y="62" width="160" height="5" fill="#b9d3e2"/>
  <path d="M0 78 h20 M34 84 h24 M88 80 h22 M124 88 h26" stroke="#7fa0b8" stroke-width="1.4"/>
  <!-- ice mound in two lobes: hard facet ridges, no soft creases -->
  <path d="M40 63 Q46 38 62 36 Q74 35 80 48 Q86 34 102 37 Q118 41 120 63 Z" fill="#eef6fb"/>
  <path d="M62 36 Q74 35 80 48 Q86 34 102 37 Q96 47 88 50 Q76 54 62 36 Z" fill="#d3e6f2"/>
  <path d="M62 36 L66 63 M102 37 L97 63 M80 48 L80 63" stroke="#b0cbdd" stroke-width="1.1" fill="none"/>
  <path d="M40 63 L48 52 L56 63 Z" fill="#c4dcec"/>
  <path d="M104 63 L112 54 L119 63 Z" fill="#c4dcec"/>
  <!-- Danish flag on a pole at the left -->
  <rect x="14" y="20" width="2" height="46" fill="#cfd8e2"/>
  <rect x="16" y="22" width="24" height="17" fill="${RED}"/>
  <rect x="23.4" y="22" width="3.4" height="17" fill="#fbf7ee"/>
  <rect x="16" y="28.6" width="24" height="3.4" fill="#fbf7ee"/>
  <rect x="16" y="22" width="24" height="17" fill="none" stroke="#8f231f" stroke-width="0.7"/>
  <!-- the ratified document: text bars, a signature line, and a pen laid along it -->
  <g transform="rotate(-6 122 44)">
    <rect x="104" y="24" width="44" height="32" fill="#fdfaf2" stroke="#b9b0a0" stroke-width="0.8"/>
    <rect x="109" y="29" width="30" height="2" fill="#b9b3a4"/>
    <rect x="109" y="34" width="24" height="2" fill="#b9b3a4"/>
    <rect x="109" y="39" width="34" height="0.8" fill="#8d8779"/>
    <path d="M109 45 q3 -2.6 6 0 q3 2.6 6 0 q3 -2.6 6 0 q2 1.8 4 0"
          stroke="${INK}" stroke-width="1.1" fill="none"/>
    <!-- pen: thin barrel with a gold nib, resting on the signature -->
    <g transform="rotate(-11 126 47)">
      <rect x="110" y="46" width="28" height="3.6" rx="1.8" fill="#233247"/>
      <rect x="110" y="46" width="28" height="1.1" rx="0.5" fill="#3c5169"/>
      <path d="M138 46 l5 1.8 l-5 1.8 Z" fill="${GOLD}"/>
      <rect x="114" y="47.3" width="8" height="1.2" fill="${GOLD}"/>
    </g>
  </g>`;
}

// ---------- 9. dhaka ----------
function dhaka() {
  return `
  <rect width="160" height="96" fill="#1c1a2b"/>
  <rect x="0" y="0" width="160" height="26" fill="#241f34"/>
  <!-- fire glow behind the house -->
  <path d="M52 52 Q46 36 54 22 Q58 32 62 22 Q66 34 64 52 Z" fill="#d9631e"/>
  <path d="M70 56 Q64 40 72 28 Q76 38 80 28 Q86 40 82 58 Z" fill="#e8822a"/>
  <path d="M94 54 Q88 40 96 26 Q100 36 104 26 Q110 38 106 56 Z" fill="#d9631e"/>
  <path d="M54 50 Q52 40 58 32 Q62 40 60 50 Z" fill="#f4b64a"/>
  <path d="M74 54 Q72 44 78 36 Q82 44 80 56 Z" fill="#f4b64a"/>
  <circle cx="80" cy="20" r="5" fill="#3c3346" opacity="0.9"/>
  <circle cx="66" cy="12" r="6" fill="#332c3e" opacity="0.9"/>
  <!-- low house with arched roofline -->
  <path d="M26 66 L26 48 Q40 38 58 44 Q70 38 84 46 Q96 40 108 48 L108 66 Z" fill="#4a3b46"/>
  <path d="M26 48 Q40 38 58 44 Q70 38 84 46 Q96 40 108 48" fill="none" stroke="#2a222c" stroke-width="1.6"/>
  <rect x="26" y="64" width="82" height="4" fill="#2a222c"/>
  <rect x="34" y="52" width="10" height="12" fill="#f0a63c"/>
  <rect x="50" y="52" width="10" height="12" fill="#2a222c"/>
  <rect x="66" y="52" width="10" height="12" fill="#f0a63c"/>
  <rect x="82" y="52" width="10" height="12" fill="#2a222c"/>
  <rect x="96" y="52" width="6" height="12" fill="#f0a63c"/>
  <!-- roof fire along the ridge -->
  <path d="M30 45 Q36 40 42 45 Q48 40 54 45 Q60 41 64 45 Q70 40 76 45 Q82 41 88 45 Q94 40 100 45" 
        fill="none" stroke="#e8721f" stroke-width="3"/>
  <!-- road and lamps -->
  <rect x="0" y="68" width="160" height="28" fill="#2c2a33"/>
  <rect x="0" y="68" width="160" height="1.6" fill="#464350"/>
  ${[16, 120, 146].map(x => `
    <rect x="${x}" y="52" width="1.6" height="17" fill="#5a5766"/>
    <circle cx="${x + 0.8}" cy="50" r="2.6" fill="#f6d98a"/>`).join('')}
  <!-- bus, lower left -->
  <rect x="8" y="72" width="42" height="15" rx="1.6" fill="#c8352f"/>
  <rect x="11" y="75" width="9" height="5.4" fill="#f0dfc0"/>
  <rect x="22" y="75" width="9" height="5.4" fill="#f0dfc0"/>
  <rect x="33" y="75" width="8" height="5.4" fill="#f0dfc0"/>
  <rect x="8" y="82.4" width="42" height="1.6" fill="#8f231f"/>
  <circle cx="18" cy="88" r="3.4" fill="#15141a"/>
  <circle cx="40" cy="88" r="3.4" fill="#15141a"/>
  <circle cx="51" cy="80" r="2.2" fill="#f6d98a"/>`;
}

// ---------- 10. mongolia ----------
function mongolia() {
  return `
  <rect width="160" height="96" fill="#cfd2cf"/>
  <rect x="0" y="0" width="160" height="30" fill="#dde0dd"/>
  <!-- columned government building -->
  <rect x="36" y="26" width="88" height="6" fill="#e7e6de" stroke="${INK}" stroke-width="0.9"/>
  <rect x="42" y="32" width="76" height="4" fill="#cfcec4"/>
  <rect x="48" y="20" width="64" height="6" fill="#e7e6de" stroke="${INK}" stroke-width="0.8"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(i => {
    const x = 44 + i * 11;
    return `<rect x="${x}" y="36" width="5" height="28" fill="#f3f1e8" stroke="${INK}" stroke-width="0.8"/>
            <rect x="${x - 1}" y="35" width="7" height="2" fill="#cfcec4"/>
            <rect x="${x - 1}" y="63" width="7" height="2.4" fill="#cfcec4"/>`;
  }).join('')}
  <rect x="40" y="65" width="80" height="3.4" fill="#d8d6cc" stroke="${INK}" stroke-width="0.7"/>
  <rect x="36" y="68.4" width="88" height="3.4" fill="#e2e0d6" stroke="${INK}" stroke-width="0.7"/>
  <rect x="32" y="71.8" width="96" height="4" fill="#cfcec4" stroke="${INK}" stroke-width="0.7"/>
  <rect x="28" y="75.8" width="104" height="4.4" fill="#dcdad0" stroke="${INK}" stroke-width="0.7"/>
  <!-- grey ground -->
  <rect x="0" y="80" width="160" height="16" fill="#a9aaa4"/>
  <path d="M0 88 h26 M52 92 h30 M104 86 h24 M132 94 h24" stroke="#8d8e88" stroke-width="1.2"/>
  <!-- flagpole with vertical red-blue-red flag and gold emblem -->
  <rect x="132" y="6" width="2" height="72" fill="#5c5f5a"/>
  <rect x="116" y="10" width="16" height="38" fill="${RED}"/>
  <rect x="119.4" y="10" width="9.2" height="12" fill="#25519b"/>
  <rect x="119.4" y="34" width="9.2" height="14" fill="#25519b"/>
  <circle cx="124" cy="24" r="2.6" fill="${GOLD}"/>
  <path d="M121.6 20 h4.8 M121.6 28 h4.8" stroke="${GOLD}" stroke-width="0.9"/>
  <rect x="116" y="10" width="16" height="38" fill="none" stroke="#8f231f" stroke-width="0.7"/>
  <!-- empty chair in front: seat, tall back, four legs -->
  <g>
    <rect x="22" y="44" width="5" height="24" fill="#4a3a2a"/>
    <rect x="42" y="44" width="5" height="24" fill="#4a3a2a"/>
    <rect x="20" y="42" width="29" height="5" rx="1.4" fill="#5b4832"/>
    <rect x="20" y="42" width="29" height="1.6" fill="#6f5840"/>
    <rect x="20" y="54" width="29" height="4.4" rx="1.2" fill="#6f5840"/>
    <rect x="20" y="58.4" width="29" height="1.6" fill="#4a3a2a"/>
    <rect x="23" y="60" width="3.4" height="10" fill="#3b2f23"/>
    <rect x="43" y="60" width="3.4" height="10" fill="#3b2f23"/>
    <rect x="23" y="66" width="23" height="1.6" fill="#3b2f23"/>
  </g>`;
}

// ---------- 11. somalia ----------
function somalia() {
  return `
  <rect width="160" height="96" fill="#b9cbd6"/>
  <rect x="0" y="0" width="160" height="34" fill="#a7c0cf"/>
  <!-- apron and runway -->
  <rect x="0" y="68" width="160" height="28" fill="#b3b2a8"/>
  <rect x="0" y="66" width="160" height="3" fill="#9b9a90"/>
  ${[8, 44, 80, 116].map(x => `<rect x="${x}" y="84" width="20" height="2.4" fill="#e4e2d6"/>`).join('')}
  <!-- airport mast behind -->
  <rect x="24" y="18" width="2.4" height="50" fill="#5c636a"/>
  <rect x="14" y="30" width="22" height="2" fill="#5c636a"/>
  <rect x="14" y="44" width="22" height="2" fill="#5c636a"/>
  <circle cx="25.2" cy="16" r="2.6" fill="${RED}"/>
  <rect x="34" y="52" width="22" height="16" fill="#8b9199"/>
  <rect x="36" y="55" width="6" height="4" fill="#4a5158"/>
  <rect x="46" y="55" width="6" height="4" fill="#4a5158"/>
  <!-- white airliner with red tail, climbing right -->
  <g transform="rotate(-13 92 46)">
    <path d="M46 52 L128 52 Q136 52 134 46 L128 40 L52 40 Q44 42 46 52 Z" fill="#fbfbf7"/>
    <path d="M46 52 Q44 42 52 40 L60 40 L58 52 Z" fill="#e7e7dd"/>
    <path d="M112 40 L126 40 L134 22 L122 22 Z" fill="${RED}"/>
    <path d="M60 44 L88 26 L96 26 L76 44 Z" fill="#e4e4da"/>
    <path d="M64 48 L86 60 L94 60 L78 48 Z" fill="#d8d8ce"/>
    <circle cx="70" cy="46" r="1.7" fill="#2a3038"/>
    <circle cx="79" cy="46" r="1.7" fill="#2a3038"/>
    <circle cx="88" cy="46" r="1.7" fill="#2a3038"/>
    <circle cx="97" cy="46" r="1.7" fill="#2a3038"/>
    <path d="M128 40 L134 22" stroke="#c8352f" stroke-width="1.2"/>
  </g>
  <path d="M34 34 h10 M22 40 h6" stroke="#e8eef3" stroke-width="1.6" opacity="0.8"/>
  <!-- red stamp: 72 H -->
  <g transform="rotate(-7 40 76)">
    <rect x="18" y="66" width="42" height="22" rx="2" fill="none" stroke="${RED}" stroke-width="2.6"/>
    <rect x="22" y="70" width="34" height="14" fill="none" stroke="${RED}" stroke-width="0.9"/>
    <text x="39" y="81" font-family="Helvetica,Arial,sans-serif" font-size="11"
          font-weight="700" text-anchor="middle" fill="${RED}" letter-spacing="0.6">72 H</text>
  </g>`;
}

// ---------- 12. cyclone ----------
function cyclone() {
  const ring = (r, w, o) =>
    `<circle cx="80" cy="42" r="${r}" fill="none" stroke="#f4fbfd" stroke-width="${w}"
             stroke-dasharray="${r * 1.1} ${r * 0.9}" opacity="${o}"
             transform="rotate(${r * 0.9} 80 42)"/>`;
  return `
  <rect width="160" height="96" fill="#123c45"/>
  <rect x="0" y="0" width="160" height="60" fill="#164854"/>
  ${ring(34, 4.2, 0.95)}
  ${ring(26, 3.4, 0.9)}
  ${ring(18, 2.8, 0.85)}
  <circle cx="80" cy="42" r="9.6" fill="#eef8fb"/>
  <circle cx="80" cy="42" r="5.4" fill="#bfe4ec"/>
  <!-- sea -->
  <rect x="0" y="66" width="160" height="30" fill="#0e3138"/>
  <path d="M0 70 q10 -3 20 0 q10 3 20 0 q10 -3 20 0 q10 3 20 0 q10 -3 20 0 q10 3 20 0 q10 -3 20 0"
        fill="none" stroke="#3d7b86" stroke-width="1.5"/>
  <path d="M6 80 q10 -3 20 0 q10 3 20 0 q10 -3 20 0 q10 3 20 0 q10 -3 20 0 q10 3 20 0"
        fill="none" stroke="#2c616b" stroke-width="1.3"/>
  <path d="M20 90 q10 -3 20 0 q10 3 20 0 q10 -3 20 0 q10 3 20 0" fill="none"
        stroke="#3d7b86" stroke-width="1.2" opacity="0.8"/>
  <!-- small green island with palms at the bottom -->
  <path d="M50 92 Q58 80 74 80 Q92 80 96 92 Z" fill="#3f7a44"/>
  <path d="M56 92 Q60 84 70 83 Q76 84 78 92 Z" fill="#4f8f52"/>
  ${[[66, 82], [78, 84], [56, 86]].map(([x, y]) => `
    <rect x="${x}" y="${y - 9}" width="1.5" height="10" fill="#2f5c33"/>
    <path d="M${x + 0.7} ${y - 9} q-7 -3 -9 2 q6 -1 9 0 Z" fill="#69a75f"/>
    <path d="M${x + 0.7} ${y - 9} q7 -3 9 2 q-6 -1 -9 0 Z" fill="#69a75f"/>
    <path d="M${x + 0.7} ${y - 9} q-2 -6 3 -7 q0 5 -3 7 Z" fill="#69a75f"/>`).join('')}
  ${[[16, 74], [130, 70], [142, 86], [22, 90]].map(([x, y]) =>
    `<path d="M${x} ${y} q4 -2 8 0" stroke="#5c99a3" stroke-width="1.2" fill="none"/>`).join('')}`;
}

// ---------- 13. gta ----------
function gta() {
  const queue = [26, 39, 52, 65, 78];
  return `
  <rect width="160" height="96" fill="#151319"/>
  <rect x="0" y="0" width="160" height="18" fill="#1d1a23"/>
  <!-- storefront block -->
  <rect x="6" y="16" width="104" height="62" fill="#2a2530"/>
  <rect x="6" y="16" width="104" height="3" fill="#3a3442"/>
  <!-- red sign -->
  <rect x="12" y="20" width="60" height="11" fill="${RED}"/>
  <rect x="12" y="20" width="60" height="11" fill="none" stroke="#8f231f" stroke-width="0.9"/>
  <circle cx="66" cy="25.5" r="2.4" fill="${CREAM}"/>
  <rect x="17" y="23.4" width="34" height="1.6" fill="${CREAM}"/>
  <rect x="17" y="27" width="24" height="1.6" fill="#f0c9c5"/>
  <!-- four tall lit window panels -->
  ${[0, 1, 2, 3].map(i => {
    const x = 12 + i * 13.4;
    return `<rect x="${x}" y="36" width="10" height="30" fill="#f0dfb4"/>
            <rect x="${x}" y="36" width="10" height="30" fill="none" stroke="#4a4350" stroke-width="0.8"/>
            <rect x="${x + 4.4}" y="36" width="1.2" height="30" fill="#4a4350"/>`;
  }).join('')}
  <rect x="64" y="36" width="10" height="30" fill="#3a3442"/>
  <rect x="64" y="36" width="10" height="30" fill="none" stroke="#4a4350" stroke-width="0.8"/>
  <rect x="66" y="48" width="6" height="2" fill="#8b8194"/>
  <!-- pavement -->
  <rect x="0" y="78" width="160" height="18" fill="#1c1a21"/>
  <rect x="0" y="78" width="160" height="1.6" fill="#3a3442"/>
  <!-- queue of five small silhouettes -->
  ${queue.map((x, i) => `
    <circle cx="${x}" cy="70" r="2.8" fill="#0b0a0e"/>
    <path d="M${x - 2.6} 74 h5.2 l1 12 h-7.2 Z" fill="#0b0a0e"/>
    <path d="M${x - 1.6} 86 l-0.8 6 M${x + 1.6} 86 l0.8 6" stroke="#0b0a0e" stroke-width="2"/>`).join('')}
  <!-- small black panel at the right reading $2.36bn -->
  <rect x="116" y="24" width="40" height="30" rx="1.6" fill="#0b0a0e"/>
  <rect x="116" y="24" width="40" height="30" rx="1.6" fill="none" stroke="#4a4350" stroke-width="0.9"/>
  <text x="136" y="43" font-family="Helvetica,Arial,sans-serif" font-size="9.4"
        font-weight="700" text-anchor="middle" fill="${GOLD}">$2.36bn</text>
  <rect x="121" y="48" width="30" height="1.2" fill="#4a4350"/>
  <rect x="116" y="60" width="40" height="2.4" fill="#2a2530"/>`;
}

export const ART = { summit, icj, riyadh, kerch, ipo, cop, haiti, greenland, dhaka, mongolia, somalia, cyclone, gta };

export function artSvg(key, label) {
  const fn = ART[key];
  if (!fn) throw new Error('no drawing named ' + key);
  return `<svg class="art" data-key="${key}" viewBox="0 0 160 96" preserveAspectRatio="xMidYMid meet"
               role="img" aria-label="${label || key}">${fn()}</svg>`;
}

export const ART_KEYS = Object.keys(ART);
