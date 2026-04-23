// /api/trending.js — Vercel Serverless Function
// Scrapes TikTok Creative Center trending sounds for FR and US markets
 
const BASE = "https://ads.tiktok.com/business/creativecenter";
 
async function fetchHTML(url) {
  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!r.ok) return null;
  return r.text();
}
 
function extractNextData(html) {
  if (!html) return null;
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}
 
// Extract songs from the listing page __NEXT_DATA__ (SSR gives ~3 songs)
function extractListingSongs(nd, country, rankType) {
  const data = nd?.props?.pageProps?.data;
  if (!data?.soundList) return [];
  return data.soundList.map((s) => {
    // Build the analytics path from the song URL
    const urlMatch = s.url?.match(/\/song\/([^?/]+)/);
    const path = urlMatch ? urlMatch[1] : null;
    return {
      rank: s.rank,
      title: s.title,
      artist: s.author,
      path,
      duration: s.duration,
      promoted: s.promoted,
      trend: s.trend, // [{time, value}, ...]
      country,
      cat: rankType,
    };
  });
}
 
// Extract full analytics from a song detail page __NEXT_DATA__
function extractAnalytics(nd) {
  const d = nd?.props?.pageProps?.data;
  if (!d) return null;
  return {
    title: d.title,
    artist: d.author,
    rank: d.rank,
    rankDiff: d.rankDiff,
    duration: d.duration,
    promoted: d.promoted,
    trend: d.trend,
    audienceAges: d.audienceAges,
    audienceCountries: d.audienceCountries?.slice(0, 5)?.map((c) => ({
      score: c.score,
      country: c.countryInfo?.value,
      code: c.countryInfo?.label,
    })),
    audienceInterests: d.audienceInterests?.slice(0, 5)?.map((i) => ({
      score: i.score,
      interest: i.interestInfo?.value,
    })),
  };
}
 
async function scrapeListing(country, rankType) {
  const url = `${BASE}/inspiration/popular/music/pc/en?countryCode=${country}&period=7&rank_type=${rankType}`;
  const html = await fetchHTML(url);
  const nd = extractNextData(html);
  if (!nd) return [];
  return extractListingSongs(nd, country, rankType);
}
 
async function scrapeAnalytics(path, country) {
  const url = `${BASE}/song/${encodeURIComponent(path)}/pc/en?countryCode=${country}&period=7`;
  const html = await fetchHTML(url);
  const nd = extractNextData(html);
  if (!nd) return null;
  return extractAnalytics(nd);
}
 
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
 
  const startTime = Date.now();
  const results = { FR: [], US: [], lastUpdated: new Date().toISOString(), scrapeDuration: 0 };
 
  try {
    // Step 1: Fetch all 4 listing pages in parallel
    const [frPop, frBreak, usPop, usBreak] = await Promise.all([
      scrapeListing("FR", "popular"),
      scrapeListing("FR", "breakout"),
      scrapeListing("US", "popular"),
      scrapeListing("US", "breakout"),
    ]);
 
    // Combine and deduplicate per country
    const allFR = [...frPop, ...frBreak];
    const allUS = [...usPop, ...usBreak];
 
    const dedupe = (songs) => {
      const seen = new Map();
      for (const s of songs) {
        const key = s.title?.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (!seen.has(key)) seen.set(key, s);
      }
      return [...seen.values()];
    };
 
    const frSongs = dedupe(allFR);
    const usSongs = dedupe(allUS);
 
    // Step 2: Fetch analytics for each song (in parallel, batched by 5)
    const enrichSongs = async (songs, country) => {
      const enriched = [];
      for (let i = 0; i < songs.length; i += 5) {
        const batch = songs.slice(i, i + 5);
        const analytics = await Promise.all(
          batch.map((s) => (s.path ? scrapeAnalytics(s.path, country) : Promise.resolve(null)))
        );
        for (let j = 0; j < batch.length; j++) {
          const s = batch[j];
          const a = analytics[j];
          enriched.push({
            rank: s.rank,
            title: a?.title || s.title,
            artist: a?.artist || s.artist,
            change: null,
            approved: s.promoted === false ? false : true,
            trend: a?.trend || s.trend || [],
            topCountries: a?.audienceCountries?.map((c) => c.country) || [],
            topInterests: a?.audienceInterests?.map((i) => i.interest) || [],
            ages: a?.audienceAges?.map((ag) => ({
              pct: ag.score,
              range: ag.ageLevel === 1 ? "13-17" : ag.ageLevel === 2 ? "18-24" : ag.ageLevel === 3 ? "18-24" : ag.ageLevel === 4 ? "25-34" : ag.ageLevel === 5 ? "35-44" : ag.ageLevel === 6 ? "45-54" : "55+",
            })) || null,
            cat: s.cat,
          });
        }
      }
      return enriched;
    };
 
    results.FR = await enrichSongs(frSongs, "FR");
    results.US = await enrichSongs(usSongs, "US");
    results.scrapeDuration = Date.now() - startTime;
 
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}
 
