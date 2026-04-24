// /api/scrape.js — Fetch TikTok Creative Center trending sounds

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const country = req.query.country || "FR";
  const url = `https://ads.tiktok.com/business/creativecenter/inspiration/popular/music/pc/en?countryCode=${country}&period=7`;

  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Sec-Ch-Ua": '"Chromium";v="126", "Google Chrome";v="126", "Not-A.Brand";v="8"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "Referer": "https://www.google.com/",
      },
    });

    const html = await r.text();
    
    // Extract __NEXT_DATA__
    const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!m) {
      return res.status(200).json({ 
        ok: false, 
        reason: "no_next_data",
        httpStatus: r.status,
        htmlLength: html.length,
        preview: html.substring(0, 500)
      });
    }

    const nextData = JSON.parse(m[1]);
    const pageData = nextData?.props?.pageProps;
    
    // Check for TikTok error
    if (pageData?.statusCode && pageData.statusCode !== 200) {
      return res.status(200).json({
        ok: false,
        reason: "tiktok_error",
        statusCode: pageData.statusCode,
        country
      });
    }

    const soundList = pageData?.data?.soundList || [];
    
    const songs = soundList.map(s => {
      const urlMatch = s.url?.match(/\/song\/([^?/]+)/);
      return {
        rank: s.rank,
        title: s.title,
        artist: s.author,
        path: urlMatch ? urlMatch[1] : null,
        trend: s.trend || [],
        cat: "popular",
        approved: !s.promoted,
        change: null,
        topCountries: [],
        topInterests: [],
        ages: null,
      };
    });

    res.status(200).json({
      ok: true,
      country,
      count: songs.length,
      songs,
      totalAvailable: pageData?.data?.pagination?.total || null,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
