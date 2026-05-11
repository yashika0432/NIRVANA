import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error

# -------------------------

df = pd.read_csv("Mental.csv")

df.fillna(df.mean(numeric_only=True), inplace=True)
label_encoder = LabelEncoder()
df["trigger_encoded"] = label_encoder.fit_transform(df["trigger_type"])

label_encoder = LabelEncoder()
df["trigger_encoded"] = label_encoder.fit_transform(df["trigger_type"])

y_days = df["next_attack_days"]
y_trigger = df["trigger_encoded"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y_days,
    test_size=0.2,
    random_state=42
)


regressor = RandomForestRegressor(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

regressor.fit(X_train, y_train)

preds = regressor.predict(X_test)

print("MAE:", mean_absolute_error(y_test, preds))

X_train2, X_test2, y_train2, y_test2 = train_test_split(
    X_scaled,
    y_trigger,
    test_size=0.2,
    random_state=42
)

classifier = RandomForestClassifier(
    n_estimators=150,
    random_state=42
)

classifier.fit(X_train2, y_train2)

joblib.dump(regressor, "model.pkl")
joblib.dump(classifier, "trigger_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("Models saved successfully")