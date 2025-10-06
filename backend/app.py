 # backend/app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model, Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import os
import requests
import plotly.express as px

app = Flask(__name__)
CORS(app)

# -------------------------------
# 1️⃣ Load NDVI CSV
# -------------------------------
csv_path = "NDVI_TimeSeries_CentralValley (2).csv"
if not os.path.exists(csv_path):
    raise FileNotFoundError(f"CSV file not found: {csv_path}")

df_ndvi = pd.read_csv(csv_path)

# Create 'date' column from month and year
df_ndvi['date'] = pd.to_datetime(df_ndvi[['year', 'month']].assign(day=1))
df_ndvi.sort_values('date', inplace=True)

# -------------------------------
# 2️⃣ Load LSTM model
# -------------------------------
model_path = "ndvi_climate_model1.h5"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found: {model_path}")

# Fix for older H5 metrics issue
model = load_model(model_path, custom_objects={'mse': tf.keras.metrics.MeanSquaredError()})

# -------------------------------
# 3️⃣ Preprocess NDVI data
# -------------------------------
scaler = MinMaxScaler(feature_range=(0, 1))
ndvi_scaled = scaler.fit_transform(df_ndvi[['NDVI']].values)  # Make sure your CSV has 'NDVI' column

def create_sequences(data, seq_length=30):
    X = []
    for i in range(len(data) - seq_length):
        X.append(data[i:i + seq_length])
    return np.array(X)

seq_length = 30
X_input = create_sequences(ndvi_scaled, seq_length)

# -------------------------------
# 4️⃣ API endpoints
# -------------------------------

@app.route('/')
def home():
    return jsonify({"message": "Bloom-Watch API is running!"})

@app.route('/predict', methods=['GET'])
def predict():
    # Predict next NDVI
    last_sequence = X_input[-1].reshape(1, seq_length, 1)
    pred_scaled = model.predict(last_sequence)
    pred_ndvi = scaler.inverse_transform(pred_scaled)
    return jsonify({"predicted_ndvi": float(pred_ndvi[0, 0])})

@app.route('/data', methods=['GET'])
def data():
    return df_ndvi.to_json(orient='records', date_format='iso')

@app.route('/climate', methods=['GET'])
def climate():
    lat = request.args.get('lat', '38.5')
    lon = request.args.get('lon', '-121.5')
    start = request.args.get('start', '20200101')
    end = request.args.get('end', '20201231')

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
        return jsonify(data)
    else:
        return jsonify({"error": "Failed to fetch climate data"}), 500

@app.route('/ndvi_map_data', methods=['GET'])
def ndvi_map_data():
    csv_path = "sample_ndvi_map_data.csv"
    if not os.path.exists(csv_path):
        return jsonify({"error": "NDVI map data not found"}), 404
    df = pd.read_csv(csv_path)
    return df.to_json(orient='records', date_format='iso')

@app.route('/ndvi', methods=['GET'])
def get_ndvi():
    lat = request.args.get('lat', '38.5')
    lon = request.args.get('lon', '-121.5')
    start = request.args.get('start', '20200101')
    end = request.args.get('end', '20201231')

    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "start": start,
        "end": end,
        "latitude": lat,
        "longitude": lon,
        "parameters": "NDVI",
        "community": "AG",
        "format": "JSON"
    }

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({"error": "Failed to fetch NDVI data"}), 500

@app.route('/evi', methods=['GET'])
def get_evi():
    lat = request.args.get('lat', '38.5')
    lon = request.args.get('lon', '-121.5')
    start = request.args.get('start', '20200101')
    end = request.args.get('end', '20201231')

    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "start": start,
        "end": end,
        "latitude": lat,
        "longitude": lon,
        "parameters": "EVI",
        "community": "AG",
        "format": "JSON"
    }

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({"error": "Failed to fetch EVI data"}), 500

@app.route('/soil_moisture', methods=['GET'])
def get_soil_moisture():
    lat = request.args.get('lat', '38.5')
    lon = request.args.get('lon', '-121.5')
    start = request.args.get('start', '20200101')
    end = request.args.get('end', '20201231')

    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "start": start,
        "end": end,
        "latitude": lat,
        "longitude": lon,
        "parameters": "GWETPROF",
        "community": "AG",
        "format": "JSON"
    }

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({"error": "Failed to fetch soil moisture data"}), 500

