// Fallback font
(function (document) {
    var width;
    var body = document.body;

    var container = document.createElement("span");
    container.innerHTML = Array(100).join("wi");
    container.style.cssText = [
        "position:absolute",
        "width:auto",
        "font-size:128px",
        "left:-99999px",
    ].join(" !important;");

    var getWidth = function (fontFamily) {
        container.style.fontFamily = fontFamily;

        body.appendChild(container);
        width = container.clientWidth;
        body.removeChild(container);

        return width;
    };

    // Pre compute the widths of monospace, serif & sans-serif
    // to improve performance.
    var monoWidth = getWidth("monospace");
    var serifWidth = getWidth("serif");
    var sansWidth = getWidth("sans-serif");

    window.isFontAvailable = function (font) {
        return (
            monoWidth !== getWidth(font + ",monospace") ||
            sansWidth !== getWidth(font + ",sans-serif") ||
            serifWidth !== getWidth(font + ",serif")
        );
    };
})(document);

setTimeout(() => {
    if (!isFontAvailable("MS UI Gothic")) {
        const root = document.querySelector(":root");
        root.style.setProperty("--font-size", "12px");
    }
}, 10);

// GoatCounter public visitor counter (requires "Allow adding visitor counts
// on your website" in GoatCounter settings). Responses are cached for up to
// four hours on GoatCounter's side, so there's no point polling often.
const GOATCOUNTER = "https://jeffock.goatcounter.com/counter/TOTAL.json";

async function fetchCount(query) {
    const response = await fetch(GOATCOUNTER + (query ? "?" + query : ""));
    // 404 means no visitors recorded yet for that range
    if (response.status === 404) return "0";
    if (!response.ok) throw new Error("GoatCounter returned " + response.status);
    const data = await response.json();
    // count is a formatted string like "1,234"; strip separators for the display
    return String(data.count).replace(/[^0-9]/g, "") || "0";
}

// Update one counter independently, retrying once on a network blip
async function updateCounter(id, query) {
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            document.getElementById(id).textContent = await fetchCount(query);
            return;
        } catch (error) {
            if (attempt === 1) console.error("Error fetching " + id + " count:", error);
        }
    }
}

function updateMetrics() {
    const today = new Date().toISOString().slice(0, 10);
    updateCounter("total", "");
    updateCounter("today", "start=" + today);
}

updateMetrics();
setInterval(updateMetrics, 15 * 60 * 1000);
