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

31 stories in total, 13 of them drawn.

## Read at 300 px

The bounty judge views the sheet at about 300 px across, where a 1024 px page is
reduced to 0.293x. Every size on the page was set against that: no text is smaller
than 8.2 px, card headlines are 13 px, lead headlines 21 px, briefs 9.2 px in two
columns, and the region tally and numbers strip carry 11.5 px and 16.5 px figures.
`node compose.mjs` prints a font-size histogram, the smallest size in use, and a
per-card overflow check, so the floor is measured rather than assumed. The briefs
rail was cut from 24 items to 18 to pay for the larger type.

## Build

```sh
node compose.mjs         # news.mjs + art.mjs -> page.html, renders page.png, prints geometry
cp page.png entry.png
MAKEFUN_OUTPUT_DIR=./out node --experimental-strip-types main.ts
```

`compose.mjs` drives headless Chrome over CDP (`--headless=new`), captures a
1024x1024 screenshot, and prints every block's top/height/bottom, the height each
band actually wants, every art box's aspect ratio, a font-size histogram, plus any
truncated brief, clipped block, overflowing card or text under 8.2 px, so the layout
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
