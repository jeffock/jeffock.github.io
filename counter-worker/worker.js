// Cloudflare Worker for the hitcounter, with a D1 database bound as DB.
// One-time table setup (run in the D1 console):
//   CREATE TABLE counts (visits INTEGER NOT NULL, uniques INTEGER NOT NULL);
//   INSERT INTO counts VALUES (0, 0);
// POST counts a visit (?new=1 also counts a unique visitor); GET just reads.
// shortcut: anyone can POST to inflate the numbers, add rate limiting if that ever happens.
export default {
    async fetch(request, env) {
        const isNew = new URL(request.url).searchParams.get("new") === "1" ? 1 : 0;
        const row = request.method === "POST"
            ? await env.DB.prepare("UPDATE counts SET visits = visits + 1, uniques = uniques + ?1 RETURNING visits, uniques").bind(isNew).first()
            : await env.DB.prepare("SELECT visits, uniques FROM counts").first();
        return Response.json(row, { headers: { "Access-Control-Allow-Origin": "https://jeffock.net" } });
    },
};
