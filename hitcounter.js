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

// Cloudflare Worker counter, source in counter-worker/worker.js
const COUNTER = "https://hitcounter.jeffock1656.workers.dev";

async function updateMetrics(method) {
    let url = COUNTER;
    if (method === "POST") {
        // localStorage can throw when storage is blocked; then just don't count as unique
        try { if (!localStorage.getItem("counted")) url += "?new=1"; } catch {}
    }
    try {
        const response = await fetch(url, { method });
        if (!response.ok) throw new Error("Counter returned " + response.status);
        const data = await response.json();
        if (url.endsWith("?new=1")) try { localStorage.setItem("counted", "1"); } catch {}
        document.getElementById("total").textContent = data.visits;
        document.getElementById("unique").textContent = data.uniques;
    } catch (error) {
        console.error("Error fetching visitor counts:", error);
    }
}

// count this visit once, then just refresh the numbers
updateMetrics("POST");
setInterval(() => updateMetrics("GET"), 60 * 1000);
