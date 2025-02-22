import sys
import json

try:
    # Get user input
    logins, feature_usage, session_duration, interactions, last_login_days = map(float, sys.argv[1:])

    # Churn risk logic
    churn_risk = "High" if last_login_days > 30 else "Medium" if last_login_days > 15 else "Low"

    # Feature performance analysis
    top_features = []
    underperforming_features = []

    if feature_usage > 50:
        top_features.append("High feature usage - Users engage well.")
    elif feature_usage < 20:
        underperforming_features.append("Low feature usage - Improve engagement with tutorials.")

    if session_duration < 5:
        underperforming_features.append("Low session duration - Users may need more engaging content.")

    # Recommendations
    recommendations = []
    if churn_risk == "High":
        recommendations.append("Offer personalized discounts to inactive users.")
    if "Low feature usage" in underperforming_features:
        recommendations.append("Send educational emails highlighting unused features.")

    # Prepare response
    insights = {
        "churn_risk": churn_risk,
        "top_features": top_features,
        "underperforming_features": underperforming_features,
        "recommendations": recommendations
    }

    # Return JSON output for Node.js to capture
    print(json.dumps(insights))

except Exception as e:
    print(json.dumps({"error": f"Insights generation failed: {str(e)}"}))
