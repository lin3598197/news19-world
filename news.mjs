// news.mjs — Thursday 19 November 2026, one row per story.
// Every line traced to ../news19/facts19.md. No numbers invented.

export const DAY = {
  iso: '2026-11-19',
  weekday: 'Thursday',
  long: 'Thursday 19 November 2026',
  monthTag: 'NOV',
  dayNum: '19',
  dowTag: 'THU',
  kicker: 'THE DAY IN WORLD NEWS',
  strap:
    'Everything here happened, or was first reported, on Thursday 19 November 2026 · nothing carried over from the 18th',
  briefHeader: 'Also on Thursday 19 November 2026',
  briefNote: '18 more stories, each with the outlet that filed it',
  footerLeft: 'Thursday 19 November 2026 · every story names the outlet that reported it',
  footerRight: 'The Day in World News'
};

// region order fixed so the tally bar and map key never move between builds.
export const REGIONS = ['Europe', 'Americas', 'Asia', 'Africa', 'Middle East', 'Oceania', 'World'];

export const REGION_INK = {
  Europe: '#1f3b5c',
  Americas: '#7a2a2a',
  Asia: '#235040',
  Africa: '#6b4a16',
  'Middle East': '#472a5c',
  Oceania: '#16545a',
  World: '#26262b'
};

