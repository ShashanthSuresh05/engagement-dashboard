import React from "react";

const AIInsights = ({ insights }) => {
    if (!insights) {
        return <p>Loading AI insights...</p>;
    }

    return (
        <div className="insights-panel">
            <h2>📊 AI Insights Panel</h2>
            <p><strong>🛑 Churn Risk:</strong> {insights.churn_risk || "No data"}</p>
            <p><strong>🔥 Top Features:</strong> {insights.top_features && insights.top_features.length > 0 ? insights.top_features.join(", ") : "None"}</p>
            <p><strong>⚠️ Underperforming Features:</strong> {insights.underperforming_features && insights.underperforming_features.length > 0 ? insights.underperforming_features.join(", ") : "None"}</p>
            <p><strong>💡 Recommendations:</strong> {insights.recommendations && insights.recommendations.length > 0 ? insights.recommendations.join(", ") : "None"}</p>
        </div>
    );
};

export default AIInsights;
