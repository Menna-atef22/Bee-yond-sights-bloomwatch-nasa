import pandas as pd
import numpy as np

# Load the data
df = pd.read_csv('DesertRisk_Predictions.csv')

# Add random lat/lon for MENA region
# MENA bounds: lat 12-37, lon -5 to 63
np.random.seed(42)  # For reproducibility
df['latitude'] = np.random.uniform(12, 37, len(df))
df['longitude'] = np.random.uniform(-5, 63, len(df))

# Save as new CSV
df.to_csv('DesertRisk_WithCoords.csv', index=False)

# Convert to GeoJSON
geojson = {
    "type": "FeatureCollection",
    "features": []
}

for _, row in df.iterrows():
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [row['longitude'], row['latitude']]
        },
        "properties": {
            "PredictedRisk": row['PredictedRisk'],
            "NDVI": row['NDVI'],
            "EVI": row['EVI'],
            "Rainfall": row['Rainfall'],
            "Temperature": row['Temperature'],
            "SoilMoisture": row['SoilMoisture'],
            "Evapotranspiration": row['Evapotranspiration'],
            "FireIndex": row['FireIndex'] if not pd.isna(row['FireIndex']) else 0,
            "elevation": row['elevation']
        }
    }
    geojson["features"].append(feature)

import json
with open('DesertRisk.geojson', 'w') as f:
    json.dump(geojson, f)

print("Data preprocessed and saved as DesertRisk_WithCoords.csv and DesertRisk.geojson")
