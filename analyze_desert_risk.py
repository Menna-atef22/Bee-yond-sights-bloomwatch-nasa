import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# Load the data
df = pd.read_csv('DesertRisk_Predictions.csv')

# Basic info
print("Dataset Shape:", df.shape)
print("\nColumns:", df.columns.tolist())
print("\nData Types:")
print(df.dtypes)
print("\nMissing Values:")
print(df.isnull().sum())
print("\nDescriptive Statistics:")
print(df.describe())

# Distribution of PredictedRisk
print("\nPredictedRisk Distribution:")
print(df['PredictedRisk'].value_counts(normalize=True))

# Correlation matrix among features (excluding target since it's constant)
features = ['NDVI', 'EVI', 'Rainfall', 'Temperature', 'SoilMoisture', 'Evapotranspiration', 'FireIndex', 'elevation']
corr_matrix = df[features].corr()
print("\nFeature Correlation Matrix:")
print(corr_matrix)

# Visualize feature correlations
plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Feature Correlation Matrix')
plt.tight_layout()
plt.savefig('feature_correlation_matrix.png')
plt.close()

# Feature distributions
fig, axes = plt.subplots(2, 4, figsize=(20, 10))
for i, feature in enumerate(features):
    ax = axes[i//4, i%4]
    sns.histplot(df[feature], ax=ax, kde=True)
    ax.set_title(f'{feature} Distribution')
plt.tight_layout()
plt.savefig('feature_distributions.png')
plt.close()

# Scatter plots for key relationships
key_pairs = [('Rainfall', 'SoilMoisture'), ('Temperature', 'Evapotranspiration'), ('elevation', 'Temperature'), ('FireIndex', 'Rainfall')]
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
for i, (x, y) in enumerate(key_pairs):
    ax = axes[i//2, i%2]
    sns.scatterplot(x=x, y=y, data=df, ax=ax, alpha=0.6)
    ax.set_title(f'{x} vs {y}')
plt.tight_layout()
plt.savefig('key_scatter_plots.png')
plt.close()

# Identify potential risk thresholds
print("\nPotential Risk Thresholds:")
for feature in features:
    if feature in ['NDVI', 'EVI', 'SoilMoisture']:
        print(f"{feature}: Low values indicate high risk (mean: {df[feature].mean():.4f})")
    elif feature in ['Rainfall']:
        print(f"{feature}: Low rainfall increases risk (mean: {df[feature].mean():.4f}, 25th percentile: {df[feature].quantile(0.25):.4f})")
    elif feature in ['Temperature', 'Evapotranspiration']:
        print(f"{feature}: High values increase risk (mean: {df[feature].mean():.4f}, 75th percentile: {df[feature].quantile(0.75):.4f})")
    elif feature == 'FireIndex':
        print(f"{feature}: Values > 0 indicate fire risk (non-zero count: {(df[feature] > 0).sum()})")
    elif feature == 'elevation':
        print(f"{feature}: Varies, may affect local climate (range: {df[feature].min():.1f} - {df[feature].max():.1f})")

# Insights
print("\n=== DESERTIFICATION RISK PREDICTION INSIGHTS ===")
print("1. Dataset Overview:")
print(f"   - Total samples: {len(df)}")
print(f"   - All samples are predicted as high desertification risk (PredictedRisk = 1.0)")
print(f"   - This dataset appears to represent areas already identified as high-risk")

print("\n2. Key Feature Characteristics:")
print("   - Vegetation indices (NDVI, EVI): All zero, indicating complete vegetation absence")
print("   - Rainfall: Low overall (mean 0.45), with most areas receiving <0.42")
print("   - Temperature: Moderate (mean 24.6°C), suitable range for desert conditions")
print("   - Soil Moisture: Very low (mean 0.049), critical for plant survival")
print("   - Evapotranspiration: Moderate (mean 3.0), balancing water loss")
print("   - Fire Index: Mostly low (mean 0.043), but 8438 non-zero values indicate some fire risk")
print("   - Elevation: Wide range (16-1013m), affecting local microclimates")

print("\n3. Inter-feature Relationships:")
strong_corr = []
for i in range(len(features)):
    for j in range(i+1, len(features)):
        corr = corr_matrix.iloc[i, j]
        if abs(corr) > 0.5:
            strong_corr.append((features[i], features[j], corr))
if strong_corr:
    for f1, f2, c in strong_corr:
        print(f"   - {f1}-{f2}: {c:.3f}")
else:
    print("   - No strong correlations (>0.5) found among features")

print("\n4. Risk Factor Analysis:")
print("   - Primary indicators: Zero vegetation, low soil moisture, low rainfall")
print("   - Secondary factors: High temperatures, high evapotranspiration, fire risk")
print("   - Terrain influence: Elevation affects temperature and moisture distribution")

print("\n5. Prediction Model Considerations:")
print("   - Since all samples are high-risk, the model may be calibrated for desert areas")
print("   - Feature engineering could improve discrimination (e.g., vegetation trends)")
print("   - Consider incorporating temporal data for early warning systems")

print("\n6. Recommendations for Desertification Monitoring:")
print("   - Implement vegetation restoration programs in zero-NDVI areas")
print("   - Enhance water management in low-rainfall regions")
print("   - Monitor soil moisture thresholds for intervention triggers")
print("   - Develop fire prevention strategies in high-risk areas")
print("   - Use elevation data for targeted conservation efforts")
