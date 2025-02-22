import React from "react";
import "../styles/Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import UserTable from "./UserTable";

const Dashboard = ({ users }) => {
    const chartData = users.map((user) => ({
        name: user.name,
        engagementScore: (user.logins * 2) + (user.feature_usage * 3) + (user.session_duration * 1) + (user.interactions * 4),
    }));

    const totalUsers = users.length;
    const retainedUsers = users.filter(user => user.last_login_days <= 14).length;
    const retentionRate = totalUsers > 0 ? ((retainedUsers / totalUsers) * 100).toFixed(2) : 0;

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">📊 Dashboard Overview</h2>

            {/* 🔹 Metrics Section */}
            <div className="metrics-container">
                <div className="metric-box">
                    <p className="metric-title">👥 Total Users</p>
                    <p className="metric-value">{totalUsers}</p>
                </div>
                <div className="metric-box">
                    <p className="metric-title">🔄 Retention Rate</p>
                    <p className="metric-value">{retentionRate}%</p>
                </div>
                <div className="metric-box">
                    <p className="metric-title">📆 Active Users (14 Days)</p>
                    <p className="metric-value">{retainedUsers}</p>
                </div>
            </div>

            {/* 🔹 Chart Section */}
            <div className="chart-container">
                <h3>📊 User Engagement Score</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="engagementScore" fill="#4A90E2" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 🔹 User Table */}
            <UserTable users={users} />
        </div>
    );
};

export default Dashboard;

