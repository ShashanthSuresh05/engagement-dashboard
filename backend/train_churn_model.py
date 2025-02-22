import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load user data (use existing JSON or create mock data)
users = [
    {"logins": 5, "feature_usage": 8, "session_duration": 30, "interactions": 12, "last_login_days": 10, "churn": 0},
    {"logins": 1, "feature_usage": 2, "session_duration": 5, "interactions": 1, "last_login_days": 20, "churn": 1},
    {"logins": 7, "feature_usage": 10, "session_duration": 50, "interactions": 15, "last_login_days": 5, "churn": 0},
    {"logins": 0, "feature_usage": 1, "session_duration": 2, "interactions": 0, "last_login_days": 25, "churn": 1},
]

# Convert data to DataFrame
df = pd.DataFrame(users)

# Define features (X) and target variable (y)
X = df.drop(columns=["churn"])  # Features
y = df["churn"]  # Target (1 = Churn, 0 = Not Churn)

# Split into training & testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a simple Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Test model accuracy
y_pred = model.predict(X_test)
print(f"Model Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")

# Save the trained model
joblib.dump(model, "backend/churn_model.pkl")
print("✅ Model saved as 'backend/churn_model.pkl'")
