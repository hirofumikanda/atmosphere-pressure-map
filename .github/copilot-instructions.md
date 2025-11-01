# Atmosphere Pressure Map - AI Assistant Instructions

## Project Overview
This is a React TypeScript web application that visualizes 24-hour time-series atmospheric pressure data using MapLibre GL. The app displays NOAA GFS pressure data as both color-relief terrain maps and isobar contour lines using PMTiles format, with an interactive time slider for temporal navigation.

## Architecture & Data Flow

### Core Components
- **App.tsx** → **MapView.tsx** → **TimeSlider.tsx** + **useMap.ts**: Component hierarchy with time control
- **useMap.ts**: Single source of truth for map initialization, layer visibility control, and isobar interaction
- **TimeSlider.tsx**: Interactive time control component with responsive design
- **style.json**: MapLibre style definition with 24 time-based pressure visualization layers

### Data Sources & Time Series Structure
- **prmsl_hpa_terrainrgb_20251101_XXX.pmtiles**: 24 hourly pressure datasets (000-023) in terrainRGB format (980-1040 hPa range)
- **prmsl_isobar_20251101_XXX.pmtiles**: 24 hourly vector isobar datasets with `prmsl` property
- Data sourced from NOAA Global Forecast System (GFS) for 2025/11/01
- Each dataset represents one hour of forecast data (UTC 00:00-23:00)

### Key Technical Patterns

#### PMTiles Integration
```typescript
// Protocol registration is required in useMap.ts
const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);
```
- URLs use `pmtiles://` protocol in style.json
- Base path matches `vite.config.ts` base setting: `/atmosphere-pressure-map/`

#### Time-Series Layer Management
- 24 layer groups: each hour has pressure-relief, isobar, and isobar-label layers
- Layer naming: `pressure-relief_XXX`, `isobar_XXX`, `isobar-label_XXX` (XXX = 000-023)
- Visibility controlled via `setTimeLayerVisibility()` function in useMap.ts
- Only one time slice visible at a time; all others set to `visibility: 'none'`

#### Interactive Isobar Features
- Click handlers on all isobar layers show pressure popup with time information
- Cursor changes to pointer on hover over isobars
- Popup displays: pressure value (hPa), current time (UTC format)
- Event handlers dynamically attached to all 24 isobar layers on map load

#### Style Layer Structure (per time slice)
1. **mono**: Background raster tiles from MIERUNE (shared)
2. **pressure-relief_XXX**: Color-coded pressure visualization using `color-relief` type
3. **isobar_XXX**: Vector line layer with conditional styling (20 hPa intervals = thick lines)
4. **isobar-label_XXX**: Symbol layer for pressure values on major isobars only

#### Pressure Color Mapping
- Blue (980 hPa) → White (1013 hPa) → Red (1040 hPa)
- Uses linear interpolation with `["elevation"]` for terrainRGB data
- Property access: `["get", "prmsl"]` for vector isobar data

## Development Workflows

### Local Development
```bash
npm run dev        # Vite dev server
npm run build      # TypeScript + Vite build
npm run preview    # Preview built app
```

### Deployment
```bash
npm run deploy     # Builds and deploys to GitHub Pages
```
- Configured for `hirofumikanda.github.io/atmosphere-pressure-map`
- Base path in `vite.config.ts` must match repository name

## Project-Specific Conventions

### Time Control Implementation
- State managed in MapView component: `currentTime` (0-23)
- Time changes trigger layer visibility updates via `setTimeLayerVisibility()`
- TimeSlider component handles UI interaction and responsive design
- Time format: UTC hours displayed as "UTC時刻: 2025/11/01 XX:00"

### Map Configuration
- Default center: `[139.8, 35.9]` (Japan region)
- Zoom range: 0-18, default zoom: 2
- Hash routing enabled for shareable URLs
- Interactive popup system for pressure value display

### Data Property Names
- Isobar pressure values: `prmsl` (not `pressure`)
- 20 hPa major intervals: Use modulo `["%", ["get", "prmsl"], 20]` for styling
- Time series filename pattern: `_YYYYMMDD_XXX.pmtiles` where XXX = 000-023

### Responsive Design Patterns
- TimeSlider uses CSS media queries for mobile/tablet/desktop layouts
- Mobile: larger touch targets, simplified time markers
- Dark mode support via `prefers-color-scheme: dark`
- Touch device specific styling with `hover: none` and `pointer: coarse`

### File Organization
- Styles in `public/styles/` (not `src/`)
- PMTiles data in `public/data/`
- Custom CSS modules in `src/styles/`
- Fonts served from `public/font/` with specific directory structure

## Critical Dependencies
- **maplibre-gl**: Map rendering engine
- **pmtiles**: Efficient tile format for large datasets
- **weatherlayers-gl**: Weather visualization utilities
- **@deck.gl/mapbox**: Advanced visualization layers (available but not used yet)

## Common Tasks

### Time-Series Data Management
- Add new time slice: Update style.json sources (both terrainRGB and vector)
- Add corresponding layers for pressure-relief, isobar, and isobar-label
- Update `setTimeLayerVisibility()` loop range in useMap.ts
- Ensure all new isobar layers get event handlers attached

### Pressure Data Updates
- Replace PMTiles files in `public/data/` following naming convention
- Update attribution in style.json sources with new date
- Verify pressure range matches color-relief scale (980-1040 hPa)
- Test time slider functionality across all hours

### Styling Pressure Visualizations
- Color-relief uses `["elevation"]` for raster-dem sources
- Vector layers use `["get", "prmsl"]` for property access
- Major isobars: multiples of 20 hPa get emphasized styling
- Consider layer ordering: mono → pressure-relief → isobar → isobar-label

### UI Component Modifications
- TimeSlider responsive breakpoints: 1024px, 768px, 480px, 320px
- Popup styling in `src/styles/popup.css` with Japanese text support
- MapView handles time state and passes down to TimeSlider
- CSS modules pattern: each component has dedicated stylesheet