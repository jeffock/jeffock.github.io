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

/**
setInterval(() => {
    fetch("https://dimden.dev/services/hitcounter/raw")
        .then((i) => i.text())
        .then((i) => {
            let [hits, visitors, online] = i.split(",");
            document.getElementById("hits").innerText = hits;
            document.getElementById("visitors").innerText = visitors;
            document.getElementById("online").innerText = online;
        });
}, 5000);
**/

// Function to fetch data from your Supabase Edge Function
async function fetchPlausibleData() {
    try {
        const response = await fetch('https://orngevkmucghqisxqeas.supabase.co/functions/v1/papi-service', { // Replace with your function URL
            method: 'GET', // Or 'POST' if your function expects POST requests
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        updateMetrics(data);
    } catch (error) {
        console.error('Error fetching Plausible data:', error);
        document.getElementById('total').innerText = 'Error';
        document.getElementById('unique').innerText = 'Error';
        document.getElementById('online').innerText = 'Error';
    }
}

// Function to update the metrics in the HTML
function updateMetrics(data) {
    document.getElementById('total').innerText = data.total_visitors || 'N/A';
    document.getElementById('unique').innerText = data.unique_visitors || 'N/A';
    document.getElementById('online').innerText = data.current_visitors || 'N/A';
}

// Fetch and display data on page load
fetchPlausibleData();
// set interval ms
setInterval(fetchPlausibleData, 60000);

