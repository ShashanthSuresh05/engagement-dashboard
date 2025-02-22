const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "data", "users.json");

app.use(cors());
app.use(express.json());

// Helper functions to read and write user data
const getUsers = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
};

const saveUsers = (users) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 4));
};

// Route: Get all users
app.get("/api/users", (req, res) => {
    const users = getUsers();
    res.json(users);
});

// Route: Add a new user
app.post("/api/users", (req, res) => {
    try {
        const users = getUsers();
        const newUser = {
            id: users.length + 1, 
            ...req.body 
        };
        users.push(newUser);
        saveUsers(users);
        res.status(201).json({ message: "✅ User added successfully!", user: newUser });
    } catch (error) {
        console.error("❌ Error adding user:", error);
        res.status(500).json({ message: "❌ Internal server error" });
    }
});

// Route: Predict Churn using Python
app.post("/api/predict", (req, res) => {
    try {
        const userData = req.body;
        console.log("📨 Received user data for prediction:", userData);

        // Convert user data to a list of strings
        const userDataArray = [
            userData.logins, 
            userData.feature_usage, 
            userData.session_duration, 
            userData.interactions, 
            userData.last_login_days
        ].map(String);

        // Spawn Python script with user data as arguments
        const pythonProcess = spawn("python", [path.join(__dirname, "predict_churn.py"), ...userDataArray]);

        let result = "";
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error("❌ Python error:", data.toString());
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                console.log("✅ Churn Prediction Result:", result);
                res.json({ churnPrediction: result.trim() });
            } else {
                res.status(500).json({ message: "❌ Prediction failed" });
            }
        });
    } catch (error) {
        console.error("❌ Error running prediction:", error);
        res.status(500).json({ message: "❌ Internal server error" });
    }
});

// Route: Get AI Insights using Python
app.post("/api/insights", (req, res) => {
    try {
        const userData = req.body;
        console.log("📨 Received user data for insights:", userData);

        const userDataArray = [
            userData.logins, 
            userData.feature_usage, 
            userData.session_duration, 
            userData.interactions, 
            userData.last_login_days
        ].map(String);

        const pythonProcess = spawn("python", [path.join(__dirname, "generate_insights.py"), ...userDataArray]);

        let result = "";
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error("❌ Insights Python error:", data.toString());
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                console.log("✅ Insights Result:", result);
                res.json(JSON.parse(result.trim())); // Ensure valid JSON is sent
            } else {
                res.status(500).json({ message: "❌ Insights generation failed" });
            }
        });

    } catch (error) {
        console.error("❌ Error generating insights:", error);
        res.status(500).json({ message: "❌ Internal server error" });
    }
});

app.get("/", (req, res) => {
    res.send("✅ Server is running! Use API endpoints like /api/users or /api/predict.");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
