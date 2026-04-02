const fs = require('fs');
const axios = require('axios');
const xml2js = require('xml2js');

const TRENDS_URL = 'https://trends.google.com/trending/rss?geo=NG';
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
        const dateString = new Date().toLocaleDateString('en-NG', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });

        items.slice(0, 18).forEach(item => {
            const seed = item.title[0];
            const mod = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
            const longTail = `${seed} ${mod}`;
            
            cardsHtml += `
            <div class="group p-6 rounded-xl border border-[#228b22]/30 bg-[#111] hover:border-[#d4af37] transition-all duration-300 shadow-lg">
                <div class="text-[#d4af37] text-xs font-mono mb-2 uppercase tracking-tighter">Daily Intent</div>
                <h2 class="text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">${longTail}</h2>
                <p class="text-gray-500 text-sm mt-3 leading-relaxed">Analyzing search volume for "${seed}" across Nigeria to optimize your digital marketing conversion.</p>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-[10px] text-[#228b22] font-bold uppercase">Active Trend</span>
                    <button onclick="navigator.clipboard.writeText('${longTail}')" class="text-[10px] bg-[#228b22]/10 hover:bg-[#228b22] text-[#228b22] hover:text-white px-3 py-1 rounded transition">Copy Tag</button>
                </div>
            </div>`;
        });

        const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NG Trend Magnet | SEO Discovery ${dateString}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background-color: #050505; color: #e5e5e5; }</style>
</head>
<body class="antialiased">
    <div class="max-w-6xl mx-auto px-6 py-12">
        <header class="mb-16 border-l-4 border-[#d4af37] pl-6">
            <h1 class="text-5xl font-black text-white tracking-tighter uppercase">Trend <span class="text-[#228b22]">Magnet</span></h1>
            <p class="text-gray-400 mt-2 font-light">Automated Long-tail Keyword Generation for Nigeria.</p>
            <p class="text-[#d4af37] text-xs mt-1 font-mono">${dateString}</p>
        </header>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${cardsHtml}</div>
    </div>
</body>
</html>`;

        fs.writeFileSync('index.html', finalHtml);
        console.log("Website updated successfully.");
    } catch (err) {
        console.error("Error:", err);
    }
}
startDiscovery();
