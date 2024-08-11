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

// env secret format: const var = process.env.NAME_OF_VAR;

gapi.load('client:auth2', () => {
    gapi.client.init({
        //TEMP
        apiKey: '',
        //TEMP
        clientId: '',
        discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
    }).then(() => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
            queryReports();
        });
    });
});

function queryReports() {
    gapi.client.analyticsreporting.reports.batchGet({
        reportRequests: [
            {
                //TEMP
                viewId: '',
                dateRanges: [{ startDate: '2024-08-10', endDate: 'today' }],
                metrics: [{ expression: 'ga:users' }],
                dimensions: [{ name: 'ga.pageTitle' }],
            },
        ],
    }).then(response => {
        const data = response.result.reports[0].data;
        const pageTitles = data.rows.map(row => row.dimensions[0]);

        // Render data 
        document.getElementById('pagetitle').innerHTML = pageTitles.join('<br>');
    }).catch(error => {
        console.error('Error fetching data', error);
    });
}
