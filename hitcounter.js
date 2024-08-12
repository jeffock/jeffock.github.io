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
// Function to fetch data from your Supabase Edge Function
async function fetchPlausibleData() {
    try {
        const response = await fetch('https://fathomless-scrubland-86700-da348ae19a5a.herokuapp.com/https://orngevkmucghqisxqeas.supabase.co/functions/v1/papi-service', { // Replace with your function URL
            method: 'GET', // Or 'POST' if your function expects POST requests
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

async function fetchPlausibleData() {
    try {
        const response = await fetch('https://plausible.io/jeffock.net'); // Public dashboard URL

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse HTML response
        const text = await response.text();

        // Create a temporary DOM element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        console.log(doc);

        // For example, if data is HTML, you might extract information using DOM parsing
        // If data is JSON, parse it directly
        // Example below assumes data is HTML and contains specific text

        // Simulated extraction, replace with actual extraction logic
        const totalVisitors = '0'; // Replace with actual extraction
        const uniqueVisitors = '0'; // Replace with actual extraction
        const currentVisitors = '0'; // Replace with actual extraction

        //https://plausible.io/jeffock.net?period=all&keybindHint=A
        //"unique visitor": id=visitors
        //"total visits": id=visits
        //"total pageviews": id=pageviews
        //https://plausible.io/jeffock.net?period=realtime&keybindHint=R
        //"current visitors": class="font-bold text-xl dark:text-gray-100"

        document.getElementById('total').innerText = totalVisitors;
        document.getElementById('unique').innerText = uniqueVisitors;
        document.getElementById('online').innerText = currentVisitors;

    } catch (error) {
        console.error('Error fetching Plausible data:', error);
        document.getElementById('total').innerText = 'Error';
        document.getElementById('unique').innerText = 'Error';
        document.getElementById('online').innerText = 'Error';
    }
}

// Fetch and display data on page load
fetchPlausibleData();
// set interval ms
setInterval(fetchPlausibleData, 60000);
*/

async function updateMetrics() {
    try {
        // Fetch data from the Supabase Edge Function
        const response = await fetch('https://fathomless-scrubland-86700-da348ae19a5a.herokuapp.com/https://orngevkmucghqisxqeas.supabase.co/functions/v1/papi-service');
        const data = await response.json();

        if (response.ok) {
            // Update the HTML elements with the fetched data
            document.getElementById('online').textContent = data.online || '0';
            document.getElementById('total').textContent = data.pageviews || '0';
            document.getElementById('unique').textContent = data.visitors || '0';
        } else {
            console.error('Error fetching data:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function to update metrics
updateMetrics();

// Optionally, set up an interval to update the metrics periodically
setInterval(updateMetrics, 5 * 60 * 1000); // Update every 5 minutes

