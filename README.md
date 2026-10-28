# saudi-boundaries

Simplified boundary GeoJSON files for Saudi Arabia, used as a dynamic reference layer in the Azure Maps visual in Power BI.

| Path | Contents | Coloured children (`Idx`) |
|---|---|---|
| `boundaries/country.json` | 16 Admin2 areas (education directorates) with governorate borders | Admin2 areas |
| `boundaries/admin2/<Admin2_Code>.json` | One Admin2 area: its governorates, thin district borders, other areas as grey outlines | Governorates |
| `boundaries/gov/<Governorate_ID>.json` | One governorate with its districts, Admin2 areas as grey outlines | Districts |
| `boundaries/dist/<District_ID>.json` | One district with its governorate outline | The district (`Idx` 0) |

`Idx` matches `Boundaries[Child_Index]` in the Power BI table. Coordinates are WGS84 (EPSG:4326).
Each feature has `Shape_ID`, `Level`, `Name` and Azure Maps style properties.

`worker/worker.js` is a Cloudflare Worker that serves these files with `fillColor` set from values passed in `?v=` (0-100, "."-separated, in `Idx` order), on a light-to-dark green scale.
