const fs = require('fs');
const axios = require('axios');
const xml2js = require('xml2js');

const TRENDS_URL = 'https://trends.google.com/trending/rss?geo=NG';
const SITE_URL = 'https://yourname.github.io/repo-name/'; // <-- CHANGE THIS TO YOUR URL

const MODIFIERS = [
    "strategy for Nigerian creators",
    "how to use for lead generation",
    "latest updates and news in Nigeria",
    "guide for small business owners",
    "free tools and alternatives",
    "how to rank easily for",
    "market trends for April 2026"
];

async function startDiscovery() {
    try {
        console.log("Fetching Nigerian Trends...");
        const response = await axios.get(TRENDS_URL);
        const result = await xml2js.parseStringPromise(response.data);
        const items = result.rss.channel[0].item;

        let cardsHtml = '';
        const now = new Date();
        const dateString = now.toLocaleDateString('en-NG', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });

        items.forEach((item, index) => {
            const seed = item.title[0];
            const mod = MODIFIERS[index % MODIFIERS.length];
            const longTail = `${seed} ${mod}`;
            
            cardsHtml += `
            <div class="group p-6 rounded-xl border border-[#228b22]/30 bg-[#111] hover:border-[#d4af37] transition-all duration-300 shadow-lg">
                <h2 class="text-xl font-bold text-white group-hover:text-[#d4af37]">${longTail}</h2>
                <p class="text-gray-500 text-sm mt-3 italic">Optimizing for "${seed}" search volume.</p>
                <button onclick="navigator.clipboard.writeText('${longTail}')" class="mt-4 text-[10px] text-[#228b22] font-bold uppercase">Copy Keyword</button>
            </div>`;
        });

        // 1. GENERATE INDEX.HTML
        const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
     <meta name="google-site-verification" content="LV6ECm0Ym2rY6KImE0r8aRWAlEut1y4s1hywiVC0pTY" />
    <meta name="google-site-verification" content="YOUR_SEARCH_CONSOLE_TAG_HERE" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NG Trend Magnet | SEO Discovery ${dateString}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background-color: #050505; color: #e5e5e5; }</style>
</head>
<body class="antialiased p-8">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-black text-white uppercase mb-8">Trend <span class="text-[#228b22]">Magnet</span></h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${cardsHtml}</div>
    </div>
</body>
</html>`;

        fs.writeFileSync('index.html', finalHtml);

        // 2. GENERATE SITEMAP.XML
        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}</loc>
        <lastmod>${now.toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`;

        fs.writeFileSync('sitemap.xml', sitemapXml);
        console.log("Success: index.html and sitemap.xml generated.");

    } catch (err) {
        console.error("Error:", err);
    }
}

startDiscovery();
