import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

# Load the dataset
df = pd.read_csv("NDVI_TimeSeries_CentralValley (2).csv")

# Assume columns: NDVI, Temp, Rainfall, Humidity (adjust if different)
features = ['NDVI', 'Temp', 'Rainfall', 'Humidity']
X = df[features].dropna()

# Fit scaler
scaler = StandardScaler()
scaler.fit(X)

# Save scaler
joblib.dump(scaler, 'scaler.pkl')
print("Scaler created and saved as scaler.pkl")
