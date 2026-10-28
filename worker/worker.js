// Cloudflare Worker: colours Saudi boundary GeoJSON by value for the Azure Maps reference layer in Power BI.
//
// Request:  https://<your-worker>.workers.dev/<file>.json?v=73.81..45
//   <file>  country | admin2/SA01 | gov/100 | dist/1022115   (same paths as the GitHub repo)
//   v       values 0-100 separated by "." in Child_Index order; an empty slot = no data (grey)
// Response: the GeoJSON file with fillColor / fillOpacity set on every feature that has an Idx property.

const SOURCE = "https://raw.githubusercontent.com/mohammadnalfawair-cell/saudi-boundaries/main/boundaries/";

// Light -> dark green (higher value = better)
const STOPS = [
  [0,   [247, 252, 245]],
  [25,  [199, 233, 192]],
  [50,  [116, 196, 118]],
  [75,  [35, 139, 69]],
  [100, [0, 68, 27]],
];
const NO_DATA = { fillColor: "#BFC5CC", fillOpacity: 0.35 };
const FILL_OPACITY = 0.75;
const PATH_OK = /^(country|admin2\/SA\d{2}|gov\/\d{1,5}|dist\/[A-Za-z0-9_]{1,40})\.json$/;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

function colour(v) {
  v = Math.max(0, Math.min(100, v));
  for (let i = 1; i < STOPS.length; i++) {
    const [x1, c1] = STOPS[i];
    if (v <= x1) {
      const [x0, c0] = STOPS[i - 1];
      const t = (v - x0) / (x1 - x0);
      const c = c0.map((a, k) => Math.round(a + (c1[k] - a) * t));
      return "#" + c.map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
    }
  }
  return "#00441B";
}

function parseValues(s) {
  if (!s) return [];
  return s.split(".").map((x) => {
    if (x === "") return null;
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  });
}

export function applyValues(geojson, values) {
  for (const f of geojson.features || []) {
    const p = f.properties || {};
    if (typeof p.Idx !== "number") continue;
    const v = p.Idx < values.length ? values[p.Idx] : null;
    if (v === null || v === undefined) {
      Object.assign(p, NO_DATA);
      delete p.Value;
    } else {
      p.fillColor = colour(v);
      p.fillOpacity = FILL_OPACITY;
      p.Value = v;
    }
    f.properties = p;
  }
  return geojson;
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    if (!PATH_OK.test(path)) {
      return new Response("Not found", { status: 404, headers: CORS });
    }
    const src = await fetch(SOURCE + path, { cf: { cacheTtl: 3600, cacheEverything: true } });
    if (!src.ok) return new Response("Source file not found", { status: 404, headers: CORS });
    const geojson = await src.json();
    applyValues(geojson, parseValues(url.searchParams.get("v")));
    return new Response(JSON.stringify(geojson), {
      headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=300" },
    });
  },
};
