import React, { useEffect, useState } from "react";
import "./Dashboard.css"; 
import { fed } from "../URL";

const Dashboard = () => {
  const userId = localStorage.getItem("userId");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${fed}/getuser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (data.status) {
          setUsername(data.username);
          setEmail(data.email);
          setRole(data.role);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Dashboard</h2>
      <p className="dashboard-info"><strong>Name:</strong> {username}</p>
      <p className="dashboard-info"><strong>Email:</strong> {email}</p>
      
      <button className="dashboard-button" onClick={() => window.location.href = "/Chat"}>
        Chat
      </button>
    </div>
  );
};

export default Dashboard;
