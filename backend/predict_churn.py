import sys
import joblib
import pandas as pd
import os

model_path = os.path.join(os.path.dirname(__file__), "churn_model.pkl")
model = joblib.load(model_path)

# Get user input from Node.js
logins, feature_usage, session_duration, interactions, last_login_days = map(float, sys.argv[1:])

# Prepare input data for prediction
feature_names = ["logins", "feature_usage", "session_duration", "interactions", "last_login_days"]
user_data = pd.DataFrame([[logins, feature_usage, session_duration, interactions, last_login_days]], columns=feature_names)

# Predict churn (1 = Churn, 0 = Not Churn)
prediction = model.predict(user_data)[0]

# Print result for Node.js to capture
print(int(prediction))
