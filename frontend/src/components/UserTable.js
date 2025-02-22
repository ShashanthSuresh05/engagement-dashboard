import React, { useState } from "react";
import axios from "axios";
import AIInsights from "./AIInsights";

function UserTable({ users }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [predictions, setPredictions] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [insights, setInsights] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [dateRange, setDateRange] = useState("");
    const [engagementScore, setEngagementScore] = useState("");
    const [retentionCategory, setRetentionCategory] = useState("");
    const [isTableVisible, setIsTableVisible] = useState(true);

    const predictChurn = async (userId, user) => {
        setPredictions((prev) => ({ ...prev, [userId]: "Predicting..." }));
        setLoadingInsights(true);

        const userData = {
            logins: user.logins,
            feature_usage: user.feature_usage,
            session_duration: user.session_duration,
            interactions: user.interactions,
            last_login_days: user.last_login_days,
        };

        try {
            const response = await axios.post("http://localhost:5000/api/predict", userData);
            const churnPrediction = response.data.churnPrediction === "1" ? "Likely to Churn" : "Not Likely to Churn";

            setPredictions((prev) => ({ ...prev, [userId]: churnPrediction }));
            setSelectedUser(user);
            const insightsResponse = await axios.post("http://localhost:5000/api/insights", userData);
            setInsights(insightsResponse.data);
        } catch (error) {
            console.error("❌ Prediction/Insights API Error:", error);
            setPredictions((prev) => ({ ...prev, [userId]: "Prediction failed" }));
            setInsights(null);
        } finally {
            setLoadingInsights(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        return (
            (searchTerm === "" || user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (dateRange === "" || user.last_login_days <= parseInt(dateRange)) &&
            (engagementScore === "" || user.engagement_score >= parseInt(engagementScore)) &&
            (retentionCategory === "" || user.retention_category === retentionCategory)
        );
    });

    return (
        <div style={{ padding: "20px", backgroundColor: "#1e1e1e", color: "#ffffff" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>👤 User Activity</h2>
            <div>
            {/* Toggle Button */}
            <button 
                onClick={() => setIsTableVisible(!isTableVisible)}
                style={{ 
                    padding: "10px", 
                    borderRadius: "5px", 
                    border: "none", 
                    background: "linear-gradient(135deg, #020202, #291035)", 
                    color: "white", 
                    cursor: "pointer",
                    marginBottom: "10px"
                }}
            >
                {isTableVisible ? "🔽 Hide User Table" : "🔼 Show User Table"}
            </button>
            </div>   
            {isTableVisible && (
                <>
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "30%" }} 
                    />
                    
                    <select onChange={(e) => setDateRange(e.target.value)} value={dateRange} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "21.25%" }}>
                        <option value="">All Date Ranges</option>
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                    </select>

                    <select onChange={(e) => setEngagementScore(e.target.value)} value={engagementScore} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "22%" }}>
                        <option value="">All Engagement Scores</option>
                        <option value="50">Above 50</option>
                        <option value="70">Above 70</option>
                        <option value="90">Above 90</option>
                    </select>

                    <select onChange={(e) => setRetentionCategory(e.target.value)} value={retentionCategory} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "25%" }}>
                        <option value="">All Retention Categories</option>
                        <option value="high">High Retention</option>
                        <option value="medium">Medium Retention</option>
                        <option value="low">Low Retention</option>
                    </select>

                    {filteredUsers.length === 0 ? <p style={{ color: "#aaa" }}>No users found.</p> : (
                        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#292929", color: "#ffffff", marginTop: "10px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#291035" }}>
                                    <th style={{ border: "1px solid #555", padding: "10px" }}>Name</th>
                                    <th style={{ border: "1px solid #555", padding: "10px" }}>Email</th>
                                    <th style={{ border: "1px solid #555", padding: "10px" }}>Logins</th>
                                    <th style={{ border: "1px solid #555", padding: "10px" }}>Feature Usage</th>
                                    <th style={{ border: "1px solid #555", padding: "10px" }}>Session Duration</th>
                                    <th style={{ border: "1px solid #555", padding: "10px" }}>Interactions</th>
                                    <th style={{ border: "1px solid #555", padding: "10px" }}>Last Login</th>
                                    <th style={{ border: "1px solid #555", padding: "10px" }}>Churn Prediction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} style={{ backgroundColor: "#1e1e2f" }}>
                                        <td style={{ border: "1px solid #555", padding: "10px" }}>{user.name}</td>
                                        <td style={{ border: "1px solid #555", padding: "10px" }}>{user.email}</td>
                                        <td style={{ border: "1px solid #555", padding: "10px" }}>{user.logins}</td>
                                        <td style={{ border: "1px solid #555", padding: "10px" }}>{user.feature_usage}</td>
                                        <td style={{ border: "1px solid #555", padding: "10px" }}>{user.session_duration}</td>
                                        <td style={{ border: "1px solid #555", padding: "10px" }}>{user.interactions}</td>
                                        <td style={{ border: "1px solid #555", padding: "10px" }}>{user.last_login_days}</td>
                                        <td style={{ border: "1px solid #555", padding: "10px" }}>
                                            <button 
                                                style={{ background: "linear-gradient(135deg, #020202, #291035)", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }} 
                                                onClick={() => predictChurn(user.id, user)}
                                            >
                                                🔮 Predict
                                            </button>
                                            <p>{predictions[user.id]}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}

            {selectedUser && (
                <div>
                    <h3>🔍 AI Insights for {selectedUser.name}</h3>
                    {loadingInsights ? <p>Loading AI insights...</p> : <AIInsights insights={insights} />}
                </div>
            )}
        </div>
    );
}

export default UserTable;
