const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://ads.tiktok.com/business/creativecenter/inspiration/popular/music/pc/en';

async function scrapeSounds(page, country, rankType) {
  const url = `${BASE}?countryCode=${country}&period=7`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // If we need breakout, click the Breakout tab
  if (rankType === 'breakout') {
    try {
      await page.click('text=Breakout', { timeout: 5000 });
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log(`Could not click Breakout for ${country}, skipping`);
      return [];
    }
  } else {
    await page.waitForTimeout(2000);
  }

  // Extract song data from the page DOM
  const songs = await page.evaluate((rankType) => {
    const results = [];
    
    // Get all "See analytics" links to find song paths
    const analyticsLinks = [...document.querySelectorAll('a')].filter(a => {
      const href = a.getAttribute('href') || '';
      return href.includes('/song/') && href.includes('countryCode');
    });
    
    const paths = analyticsLinks.map(a => {
      const href = a.getAttribute('href') || '';
      const match = href.match(/\/song\/([^?/]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    }).filter(Boolean);

    // Get text content to parse song info
    const main = document.querySelector('main');
    if (!main) return [];
    const lines = main.innerText.split('\n').filter(l => l.trim());
    const start = lines.indexOf('Actions') + 1;
    if (start === 0) return [];
    const end = lines.findIndex((l, i) => i > start && l.includes('data safety'));
    const sl = lines.slice(start, end > 0 ? end : lines.length);

    let i = 0;
    while (i < sl.length) {
      if (sl[i] === 'See analytics') {
        let j = i - 1;
        let approved = false;
        if (sl[j] === 'Approved for business use') { approved = true; j--; }
        const artist = sl[j]; j--;
        const title = sl[j]; j--;
        let change = null;
        if (j >= 0 && (sl[j] === 'NEW' || !isNaN(parseInt(sl[j])))) { change = sl[j]; j--; }
        const rank = parseInt(sl[j]);
        const idx = results.length;
        results.push({
          rank: isNaN(rank) ? idx + 1 : rank,
          title,
          artist,
          change: change || null,
          approved,
          path: paths[idx] || null,
          cat: rankType
        });
      }
      i++;
    }
    return results;
  }, rankType);

  return songs;
}

async function scrapeAnalytics(page, songPath, country) {
  const url = `https://ads.tiktok.com/business/creativecenter/song/${encodeURIComponent(songPath)}/pc/en?countryCode=${country}&period=7`;
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1500);

    // Extract __NEXT_DATA__ from the page
    const data = await page.evaluate(() => {
      const script = document.querySelector('#__NEXT_DATA__');
      if (!script) return null;
      try {
        const nd = JSON.parse(script.textContent);
        const d = nd?.props?.pageProps?.data;
        if (!d || d.statusCode) return null;
        return {
          trend: d.trend || [],
          audienceCountries: (d.audienceCountries || []).slice(0, 5).map(c => c.countryInfo?.value).filter(Boolean),
          audienceInterests: (d.audienceInterests || []).slice(0, 5).map(i => i.interestInfo?.value).filter(Boolean),
          audienceAges: (d.audienceAges || []).map(a => ({
            pct: a.score,
            range: a.ageLevel <= 2 ? '13-17' : a.ageLevel === 3 ? '18-24' : a.ageLevel === 4 ? '25-34' : a.ageLevel === 5 ? '35-44' : '45+'
          }))
        };
      } catch { return null; }
    });
    
    return data;
  } catch (e) {
    console.log(`Failed to get analytics for ${songPath}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('Starting TikTok Creative Center scraper...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  const results = { FR: [], US: [], lastUpdated: new Date().toISOString() };

  for (const country of ['FR', 'US']) {
    console.log(`\n--- Scraping ${country} ---`);
    const allSongs = [];

    for (const rankType of ['popular', 'breakout']) {
      console.log(`  ${rankType}...`);
      const songs = await scrapeSounds(page, country, rankType);
      console.log(`  Found ${songs.length} ${rankType} songs`);
      allSongs.push(...songs);
    }

    // Deduplicate
    const seen = new Map();
    for (const s of allSongs) {
      const key = s.title?.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seen.has(key)) seen.set(key, s);
    }
    const unique = [...seen.values()];
    console.log(`  ${unique.length} unique songs after dedup`);

    // Get analytics for each song (with rate limiting)
    for (let i = 0; i < unique.length; i++) {
      const s = unique[i];
      if (s.path) {
        console.log(`  Analytics ${i + 1}/${unique.length}: ${s.title}`);
        const analytics = await scrapeAnalytics(page, s.path, country);
        if (analytics) {
          s.trend = analytics.trend;
          s.topCountries = analytics.audienceCountries;
          s.topInterests = analytics.audienceInterests;
          s.ages = analytics.audienceAges?.length > 0 ? analytics.audienceAges : null;
        } else {
          s.trend = [];
          s.topCountries = [];
          s.topInterests = [];
          s.ages = null;
        }
      }
      // Small delay between requests
      await page.waitForTimeout(500);
    }

    results[country] = unique;
  }

  await browser.close();

  // Write results
  const outPath = path.join(__dirname, '..', 'data', 'trending.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  
  console.log(`\nDone! ${results.FR.length} FR songs, ${results.US.length} US songs`);
  console.log(`Saved to ${outPath}`);
}

main().catch(e => {
  console.error('Scraper failed:', e);
  process.exit(1);
});
