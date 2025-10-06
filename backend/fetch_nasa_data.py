import requests
import pandas as pd
import os

# Function to fetch climate data from NASA POWER API
def fetch_climate_data(lat, lon, start, end):
    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "start": start,
        "end": end,
        "latitude": lat,
        "longitude": lon,
        "parameters": "T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN",
        "community": "AG",
        "format": "JSON"
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        df = pd.DataFrame(data['properties']['parameter'])
        df.index = pd.to_datetime(df.index)
        return df
    else:
        raise Exception("Failed to fetch climate data")

# Function to fetch NDVI from MODIS via Google Earth Engine (requires authentication)
def fetch_ndvi_gee(lat, lon, start_date, end_date):
    # Note: Requires ee.Initialize() with user credentials
    try:
        ee.Initialize()
        point = ee.Geometry.Point([lon, lat])
        modis = ee.ImageCollection('MODIS/006/MOD13Q1').select('NDVI')
        ndvi_series = modis.filterBounds(point).filterDate(start_date, end_date)
        # This is simplified; actual extraction requires more processing
        # For full implementation, see original example
        print("NDVI fetch via GEE requires full implementation.")
        return None
    except Exception as e:
        print(f"GEE NDVI fetch failed: {e}")
        return None

# Example usage
if __name__ == "__main__":
    # Fetch climate for Central Valley
    lat, lon = 38.5, -121.5
    start, end = "20200101", "20201231"
    climate_df = fetch_climate_data(lat, lon, start, end)
    climate_df.to_csv("climate_data.csv")
    print("Climate data saved to climate_data.csv")
