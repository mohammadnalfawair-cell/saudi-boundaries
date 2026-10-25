# saudi-boundaries

Simplified boundary GeoJSON files for Saudi Arabia, used as a dynamic reference layer in the Azure Maps visual in Power BI.

| Path | Contents |
|---|---|
| `boundaries/country.json` | 16 Admin2 areas (education directorates) with governorate borders |
| `boundaries/admin2/<Admin2_Code>.json` | One Admin2 area with its governorates and districts, other areas as grey outlines |
| `boundaries/gov/<Governorate_ID>.json` | One governorate with its districts, Admin2 areas as grey outlines |

Coordinates are WGS84 (EPSG:4326). Each feature has `Shape_ID`, `Level`, `Name` and Azure Maps style properties (`fillColor`, `fillOpacity`, `strokeColor`, `strokeWidth`, `strokeOpacity`).

Raw base URL: `https://raw.githubusercontent.com/mohammadnalfawair-cell/saudi-boundaries/main/boundaries/`
