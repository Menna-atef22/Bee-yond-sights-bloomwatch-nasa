import sys
import json
import joblib
import pandas as pd
import os
import traceback

try:
    script_dir = os.path.dirname(__file__)
    model_path = os.path.join(script_dir, 'crop_health_model.pkl')
except NameError:
    model_path = 'crop_health_model.pkl'


FEATURE_COLS = [
    "Humidity_%", "Rainfall_m", "Temperature_C", "WindSpeed_m/s", "SolarRadiation",
    "Clay", "OrganicCarbon", "Sand", "Silt", "SoilMoisture",
    "EVI", "NDVI", "NDWI", "SAVI",
    "week_number", "month", "day_of_year",
    "region_East_Africa", "region_North_Africa", "region_South_Africa", "region_West_Africa",
    "season_Autumn", "season_Spring", "season_Summer", "season_Winter",
    "NDVI_Rainfall", "SM_Temp" # Added the two missing features
]

def predict(data):
    """
    Loads the crop health model, creates engineered features, and makes a prediction.
    """
    try:
        # --- FIX: Create the feature-engineered columns ---
        # The model expects these two interaction terms, so we create them from the input data.
        data['NDVI_Rainfall'] = data['NDVI'] * data['Rainfall_m']
        data['SM_Temp'] = data['SoilMoisture'] * data['Temperature_C']

        # Load the pre-trained model
        model = joblib.load(model_path)
        
        # Convert the (now complete) dictionary into a pandas DataFrame
        input_df = pd.DataFrame([data])
        
        # Enforce the correct column order, which now includes the new features
        input_df = input_df[FEATURE_COLS]
        
        # Make a prediction
        prediction = model.predict(input_df)
        
        result = prediction[0]
        
        class_mapping = {0: "Healthy", 1: "Moderate", 2: "Diseased"}
        readable_prediction = class_mapping.get(int(result), "Unknown Class")
        
        return json.dumps({"prediction": readable_prediction, "class_id": int(result)})

    except FileNotFoundError:
        return json.dumps({"error": f"Model file not found. The script looked for it at: {model_path}"})
    except Exception as e:
        return json.dumps({
            "error": "An exception occurred in the Python script.",
            "details": str(e),
            "traceback": traceback.format_exc()
        })

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_data = json.loads(sys.argv[1])
        print(predict(input_data))