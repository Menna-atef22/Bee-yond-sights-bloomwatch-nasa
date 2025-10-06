# TODO: Enhance DesertRisk Page to "How the Map Shows Data"

## Approved Plan Steps
- [x] Move data files to public/data/: DesertRisk.geojson, DesertRisk_WithCoords.csv, feature_correlation_matrix.png, feature_distributions.png, key_scatter_plots.png
- [x] Update DesertRisk.jsx: Change fetch to '/data/DesertRisk.geojson' and img src to '/data/...'
- [x] Add multi-sliders: Temperature min/max, Rainfall min/max, NDVI range (state, UI, onChange to filter data)
- [x] Implement true heatmap: Use leaflet.heat for PredictedRisk layer (toggle via viewMode)
- [ ] Add layer controls: Checkbox group for toggling layers (NDVI, FireIndex, etc.) independently
- [ ] Enhance popups: Show all features with risk summary
- [ ] Update charts: Add radar chart for selected point vs averages, add Temp vs Risk scatter, tie all to filteredData
- [ ] Dynamic updates: On slider/layer change, update map layers and recompute charts
- [ ] Fix colors: Use chroma-js for smooth scales
- [ ] Add MENA bounds: Set map bounds for better centering
- [ ] Test: Verify map loads, filters work, charts update, images display
