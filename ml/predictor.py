import joblib
import numpy as np

model = joblib.load("model.pkl")
trigger_model = joblib.load("trigger_model.pkl")
scaler = joblib.load("scaler.pkl")
encoder = joblib.load("label_encoder.pkl")


def predict_attack(data):
    features = np.array([[
        data["sleep_hours"],
        data["stress_level"],
        data["anxiety_level"],
        data["caffeine_intake"],
        data["mood_score"],
        data["trigger_encoded"]
    ]])
    
scaled = scaler.transform(features)

    days_prediction = model.predict(scaled)[0]

    trigger_prediction = trigger_model.predict(scaled)[0]

    trigger_name = encoder.inverse_transform([int(trigger_prediction)])[0]

    risk_score = (
        data["stress_level"] * 0.4 +
        data["anxiety_level"] * 0.4 +
        (10 - data["sleep_hours"]) * 0.2
    )

     return {
        "expected_days": round(days_prediction, 1),
        "expected_trigger": trigger_name,
        "risk_score": round(risk_score, 1)
    }


sample = {
    "sleep_hours": 4,
    "stress_level": 9,
    "anxiety_level": 8,
    "caffeine_intake": 5,
    "mood_score": 3,
    "trigger_encoded": 2
}

print(predict_attack(sample))