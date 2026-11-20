// compose.mjs — builds page.html from news.mjs + art.mjs, then rasterises it with
// headless Chrome over CDP and prints every block's geometry so the layout can be
// checked against 1024 x 1024 without guessing.
//
//   node compose.mjs            build, render, measure
//   node compose.mjs --html     build only

import { writeFileSync, mkdtempSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { STORIES, DAY, REGIONS, REGION_INK, NUMBERS, EXCLUDED, counts, tally } from './news.mjs';
import { artSvg } from './art.mjs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const DIR = 'C:/Users/lin35/makefun/newsrepo19';
const PAGE = `${DIR}/page.html`;
const SHOT = `${DIR}/page.png`;

const INK = '#14161a';
const PAPER = '#fdfaf2';
const RED = '#c8352f';
const GOLD = '#e8c56a';
const TINT = '#f3eee1';

// Band heights in px. They must sum to exactly 1024; the rules between bands are
// borders inside each band's own height, so nothing falls off the sheet.
// v3: words out, pixels in. No story carries more than a headline except the
// three leads, whose decks are capped at 16 words. Every band was re-cut against
// the 300px reproduction: nothing sits below 9px, cards 15px, leads 24px.
const H = {
  masthead: 88,
  tally: 20,
  numbers: 37,
  leads: 246,
  bandA: 176,
  bandB: 176,
  briefs: 137,
  bottom: 128,
  footer: 16
};

const CONT = counts();
const TOTAL = tally();
const DRAWN = STORIES.filter(s => s.art).length;
const lede = STORIES.filter(s => s.art).slice(0, 3);
const bandA = STORIES.filter(s => s.art).slice(3, 8);
const bandB = STORIES.filter(s => s.art).slice(8, 13);
const briefs = STORIES.filter(s => !s.art);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- map ----------
// Coarse land outlines in lon/lat. Deliberately blunt: this is a dotted locator,
// not a cartographic claim. Equirectangular, cropped to -60..80 lat.
const LAND = [
  // North America
  [[-168,65],[-156,71],[-140,70],[-125,71],[-110,73],[-95,74],[-82,73],[-66,60],[-56,50],[-66,45],[-70,41],[-76,35],[-81,26],[-90,29],[-97,26],[-105,22],[-112,25],[-118,31],[-124,40],[-125,49],[-135,58],[-150,60],[-165,60]],
  // Central America
  [[-92,17],[-84,15],[-77,8],[-79,7],[-86,11],[-92,14]],
  // South America
  [[-79,9],[-72,12],[-62,11],[-52,5],[-44,-2],[-35,-6],[-38,-15],[-48,-25],[-54,-34],[-62,-40],[-65,-50],[-70,-55],[-75,-50],[-73,-40],[-71,-30],[-70,-18],[-76,-14],[-81,-5],[-80,2]],
  // Africa
  [[-17,15],[-10,22],[0,32],[10,37],[20,32],[32,31],[35,24],[43,12],[51,12],[42,-2],[40,-12],[35,-22],[32,-30],[25,-34],[18,-34],[12,-18],[9,-2],[2,5],[-8,5],[-14,10]],
  // Eurasia
  [[-10,36],[-9,44],[-2,50],[2,52],[6,54],[10,58],[14,56],[20,56],[24,60],[28,66],[30,70],[45,70],[60,72],[75,74],[95,76],[115,74],[135,72],[150,70],[165,68],[180,65],[180,60],[160,58],[145,52],[140,44],[128,38],[122,32],[118,24],[110,20],[105,12],[100,8],[98,14],[92,20],[88,22],[80,10],[72,20],[62,25],[56,26],[48,30],[44,38],[36,36],[30,36],[26,38],[20,40],[14,38],[8,44],[3,42],[-4,37]],
  // Australia
  [[113,-22],[122,-18],[130,-12],[138,-12],[142,-11],[146,-19],[153,-25],[150,-37],[140,-38],[129,-32],[115,-34],[113,-26]],
  // Aotearoa
  [[173,-35],[178,-38],[174,-41],[167,-46],[166,-45]],
  // Greenland
  [[-45,60],[-20,70],[-20,80],[-40,83],[-58,80],[-55,68],[-50,62]],
  // Madagascar
  [[43,-12],[50,-15],[48,-25],[44,-25],[43,-18]],
  // Japan
  [[130,32],[140,36],[142,42],[145,44],[140,35],[136,33]],
  // British Isles
  [[-6,50],[-2,53],[-3,58],[-6,56],[-8,52]],
  // Indonesia
  [[95,5],[105,-6],[120,-9],[130,-8],[135,-4],[120,0],[105,2]],
  // Iceland
  [[-24,64],[-14,66],[-18,63]],
  // Philippines
  [[120,18],[124,12],[126,7],[122,10],[119,14]]
];

const MAPW = 216, MAPH = 92;
const px = lon => ((lon + 180) / 360) * MAPW;
const py = lat => ((80 - lat) / 140) * MAPH;

// ---------- parts ----------
function masthead() {
  return `
  <div class="mh">
    <div class="mb">
      <span class="mb-mon">${DAY.monthTag}</span>
      <span class="mb-day">${DAY.dayNum}</span>
      <span class="mb-dow">${DAY.dowTag}</span>
    </div>
    <div class="mid">
      <div class="kick">${DAY.kicker}</div>
      <h1 class="date">${DAY.long}</h1>
      <div class="strap">${DAY.strap}</div>
    </div>
    <div class="mr">
      <div class="tallynum">${TOTAL}</div>
      <div class="tallylab">STORIES</div>
      <div class="tallysub">${DRAWN} DRAWN</div>
    </div>
  </div>`;
}

function tallyBar() {
  return `<div class="tb">${REGIONS.map(r => `
    <div class="ts" style="flex:${CONT[r]};background:${REGION_INK[r]}">
      <span class="tsn">${esc(r)}</span><span class="tsc">${CONT[r]}</span>
    </div>`).join('')}</div>`;
}

function numbers() {
  return `<div class="nb">
    <div class="nplate"><span>THE DAY</span><span>IN NUMBERS</span></div>
    ${NUMBERS.map(n => `
      <div class="nc"><div class="nf">${esc(n.figure)}</div>
        <div class="ncap">${esc(n.caption)}</div></div>`).join('')}
  </div>`;
}

function ledeCol(s, cls) {
  const artCls = cls === 'hero' ? 'artbox hero-art' : 'artbox';
  return `<article class="lede ${cls}">
    <div class="${artCls}"><span class="no">${artSvg(s.art, s.tag)}</span></div>
    <div class="kick2"><b>${s.n}</b> · ${esc(s.region)} · ${esc(s.tag)}</div>
    <h2 class="hl">${esc(s.headline)}</h2>
    ${s.deck ? `<p class="deck">${esc(s.deck)}</p>` : ''}
    <div class="src">${esc(s.outlet)}</div>
  </article>`;
}

function card(s) {
  return `<article class="card">
    <div class="artbox"><span class="no">${artSvg(s.art, s.tag)}</span></div>
    <div class="kick3"><i class="dot">${s.n}</i>${esc(s.region)} · ${esc(s.tag)}</div>
    <h3 class="ch">${esc(s.headline)}</h3>
  </article>`;
}

function briefsBlock() {
  const mid = Math.ceil(briefs.length / 2);
  const cols = [briefs.slice(0, mid), briefs.slice(mid)];
  return `<div class="bh">
      <span class="bht">${DAY.briefHeader}</span>
      <span class="bhn">${DAY.briefNote}</span>
    </div>
    <div class="bl">
      ${cols.map(col => `<div class="bc">${col.map(s => `
        <div class="br" data-brief="${s.n}">
          <span class="bn">${s.n}</span>
          <span class="bt" title="${esc(s.headline)}">${esc(s.headline)}</span>
          <span class="bo">${esc(s.outlet)}</span>
        </div>`).join('')}</div>`).join('')}
    </div>`;
}

function mapBlock() {
  const polys = LAND.map(poly => `<polygon points="${
    poly.map(([lon, lat]) => `${px(lon).toFixed(1)},${py(lat).toFixed(1)}`).join(' ')
  }" fill="url(#dots)" stroke="#2b2e35" stroke-width="0.45" stroke-opacity="0.45"/>`).join('');
  const plotted = STORIES.filter(s => s.lon !== null);
  const dots = plotted.map(s => `
    <circle cx="${px(s.lon).toFixed(1)}" cy="${py(s.lat).toFixed(1)}" r="2.1"
            fill="${PAPER}" opacity="0.85"/>
    <circle cx="${px(s.lon).toFixed(1)}" cy="${py(s.lat).toFixed(1)}" r="1.35"
            fill="${REGION_INK[s.region]}" ${s.art ? '' : 'opacity="0.72"'}/>`).join('');
  return `<div class="mapwrap">
    <div class="maptitle">Where the day happened<span>each dot is one story; Voyager 1 is past the frame</span></div>
    <svg class="map" viewBox="0 0 ${MAPW} ${MAPH}" preserveAspectRatio="xMidYMid meet"
         role="img" aria-label="World map, one dot per story">
      <defs><pattern id="dots" width="3.1" height="3.1" patternUnits="userSpaceOnUse">
        <circle cx="1.1" cy="1.1" r="0.72" fill="#3c4048"/></pattern></defs>
      ${polys}
      ${dots}
    </svg>
    <div class="mapkey">${REGIONS.map(r =>
      `<span class="k"><i style="background:${REGION_INK[r]}"></i>${esc(
        r === 'Middle East' ? 'MID EAST' : r)}</span>`).join('')}</div>
  </div>`;
}

function excludeBlock() {
  return `<div class="xp">
    <div class="xhead">Date check — kept off this page</div>
    <p class="xnote">Every story above carries the 19th. These six broke on
      Wednesday 18 November, so they are named here and drawn nowhere.</p>
    <div class="xlist">${EXCLUDED.map(x => `<div class="xi">${esc(x)}</div>`).join('')}</div>
  </div>`;
}

function build() {
  const band = (name, inner, cls = '') =>
    `<section class="band ${cls}" data-block="${name}" style="height:${H[name]}px">${inner}</section>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>The Day in World News — Thursday 19 November 2026</title>
<style>
  :root{
    --paper:${PAPER}; --ink:${INK}; --red:${RED}; --gold:${GOLD}; --tint:${TINT};
    --hero-art:90px; --lede-art:84px; --card-art:110px;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1024px;height:1024px;overflow:hidden;background:var(--paper)}
  body{font-family:Georgia,"Times New Roman",serif;color:var(--ink);
       -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
  .page{width:1024px;height:1024px;display:flex;flex-direction:column;overflow:hidden;
        background:var(--paper)}
  .band{position:relative;flex:0 0 auto;box-sizing:border-box;border-bottom:2px solid var(--ink);
        overflow:hidden}
  .band:last-child{border-bottom:none}

  /* ---------- masthead ---------- */
  .mh{display:grid;grid-template-columns:92px 1fr 122px;height:100%}
  .mb{background:var(--red);color:var(--paper);display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:2px;padding-top:2px}
  .mb-mon{font:700 12px/1 Helvetica,Arial,sans-serif;letter-spacing:.20em;opacity:.94}
  .mb-day{font:700 36px/.92 Georgia,serif;letter-spacing:-.01em}
  .mb-dow{font:700 10px/1 Helvetica,Arial,sans-serif;letter-spacing:.24em;opacity:.94}
  .mid{padding:6px 18px 0;display:flex;flex-direction:column;justify-content:center}
  .kick{font:700 10.6px/1 Helvetica,Arial,sans-serif;letter-spacing:.22em;color:var(--red);
        margin-bottom:5px}
  .date{font:700 39px/1.02 Georgia,"Times New Roman",serif;letter-spacing:-.018em}
  .strap{font:italic 9.6px/1.2 Georgia,serif;color:#4b473f;margin-top:5px;letter-spacing:.004em}
  .mr{border-left:1px solid var(--ink);display:flex;flex-direction:column;
      align-items:center;justify-content:center;padding-top:2px}
  .tallynum{font:700 42px/.86 Georgia,serif;letter-spacing:-.03em;color:var(--ink)}
  .tallylab{font:700 9.2px/1.3 Helvetica,Arial,sans-serif;letter-spacing:.18em;margin-top:2px}
  .tallysub{font:700 9px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.09em;color:var(--red)}

  /* ---------- tally bar ---------- */
  .tb{display:flex;height:100%}
  .ts{display:flex;align-items:center;justify-content:center;gap:6px;color:var(--paper);
      border-right:1.5px solid var(--paper);overflow:hidden;min-width:0}
  .ts:last-child{border-right:none}
  .tsn{font:700 9px/1 Helvetica,Arial,sans-serif;letter-spacing:.10em;text-transform:uppercase;
       white-space:nowrap}
  .tsc{font:700 13px/1 Georgia,serif;color:var(--gold);flex:0 0 auto}

  /* ---------- numbers ---------- */
  /* v4: this was a black band. Now a cream band between two heavy ink rules,
     label in red, numerals in ink, captions in red small caps. The strip still
     reads as a distinct object, but it no longer reads as a slab. */
  .numbers{background:var(--tint);border-top:3px solid var(--ink);border-bottom:3px solid var(--ink)}
  .nb{display:flex;height:100%;align-items:stretch}
  .nplate{flex:0 0 112px;display:flex;flex-direction:column;justify-content:center;
          padding-left:12px;gap:3px}
  .nplate span{font:700 9px/1 Helvetica,Arial,sans-serif;letter-spacing:.09em;
               white-space:nowrap;color:var(--red)}
  .nc{flex:1 1 0;min-width:0;border-left:1px solid #cfc7b4;padding:3px 0 0 11px;
      display:flex;flex-direction:column;justify-content:center}
  .nf{font:700 21px/1.02 Georgia,serif;color:var(--ink);letter-spacing:-.018em;
      white-space:nowrap}
  .ncap{font:700 9px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.07em;
        text-transform:uppercase;color:var(--red);margin-top:2px}

  /* ---------- leads ---------- */
  .leads{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1.06fr) minmax(0,1fr);
         column-gap:0;padding:8px 12px 0}
  .lede{padding:0 12px 4px;border-left:1px solid #c6c0b2;min-width:0;overflow:hidden}
  .lede:first-child{border-left:none;padding-left:0}
  .artbox{width:100%;aspect-ratio:160/96;overflow:hidden;background:#e8e4d8;
          outline:1px solid #b9b3a4;outline-offset:0}
  .artbox .no{display:block;width:100%;height:100%}
  .art{display:block;width:100%;height:100%}
  /* v3 bugfix: the ".lede .artbox" rule (specificity 0,2,0) was beating
     ".hero-art" (0,1,0), so the hero drawing rendered at the lede size. The hero
     now wins on specificity instead. */
  .lede .artbox{height:var(--lede-art);width:calc(var(--lede-art) * 5 / 3);
                margin:0 auto 4px}
  .lede.hero .artbox{height:var(--hero-art);width:calc(var(--hero-art) * 5 / 3)}
  .kick2{font:700 9px/1.15 Helvetica,Arial,sans-serif;letter-spacing:.10em;
         text-transform:uppercase;color:#4b473f;white-space:nowrap;overflow:hidden}
  .lede.sm .kick2{white-space:normal;line-height:1.15;letter-spacing:.05em}
  .kick2 b{color:var(--red);margin-right:2px}
  .hl{font:700 24px/1.06 Georgia,serif;letter-spacing:-.016em;margin-top:5px;color:var(--ink)}
  .lede.sm .hl{font-size:24px;line-height:1.06}
  .deck{font:400 10px/1.32 Georgia,serif;color:#3f3b34;margin-top:5px}
  .src{font:700 9px/1 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;
       color:var(--red);margin-top:6px}

  /* ---------- picture bands ---------- */
  /* v3: art is as large as a 5-across grid allows. With 4px page padding and 3px
     gutters each track is 203.2px, so a 5:3 box is 197.2 x 118.3 — the 196x118
     target rounded to what actually fits without clipping. */
  .pics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;padding:6px 4px 0}
  .card{padding:0 3px 3px;border-left:1px solid #c6c0b2;min-width:0;overflow:hidden}
  .card:first-child{border-left:none;padding-left:0}
  .card .artbox{height:var(--card-art);width:calc(var(--card-art) * 5 / 3);margin-bottom:5px}
  .kick3{font:700 9px/1.1 Helvetica,Arial,sans-serif;letter-spacing:.06em;
         text-transform:uppercase;color:#4b473f;display:flex;align-items:center;gap:4px;
         white-space:nowrap;overflow:hidden}
  .dot{font:700 9px/1 Helvetica,Arial,sans-serif;font-style:normal;color:var(--paper);
       background:var(--red);border-radius:50%;width:13px;height:13px;display:inline-flex;
       align-items:center;justify-content:center;flex:0 0 auto}
  .ch{font:700 15px/1.1 Georgia,serif;letter-spacing:-.01em;margin-top:4px;color:var(--ink)}

  /* ---------- briefs ---------- */
  /* v3: 18 briefs in two columns of nine at 9.4px on a 12.4px pitch. The rail is
     the densest thing left on the sheet, so it gets the leading rather than more
     items: at 300px nine rows of air read as a list, eighteen rows read as texture. */
  .briefs{background:var(--paper)}
  .bh{height:20px;border-bottom:2px solid var(--red);display:flex;align-items:center;
      justify-content:space-between;padding:0 12px}
  .bht{font:700 12px/1 Georgia,serif;letter-spacing:.02em;color:var(--ink)}
  .bhn{font:700 9px/1 Helvetica,Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase;
       color:var(--red)}
  .bl{display:grid;grid-template-columns:1fr 1fr;height:calc(100% - 22px);
      padding:6px 12px 0;column-gap:22px}
  .bc{min-width:0;padding-right:20px;border-right:1px solid #c6c0b2}
  .bc:last-child{border-right:none;padding-right:0}
  .br{display:flex;align-items:baseline;gap:5px;height:12.2px;overflow:hidden}
  .bn{font:700 9.4px/1 Georgia,serif;color:var(--red);width:15px;flex:0 0 15px;text-align:right}
  .bt{font:400 9.4px/1.32 Georgia,serif;color:var(--ink);flex:1 1 auto;min-width:0;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .bo{font:700 9px/1 Helvetica,Arial,sans-serif;letter-spacing:.05em;text-transform:uppercase;
       color:var(--red);flex:0 0 auto;white-space:nowrap}

  /* ---------- bottom ---------- */
  .bottom{display:grid;grid-template-columns:274px 1fr;gap:0}
  .mapwrap{padding:0 10px 0 12px;display:flex;flex-direction:column;min-width:0}
  .maptitle{font:700 9px/1.15 Helvetica,Arial,sans-serif;letter-spacing:.09em;
            text-transform:uppercase;color:var(--ink)}
  .maptitle span{display:block;font:italic 9px/1.15 Georgia,serif;letter-spacing:0;
                 text-transform:none;color:#5b564c;margin-top:1px}
  .map{width:100%;height:80px;margin-top:2px;display:block}
  /* v3: 4 + 3 across two rows so the key is 2 lines, not 3. At 9px, seven
     region names on one row measures wider than the 216px column. */
  .mapkey{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0 2px;margin-top:1px}
  .mapkey .k{font:700 9px/1.26 Helvetica,Arial,sans-serif;letter-spacing:-.015em;
             text-transform:uppercase;color:#3f3b34;display:inline-flex;align-items:center;gap:2.5px;
             white-space:nowrap}
  .mapkey .k i{width:6.5px;height:6.5px;border-radius:50%;display:inline-block;flex:0 0 auto}
  .xp{margin:4px 12px 0 0;background:var(--tint);border-left:3px solid var(--red);
      border-top:1px solid #d8d0bd;border-right:1px solid #d8d0bd;
      border-bottom:1px solid #d8d0bd;color:var(--ink);
      padding:5px 12px 0 10px;height:calc(100% - 4px);overflow:hidden}
  .xhead{font:700 12px/1 Georgia,serif;color:var(--red);letter-spacing:.01em}
  .xnote{font:400 9.6px/1.26 Georgia,serif;color:#4b473f;margin-top:3px;max-width:690px}
  .xlist{display:grid;grid-template-columns:1fr 1fr;gap:0 22px;margin-top:3px}
  .xi{font:400 9.6px/1.46 Georgia,serif;color:var(--ink);padding-left:9px;position:relative;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .xi:before{content:"";position:absolute;left:0;top:6px;width:3px;height:3px;
             background:var(--red)}

  /* ---------- footer ---------- */
  .footer{background:var(--paper);border-top:2px solid var(--red);
          display:flex;align-items:center;justify-content:space-between;padding:0 12px}
  .fl,.fr{font:700 9px/1 Helvetica,Arial,sans-serif;letter-spacing:.07em;
          text-transform:uppercase;white-space:nowrap;color:var(--ink)}
  .fr{color:var(--red)}
</style></head>
<body><div class="page">
  ${band('masthead', masthead())}
  ${band('tally', tallyBar())}
  ${band('numbers', numbers())}
  ${band('leads', `<div class="leads">${ledeCol(lede[0], 'hero')}${lede.slice(1).map(s => ledeCol(s, 'sm')).join('')}</div>`, 'leads-band')}
  ${band('bandA', `<div class="pics">${bandA.map(card).join('')}</div>`, 'pics-band')}
  ${band('bandB', `<div class="pics">${bandB.map(card).join('')}</div>`, 'pics-band')}
  ${band('briefs', briefsBlock(), 'briefs')}
  ${band('bottom', `<div class="bottom">${mapBlock()}${excludeBlock()}</div>`, 'bottom-band')}
  <footer class="footer band" data-block="footer" style="height:${H.footer}px">
    <span class="fl">${esc(DAY.footerLeft)}</span>
    <span class="fr">${esc(DAY.footerRight)}</span>
  </footer>
</div></body></html>`;
}

// ---------- measure ----------
const PROBE = `(() => {
  const r = el => { const b = el.getBoundingClientRect();
    return {top:+b.top.toFixed(2), h:+b.height.toFixed(2), bottom:+b.bottom.toFixed(2)}; };
  const blocks = [...document.querySelectorAll('[data-block]')].map(el => {
    const o = r(el);
    o.name = el.dataset.block; o.sh = el.scrollHeight; o.ch = el.clientHeight;
    // deepest content bottom measured from the block's own top: this is the
    // height the band actually wants, so H can be set to it + the rule.
    let deep = 0, who = '';
    for (const k of el.querySelectorAll('*')) {
      const b = k.getBoundingClientRect();
      if (b.height === 0) continue;
      const d = b.bottom - o.top;
      if (d > deep) { deep = d; who = (k.className || k.tagName).toString().slice(0, 18); }
    }
    o.want = +deep.toFixed(1); o.who = who;
    return o;
  });
  const arts = [...document.querySelectorAll('.art')].map(el => {
    const b = el.getBoundingClientRect(); const box = el.parentElement.getBoundingClientRect();
    let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;
    for (const c of el.children) { try { const g = c.getBBox();
      minx=Math.min(minx,g.x); miny=Math.min(miny,g.y);
      maxx=Math.max(maxx,g.x+g.width); maxy=Math.max(maxy,g.y+g.height); } catch(e){} }
    return { key: el.dataset.key, w:+b.width.toFixed(2), h:+b.height.toFixed(2),
             left:+b.left.toFixed(1), top:+b.top.toFixed(1),
             aspect:+(b.width/b.height).toFixed(4), boxW:+box.width.toFixed(2),
             boxH:+box.height.toFixed(2), bounds:[+minx.toFixed(1),+miny.toFixed(1),
             +maxx.toFixed(1),+maxy.toFixed(1)] };
  });
  const trunc = [...document.querySelectorAll('.bt')].filter(el => el.scrollWidth > el.clientWidth + 1)
    .map(el => el.textContent.trim());
  const clipped = [...document.querySelectorAll('[data-block]')].filter(el => el.scrollHeight > el.clientHeight + 1)
    .map(el => el.dataset.block);
  const tight = [...document.querySelectorAll('.card, .lede, .br, .xi, .ts')]
    .filter(el => el.scrollWidth > el.clientWidth + 1)
    .map(el => {
      const kids = [...el.children].filter(k => k.scrollWidth > k.clientWidth + 1)
        .map(k => k.className + '(' + k.scrollWidth + '>' + k.clientWidth + ')');
      const box = el.getBoundingClientRect();
      const wide = [...el.querySelectorAll('*')].map(k => k.getBoundingClientRect())
        .filter(r => r.right > box.right + 1 || r.left < box.left - 1)
        .map(r => r.width.toFixed(0) + '@' + r.left.toFixed(1) + '-' + r.right.toFixed(1));
      return el.className + ':' + el.textContent.trim().slice(0, 22) +
             ' [box ' + box.left.toFixed(1) + '-' + box.right.toFixed(1) +
             ' sw' + el.scrollWidth + '>' + el.clientWidth + ' :: ' + (wide.join(' ') || 'none') + ']';
    });
  const text = {
    mast: (document.querySelector('.mr')||{}).innerText,
    tally: [...document.querySelectorAll('.ts')].map(e => e.innerText.split(String.fromCharCode(10)).join(' ')),
    nums: [...document.querySelectorAll('.nc')].map(e => e.innerText.split(String.fromCharCode(10)).join(' ')),
    heads: [...document.querySelectorAll('.hl, .ch')].map(e => e.innerText),
    xlist: [...document.querySelectorAll('.xi')].map(e => e.innerText)
  };
  // Effective rendered size. SVG labels live in a 160x96 viewBox that is scaled
  // up to the art box, so a 8.2 user-unit label at a 120px-tall box renders at
  // 8.2 * 120/96 = 10.25px. Counting raw user units would over-report tiny text.
  const eff = el => {
    let fs = parseFloat(getComputedStyle(el).fontSize);
    const svg = el.ownerSVGElement;
    if (svg) {
      const vb = svg.viewBox.baseVal;
      const h = svg.getBoundingClientRect().height;
      if (vb && vb.height > 0 && h > 0) fs = fs * (h / vb.height);
    }
    return fs;
  };
  const tiny = [...document.querySelectorAll('.page *')].filter(el =>
      el.children.length === 0 && el.textContent.trim() && eff(el) < 9)
    .map(el => eff(el).toFixed(1) + 'px ' + el.textContent.trim().slice(0, 24));
  // font-size histogram over every leaf text node, smallest first
  const sizes = new Map();
  for (const el of document.querySelectorAll('.page *')) {
    if (el.children.length || !el.textContent.trim()) continue;
    const fs = eff(el).toFixed(1);
    sizes.set(fs, (sizes.get(fs) || 0) + 1);
  }
  const hist = [...sizes.entries()].sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  const cardOver = [...document.querySelectorAll('.card, .lede')].map(el => {
    const b = el.getBoundingClientRect();
    let deep = 0, who = '';
    for (const k of el.querySelectorAll('*')) {
      const r2 = k.getBoundingClientRect();
      if (r2.height === 0) continue;
      const d = r2.bottom - b.top;
      if (d > deep) { deep = d; who = (k.className || k.tagName).toString().slice(0, 14); }
    }
    const lines = el.querySelector('.ch, .hl');
    return { t: (el.querySelector('.ch, .hl') || {}).textContent?.slice(0, 34) || '',
             h: +b.height.toFixed(1), deep: +deep.toFixed(1), who,
             over: +(deep - b.height).toFixed(1),
             lines: lines ? Math.round(lines.getBoundingClientRect().height /
                     (parseFloat(getComputedStyle(lines).fontSize) * 1.1)) : 0 };
  });
  const storyCount = document.querySelectorAll('.ch, .hl, .br').length;
  const kids = {};
  for (const sel of ['.bottom > *', '.leads > *', '.mapwrap > *', '.xp > *']) {
    kids[sel] = [...document.querySelectorAll(sel)].map(el => ({
      c: (el.className || el.tagName).toString().slice(0, 16),
      h: +el.getBoundingClientRect().height.toFixed(1),
      w: +el.getBoundingClientRect().width.toFixed(1)
    }));
  }
  const numOver = [...document.querySelectorAll('.nc')].map(el => {
    const b = el.getBoundingClientRect();
    const f = el.querySelector('.nf'), c = el.querySelector('.ncap');
    const fb = f.getBoundingClientRect(), cb = c.getBoundingClientRect();
    return { fig: f.textContent, cellW: +b.width.toFixed(1),
             figW: f.scrollWidth, capW: c.scrollWidth,
             over: +Math.max(f.scrollWidth - f.clientWidth,
                             c.scrollWidth - c.clientWidth).toFixed(1) };
  });
  const plate = [...document.querySelectorAll('.nplate span')].map(el => ({
    t: el.textContent, sw: el.scrollWidth, cw: el.clientWidth,
    over: +(el.scrollWidth - el.clientWidth).toFixed(1)
  }));
  const decks = [...document.querySelectorAll('.lede')].map(el => {
    const d = el.querySelector('.deck');
    // PROBE is a template literal, so a literal backslash-s here would arrive in
    // the page as a bare "s" and split words on every letter s. Build the matcher.
    const WS = new RegExp(String.fromCharCode(92) + 's+', 'g');
    const t = d ? (d.textContent || '').replace(WS, ' ').trim() : '';
    return { n: (el.querySelector('.kick2 b') || {}).textContent || '?',
             w: t ? t.split(' ').filter(Boolean).length : 0 };
  });
  const ledes = [...document.querySelectorAll('.lede')].map(el => {
    const art = el.querySelector('.artbox').getBoundingClientRect();
    let txt = 0;
    for (const sel of ['.kick2', '.hl', '.deck', '.src']) {
      const k = el.querySelector(sel);
      if (k) txt += k.getBoundingClientRect().height +
                   (parseFloat(getComputedStyle(k).marginTop) || 0);
    }
    return { h: +el.getBoundingClientRect().height.toFixed(1),
             w: +el.getBoundingClientRect().width.toFixed(1),
             art: +art.height.toFixed(1), txt: +txt.toFixed(1),
             hlLines: Math.round(el.querySelector('.hl').getBoundingClientRect().height /
                      (parseFloat(getComputedStyle(el.querySelector('.hl')).fontSize) * 1.06)) };
  });
  return { page:{w:document.documentElement.scrollWidth, h:document.documentElement.scrollHeight,
    bodyH:+document.body.getBoundingClientRect().height.toFixed(2)},
    blocks, arts, trunc, clipped, tight, tiny, hist, storyCount, cardOver, kids, numOver,
    plate, decks, ledes, text };
})()`;

async function cdp(url) {
  const port = 9300 + (process.pid % 300);
  const profile = mkdtempSync(join(tmpdir(), 'chrome-news-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--disable-extensions', '--mute-audio',
    `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
    '--force-device-scale-factor=1', '--window-size=1024,1024', 'about:blank'
  ], { stdio: 'ignore' });

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let list = null;
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      list = await res.json();
      if (list.find(t => t.type === 'page')) break;
    } catch {}
    await sleep(100);
  }
  if (!list) { chrome.kill(); throw new Error('chrome did not open a debug port'); }
  const target = list.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const mid = ++id;
    pending.set(mid, m => m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result));
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',
    { width: 1024, height: 1024, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  await sleep(700);
  const probe = await send('Runtime.evaluate',
    { expression: PROBE, returnByValue: true, awaitPromise: false });
  if (probe.exceptionDetails) {
    throw new Error('probe failed: ' + JSON.stringify(probe.exceptionDetails).slice(0, 600));
  }
  const shot = await send('Page.captureScreenshot',
    { format: 'png', clip: { x: 0, y: 0, width: 1024, height: 1024, scale: 1 },
      captureBeyondViewport: false });

  ws.close(); chrome.kill();
  return { m: probe.result.value, png: Buffer.from(shot.data, 'base64') };
}

const html = build();
writeFileSync(PAGE, html);
if (process.argv.includes('--html')) {
  console.log('page.html written (' + html.length + ' bytes)');
} else {
  const { m, png } = await cdp('file:///' + PAGE);
  writeFileSync(SHOT, png);

  console.log('page  ' + m.page.w + 'x' + m.page.h + '   body ' + m.page.bodyH);
  console.log('');
  console.log('block        top     height    bottom   scroll/client   wants');
  for (const b of m.blocks) {
    console.log(b.name.padEnd(11) + String(b.top).padStart(7) + String(b.h).padStart(9) +
                String(b.bottom).padStart(9) + ('   ' + b.sh + '/' + b.ch).padStart(12) +
                String(b.want).padStart(9) + ' ' + b.who);
  }
  console.log('');
  const last = m.blocks[m.blocks.length - 1];
  console.log('art boxes: ' + m.arts.length +
    '   aspects ' + [...new Set(m.arts.map(a => a.aspect))].join(', '));
  const off = m.arts.filter(a => a.bounds[0] < -0.5 || a.bounds[1] < -0.5 ||
                                a.bounds[2] > 160.5 || a.bounds[3] > 96.5);
  const stretch = m.arts.filter(a => Math.abs(a.aspect - 1.6667) > 0.004);
  const artOpen = m.arts.filter(a => Math.abs(a.w - a.boxW) > 0.6 || Math.abs(a.h - a.boxH) > 0.6);
  console.log('art off-canvas: ' + (off.length ? off.map(a => a.key + ' ' + a.bounds.join(',')).join(' | ') : 'none'));
  console.log('art stretched:  ' + (stretch.length ? stretch.map(a => a.key + ' ' + a.aspect).join(' | ') : 'none'));
  // per-drawing darkness, so "lighten the dark ones" is a measurement, not a guess
  writeFileSync(join(DIR, 'artboxes.json'),
    JSON.stringify(m.arts.map(a => ({ key: a.key, left: a.left, top: a.top,
      w: a.w, h: a.h }))));
  console.log('art boxes -> artboxes.json (for tools/artink.mjs)');
  console.log('art not filling its box: ' + (artOpen.length ? artOpen.map(a => a.key).join(' | ') : 'none'));
  console.log('');
  console.log('briefs truncated: ' + (m.trunc.length ? m.trunc.join(' | ') : 'none'));
  console.log('blocks clipped:   ' + (m.clipped.length ? m.clipped.join(' | ') : 'none'));
  console.log('rows too wide:    ' + (m.tight.length ? m.tight.join(' | ') : 'none'));
  console.log('text under 9px:  ' + (m.tiny.length ? m.tiny.join(' | ') : 'none'));
  console.log('');
  console.log('decks (max 16 words): ' + m.decks.map(d => d.n + ':' + d.w + 'w' +
              (d.w > 16 ? ' OVER' : '')).join('  '));
  console.log('');
  console.log('font-size histogram (smallest first, element count):');
  for (const [fs, n] of m.hist) console.log('  ' + fs.padStart(5) + 'px  x' + n);
  console.log('  smallest on page: ' + m.hist[0][0] + 'px');
  console.log('  stories as counted in DOM (.hl/.ch/.br): ' + m.storyCount);
  console.log('');
  console.log('cards/leads: over = content bottom past the card box (negative = clearance)');
  for (const c of m.cardOver) {
    console.log('  ' + (c.over > 0 ? 'OVER ' : '  ok ') + String(c.over).padStart(6) +
                '  h' + String(c.h).padStart(6) + '  ' + c.lines + 'ln  ' +
                c.who.padEnd(14) + c.t);
  }
  console.log('');
  for (const [sel, arr] of Object.entries(m.kids)) {
    console.log(sel.padEnd(18) + arr.map(k => k.c + ' ' + k.h + 'x' + k.w).join('  |  '));
  }
  console.log('');
  console.log('numbers cells: over = figure/caption past the cell right edge');
  for (const n of m.numOver) {
    console.log('  ' + (n.over > 0 ? 'OVER ' : '  ok ') + String(n.over).padStart(6) +
                '  cell' + String(n.cellW).padStart(6) + ' fig' + String(n.figW).padStart(6) +
                ' cap' + String(n.capW).padStart(6) + '  ' + n.fig);
  }
  console.log('');
  console.log('numbers plate: ' + m.plate.map(p => p.t + ' sw' + p.sw +
              (p.over > 0 ? ' OVER ' + p.over : ' ok')).join('  |  '));
  console.log('masthead right : ' + m.text.mast.split(String.fromCharCode(10)).join(' / '));
  console.log('');
  console.log('leads (ink left after art + type):');
  for (const l of m.ledes) {
    console.log('  w' + String(l.w).padStart(6) + ' h' + String(l.h).padStart(6) +
                ' art' + String(l.art).padStart(6) + ' txt' + String(l.txt).padStart(6) +
                '  hl ' + l.hlLines + 'ln');
  }
  console.log('tally          : ' + m.text.tally.join('  |  '));
  console.log('numbers        : ' + m.text.nums.join('  |  '));
  console.log('excluded       : ' + m.text.xlist.join('  |  '));
  console.log('headlines      : ' + m.text.heads.length + ' rendered');
  console.log('');
  console.log('page.png ' + png.length + ' bytes, last block bottom ' + last.bottom +
              (last.bottom === 1024 ? ' (exact)' : ' MISMATCH'));
}
