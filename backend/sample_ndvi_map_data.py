import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_sample_ndvi_data():
    # Generate sample dates for 2025
    start_date = datetime(2025, 1, 1)
    dates = [start_date + timedelta(days=i) for i in range(30)]  # 30 days

    # Sample locations: South and North CA points
    locations = [
        {'lat': 34.7, 'lon': -117.9, 'region': 'South CA'},  # South
        {'lat': 35.0, 'lon': -117.8, 'region': 'South CA'},
        {'lat': 38.5, 'lon': -121.5, 'region': 'North CA'},  # North
        {'lat': 38.0, 'lon': -121.0, 'region': 'North CA'},
    ]

    data = []
    for date in dates:
        for loc in locations:
            # Simulate NDVI: higher in North, varying over time
            base_ndvi = 0.3 + (0.1 if loc['region'] == 'North CA' else 0)
            ndvi_variation = np.random.uniform(-0.05, 0.15)  # Daily variation
            ndvi = max(0, min(1, base_ndvi + ndvi_variation + np.sin((date.day - 1) / 30 * np.pi) * 0.2))

            # Bloom phase
            if ndvi > 0.5:
                bloom_phase = 'Full Bloom'
            elif ndvi > 0.2:
                bloom_phase = 'Early Bloom'
            else:
                bloom_phase = 'No Bloom'

            data.append({
                'date': date.strftime('%Y-%m-%d'),
                'lat': loc['lat'],
                'lon': loc['lon'],
                'ndvi': round(ndvi, 3),
                'bloom_phase': bloom_phase,
                'region': loc['region']
            })

    df = pd.DataFrame(data)
    return df.to_dict('records')

if __name__ == "__main__":
    sample_data = generate_sample_ndvi_data()
    pd.DataFrame(sample_data).to_csv('sample_ndvi_map_data.csv', index=False)
    print("Sample NDVI map data generated and saved to sample_ndvi_map_data.csv")