// art: key of a drawing in art.mjs, or null when the story is briefs-only.
// lon/lat: from the research note; null where the note gives none (Voyager 1).
export const STORIES = [
  {
    n: 1, region: 'Asia', tag: 'APEC · SHENZHEN', art: 'summit', lon: 114.1, lat: 22.5,
    headline: 'Xi, Putin and Trump sign a “peace declaration” and leave the wars out',
    deck: 'First three-way summit of the three nuclear powers. 70 minutes; no mention of Ukraine or Iran.',
    outlet: 'AP · Reuters · Guardian'
  },
  {
    n: 2, region: 'World', tag: 'ICJ · THE HAGUE', art: 'icj', lon: 4.3, lat: 52.1,
    headline: 'World Court finds Myanmar committed genocide',
    deck: 'The court’s first genocide finding against a state — on Gambia’s case over the 2017 crackdown.',
    outlet: 'Reuters · AFP'
  },
  {
    n: 3, region: 'Middle East', tag: 'YEMEN · RIYADH', art: 'riyadh', lon: 46.7, lat: 24.7,
    headline: 'Houthi missile blows out the windows of Riyadh’s tallest tower',
    deck: 'Seven or eight floors of the Saudi wealth fund’s PIF Tower damaged; no injuries reported.',
    outlet: 'Reuters · Al-Monitor'
  },
  {
    n: 4, region: 'Europe', tag: 'UKRAINE · KERCH', art: 'kerch', lon: 36.5, lat: 45.3,
    headline: 'Kyiv hits the Kerch bridge a third time in a week',
    outlet: 'Guardian'
  },
  {
    n: 5, region: 'Americas', tag: 'MARKETS · IPO', art: 'ipo', lon: -74, lat: 40.7,
    headline: 'Anthropic closes its first day worth $1.3 trillion',
    outlet: 'AP · CNBC'
  },
  {
    n: 6, region: 'World', tag: 'COP31 · ANTALYA', art: 'cop', lon: 30.7, lat: 36.9,
    headline: 'Fossil fuels vanish from the COP31 draft deal',
    outlet: 'AFP · France 24'
  },
  {
    n: 7, region: 'Americas', tag: 'HAITI · MARTISSANT', art: 'haiti', lon: -72.3, lat: 18.5,
    headline: 'Haitian police kill 34 retaking Martissant',
    outlet: 'Reuters · AP'
  },
  {
    n: 8, region: 'Europe', tag: 'DENMARK · GREENLAND', art: 'greenland', lon: 12.6, lat: 55.7,
    headline: 'Denmark ratifies the Greenland pact',
    outlet: 'Reuters'
  },
  {
    n: 9, region: 'Asia', tag: 'BANGLADESH · DHAKA', art: 'dhaka', lon: 90.4, lat: 23.8,
    headline: 'Hasina’s supporters burn Yunus’s ancestral home',
    outlet: 'Reuters · Daily Star'
  },
  {
    n: 10, region: 'Asia', tag: 'MONGOLIA · ULAANBAATAR', art: 'mongolia', lon: 106.9, lat: 47.9,
    headline: 'Parliament accepts the president’s resignation',
    outlet: 'AP'
  },
  {
    n: 11, region: 'Africa', tag: 'SOMALIA · UAE', art: 'somalia', lon: 45.3, lat: 2,
    headline: 'Somalia expels the UAE ambassador in 72 hours',
    outlet: 'Reuters · AP'
  },
  {
    n: 12, region: 'Oceania', tag: 'COOK ISLANDS', art: 'cyclone', lon: -159.8, lat: -21.2,
    headline: 'Cyclone Xavier is downgraded to category 4',
    outlet: 'RNZ'
  },
  {
    n: 13, region: 'World', tag: 'GAMES · GTA VI', art: 'gta', lon: -118.2, lat: 34.1,
    headline: 'GTA VI sells $2.36 billion in its first day',
    outlet: 'AP · Sensor Tower'
  },

  // Briefs, stories 14 to 31 — one line each, 18 of them.
  // v4 restores the two Asia lines v3 dropped (Beijing/Taiwan, Manila–Chile): with
  // the black slabs gone there is room again, and 18 briefs is the count the page
  // promises. Region order inside the rail follows the tally so the map key reads.
  { n: 14, region: 'Europe', tag: 'BERLIN', art: null, lon: 13.4, lat: 52.5, headline: 'EU leaders meet in Berlin to rally support for Kyiv', outlet: 'AFP' },
  { n: 15, region: 'Europe', tag: 'PARIS', art: null, lon: 2.3, lat: 48.9, headline: 'Macron reopens the NATO question for Ukraine', outlet: 'France 24' },
  { n: 16, region: 'Europe', tag: 'LONDON', art: null, lon: -0.1, lat: 51.5, headline: 'UK and EU agree a 100,000-a-year youth mobility cap', outlet: 'Guardian' },
  { n: 17, region: 'Middle East', tag: 'GAZA', art: null, lon: 34.3, lat: 31.4, headline: 'Israeli tanks end a raid past the Yellow Line in Gaza', outlet: 'Reuters' },
  { n: 18, region: 'Middle East', tag: 'LEBANON', art: null, lon: 36, lat: 33.8, headline: 'Israeli jets hit a Hezbollah site in the Bekaa', outlet: 'Times of Israel' },
  { n: 19, region: 'Middle East', tag: 'IAEA · VIENNA', art: null, lon: 16.4, lat: 48.2, headline: 'West presses Iran at IAEA to reopen bombed sites', outlet: 'Reuters' },
  { n: 20, region: 'Asia', tag: 'BEIJING', art: null, lon: 116.4, lat: 39.9, headline: 'Xi tells Washington to do the “right thing” on Taiwan', outlet: 'Xinhua' },
  { n: 21, region: 'Asia', tag: 'MANILA', art: null, lon: 121, lat: 14.6, headline: 'Manila signs its first Latin America trade deal, with Chile', outlet: 'Inquirer' },
  { n: 22, region: 'Asia', tag: 'HORMUZ', art: null, lon: 56.5, lat: 26.5, headline: 'Tanker burns after a mine strike east of Hormuz', outlet: 'Al Jazeera' },
  { n: 23, region: 'Asia', tag: 'TOKYO', art: null, lon: 139.7, lat: 35.7, headline: 'Nikkei −4.5%, SoftBank −15% as the AI selloff reaches Asia', outlet: 'Nikkei' },
  { n: 24, region: 'Africa', tag: 'KENYA', art: null, lon: 37.9, lat: -1.3, headline: 'Kenya picks a US-led group for Mrima Hill rare earths', outlet: 'Reuters' },
  { n: 25, region: 'Africa', tag: 'DR CONGO', art: null, lon: 30.1, lat: -1.9, headline: 'Rwanda calls the US approach to the DR Congo deal skewed', outlet: 'France 24' },
  { n: 26, region: 'Americas', tag: 'US COURTS', art: null, lon: -118.2, lat: 34.1, headline: 'Appeals court halts Venezuelan protected status order', outlet: 'AP' },
  { n: 27, region: 'Americas', tag: 'GUYANA', art: null, lon: -58.2, lat: 6.8, headline: 'A US official floated ceding Guyanese land to Venezuela', outlet: 'Reuters' },
  { n: 28, region: 'Americas', tag: 'WASHINGTON', art: null, lon: -77, lat: 38.9, headline: 'White House fires its national cyber director', outlet: 'France 24' },
  { n: 29, region: 'Oceania', tag: 'TONGA', art: null, lon: -175.2, lat: -21.1, headline: 'Tonga declares an emergency as the El Niño drought deepens', outlet: 'RNZ' },
  { n: 30, region: 'World', tag: 'UNITED NATIONS', art: null, lon: -74, lat: 40.7, headline: 'No UN secretary-general when Guterres leaves on 31 Dec', outlet: 'Reuters' },
  { n: 31, region: 'World', tag: 'VOYAGER 1', art: null, lon: null, lat: null, headline: 'Voyager 1 is now one light-day out, 25.9 billion km', outlet: 'NASA · CNN' }
];

export const NUMBERS = [
  { figure: '70 min', caption: 'The trilateral summit' },
  { figure: '34', caption: 'Killed in Martissant' },
  { figure: '$1.3tn', caption: 'Anthropic, day one' },
  { figure: '$2.36bn', caption: 'GTA VI, first day' },
  { figure: '165 km/h', caption: 'Cyclone Xavier winds' },
  { figure: '96–0', caption: 'Mongolia’s vote' }
];

// Broke Wednesday 18 November: named on the page, drawn nowhere.
export const EXCLUDED = [
  'The Fed minutes',
  'Bahrain and Kuwait intercepting drones',
  'UK inflation at 3.6%',
  'Jeffries winning the speaker nomination',
  'The EU’s €45bn loan for Kyiv',
  'Van Gogh’s $190.4m chestnut trees'
];

export function counts() {
  const c = {};
  for (const r of REGIONS) c[r] = 0;
  for (const s of STORIES) c[s.region] = (c[s.region] || 0) + 1;
  return c;
}

export function tally() {
  const c = counts();
  return Object.keys(c).reduce((t, k) => t + c[k], 0);
}
