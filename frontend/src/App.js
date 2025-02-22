import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import Dashboard from "./components/Dashboard"

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/users")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "2rem", fontWeight: "bold", textAlign: "center", color: "#6a5acd" }}> 👤 Customer Engagement Dashboard </h1>
            <Dashboard users={users} />
        </div>
    );
}

export default App;
