// /api/trending.js — CORS Proxy for TikTok Creative Center
// The client (artifact) calls this proxy to bypass CORS restrictions
// The proxy fetches the Creative Center page and returns the __NEXT_DATA__ JSON

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const targetUrl = req.query.url;
  if (!targetUrl || !targetUrl.includes("ads.tiktok.com")) {
    return res.status(400).json({ ok: false, error: "Missing or invalid url parameter. Must be an ads.tiktok.com URL." });
  }

  try {
    const r = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const html = await r.text();
    
    // Extract __NEXT_DATA__
    const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (m) {
      const nextData = JSON.parse(m[1]);
      return res.status(200).json({ ok: true, data: nextData.props?.pageProps?.data || null });
    }

    return res.status(200).json({ 
      ok: false, 
      reason: "no_next_data", 
      httpStatus: r.status,
      htmlLength: html.length,
      preview: html.substring(0, 300) 
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
 