@app.route('/chart', methods=['GET'])
def chart():
    # Generate a Plotly chart for NDVI
    fig = px.line(df_ndvi, x='date', y='NDVI', title='NDVI Over Time')
    fig_html = fig.to_html(full_html=False)
    return fig_html

@app.route('/bloom_prediction', methods=['GET'])
def bloom_prediction():
    # Load NDVI
    df_ndvi = pd.read_csv("backend/NDVI_TimeSeries_CentralValley (2).csv")
    df_ndvi['NDVI'] = df_ndvi['NDVI'].astype(float)
    df_ndvi['year'] = df_ndvi['year'].astype(int)
    df_ndvi['month'] = df_ndvi['month'].astype(int)
    df_ndvi['date'] = pd.to_datetime(df_ndvi['year'].astype(str) + '-' + df_ndvi['month'].astype(str) + '-01')
    df_ndvi = df_ndvi.sort_values('date')

    # Fetch Climate Data
    locations = {
        'North_CA': (38.5, -121.5),
        'South_CA': (33.0, -117.0)
    }

    dfs_climate = []
    for name, (lat, lon) in locations.items():
        start_date = df_ndvi['date'].min().strftime('%Y%m%d')
        end_date = df_ndvi['date'].max().strftime('%Y%m%d')
        url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,RH2M&community=AG&longitude={lon}&latitude={lat}&start={start_date}&end={end_date}&format=JSON"
        r = requests.get(url)
        data = r.json()
        df_list = []
        for date, temp in data['properties']['parameter']['T2M'].items():
            rainfall = data['properties']['parameter']['PRECTOTCORR'][date]
            humidity = data['properties']['parameter']['RH2M'][date]
            df_list.append([date, temp, rainfall, humidity])
        df_clim = pd.DataFrame(df_list, columns=['YYYYMMDD', 'Temp', 'Rainfall', 'Humidity'])
        df_clim['date'] = pd.to_datetime(df_clim['YYYYMMDD'], format='%Y%m%d')
        df_clim['Region'] = name
        dfs_climate.append(df_clim)

    df_climate_all = pd.concat(dfs_climate, ignore_index=True)

    # Merge
    df_ndvi_expanded = pd.concat([df_ndvi.assign(Region=name) for name in locations.keys()], ignore_index=True)
    df_full = pd.merge(df_ndvi_expanded, df_climate_all, on=['date','Region'], how='left')
    df_full = df_full.sort_values(['Region','date']).reset_index(drop=True)

    # Prepare data
    features = ['NDVI', 'Temp', 'Rainfall', 'Humidity']
    scaler = MinMaxScaler(feature_range=(0,1))
    scaled_data = scaler.fit_transform(df_full[features])

    def create_sequences(data, seq_length):
        X, y = [], []
        for i in range(len(data) - seq_length):
            X.append(data[i:i+seq_length])
            y.append(data[i+seq_length, 0])
        return np.array(X), np.array(y)

    seq_length = 5
    X, y = create_sequences(scaled_data, seq_length)
    split = int(len(X)*0.8)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    # Build model
    model = Sequential()
    model.add(LSTM(50, activation='relu', input_shape=(seq_length, len(features))))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')
    model.fit(X_train, y_train, epochs=50, batch_size=8, verbose=0)  # Reduced epochs for speed

    # Predict
    y_pred = model.predict(X_test)
    y_pred_rescaled = scaler.inverse_transform(
        np.concatenate([y_pred, np.zeros((y_pred.shape[0], len(features)-1))], axis=1)
    )[:,0]
    y_test_rescaled = scaler.inverse_transform(
        np.concatenate([y_test.reshape(-1,1), np.zeros((y_test.shape[0], len(features)-1))], axis=1)
    )[:,0]

    # Peak day
    peak_index = np.argmax(y_pred_rescaled)
    dates_test = df_full['date'].iloc[split + seq_length : split + seq_length + len(y_test_rescaled)]
    peak_day = dates_test.iloc[peak_index].strftime('%Y-%m-%d')

    # Return data
    result = {
        'dates': dates_test.dt.strftime('%Y-%m-%d').tolist(),
        'actual_ndvi': y_test_rescaled.tolist(),
        'predicted_ndvi': y_pred_rescaled.tolist(),
        'peak_bloom_day': peak_day
    }
    return jsonify(result)

# -------------------------------
# 5️⃣ Run Flask app
# -------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
