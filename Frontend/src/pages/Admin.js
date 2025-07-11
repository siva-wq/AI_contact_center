import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./Admin.css";
import { bed, fed } from "../URL";

const socket = io(bed, {
  withCredentials: true,
});

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [eusers, setEUsers] = useState([]);
  const [iusers, setiusers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [solve, setsolve] = useState(false);
  const [Type, setType] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTakenOver, setIsTakenOver] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [room, setroom] = useState(null)
  

  useEffect(() => {
    if (!room) return;

    socket.emit("join-room", room, "admin");

    const handler = (msg) => {
      console.log("Admin received:", msg);
      if (msg.sender?.toLowerCase() !== "admin") {
        setChatMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-msg", handler);

    return () => {
      socket.off("receive-msg");
    };
  }, [room]);

  const getIssueUsers = async () => {
    try {
      const response = await axios.get(`${fed}/getallissues`);
      if (response.data.status) setiusers(response.data.allissues);
    } catch (e) {
      console.log("Error fetching issue users:", e);
    }
  };

  const getEscalated = async () => {
    try {
      const response = await axios.get(`${fed}/escalataed`);
      if (response.data.status) setEUsers(response.data.escalatedChats);
    } catch (error) {
      console.error("Error fetching escalated users:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${fed}/getallusers`);
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUserChat = async (userId) => {
    try {
      const response = await axios.get(`${fed}/getmsg/${userId}`);
      const messages = response.data.messages || [];
      setChatMessages(messages);
      setIsTakenOver(response.data.isTakenOver || false);
    } catch (error) {
      console.error("Failed to fetch previous messages:", error);
    }
  };

  const handleTakeOver = async () => {
    try {
      await axios.post(`${fed}/takeover`, {
        userId: selectedUser.userId,
        isTakenOver: true,
      });
      setIsTakenOver(true);
    } catch (err) {
      console.error("Error taking over chat", err);
    }
  };

  const handleRelease = async () => {
    try {
      await axios.post(`${fed}/takeover`, {
        userId: selectedUser.userId,
        isTakenOver: false,
      });
      setIsTakenOver(false);
    } catch (err) {
      console.error("Error releasing chat", err);
    }
  };

  const handleAdminSend = async () => {
    if (!adminInput.trim()) return;

    const msg = {
      sender: "admin",
      message: adminInput,
    };

    socket.emit("send-message", {
      from: "admin",
      to: room,
      message: adminInput,
    });

    setChatMessages((prev) => [...prev, msg]);
    setAdminInput("");

    try {
      await axios.post(`${fed}/saveMsg`, {
        userId: selectedUser.userId,
        sender: "admin",
        message: adminInput,
      });
    } catch (err) {
      console.error("Error saving admin message", err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    getEscalated();
    getIssueUsers();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-section">
        <h2>All Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user.name} - {user.email}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-section">
        <button className="admin-button" onClick={getEscalated}>Get Escalated Users</button>
        <h2>Escalated Users</h2>
        {eusers.length === 0 ? (
          <p>No escalated users found.</p>
        ) : (
          <ul>
            {eusers.map((euser, index) => (
              <li
                key={index}
                onClick={() => {
                  setType("Escalated");
                  setroom(euser.userId._id);
                  setSelectedUser({
                    userId: euser.userId._id,
                    name: euser.userId.name,
                    email: euser.userId.email,
                  });
                  setsolve(null);
                  fetchUserChat(euser.userId._id);
                }}
              >
                {euser.userId.name} - {euser.userId.email}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-section">
        <button className="admin-button" onClick={getIssueUsers}>Get User Issues</button>
        <h2>User Issues</h2>
        {iusers.length === 0 ? (
          <p>No user issues found.</p>
        ) : (
          <ul>
            {iusers.map((iuser, index) => (
              <li
                key={index}
                onClick={() => {
                  setsolve(iuser.userId.istatus);
                  setType("Issue");
                  setSelectedUser({
                    userId: iuser.userId._id,
                    name: iuser.userId.name,
                    email: iuser.userId.email,
                    Issue: iuser.Issue,
                  });
                  fetchUserChat(iuser.userId._id);
                }}
              >
                <strong>{iuser.userId.name}</strong> - {iuser.userId.email}<br />
                <em>{iuser.Issue}</em>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedUser && (
        <div className="admin-selected-user">
          <h3>Selected {Type} User Details</h3>
          <p><strong>User ID:</strong> {selectedUser.userId}</p>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>

          {Type === "Issue" && (
            <>
              <p><strong>Issue:</strong> {selectedUser.Issue}</p>
              <p><strong>Status:</strong> {!solve ? "✅ Solved" : "❌ Not Solved"}</p>
            </>
          )}

         
          {chatMessages.length > 0 && (
            <div className="admin-chat-box">
              <h4>Chat History</h4>
              <ul>
                {chatMessages.map((msg, idx) => (
                  <li
                    key={idx}
                    className={msg.sender === "admin" || msg.sender==="bot"? "admin-msg" : "user-msg"}
                  >
                    <strong>{msg.sender === "user" ? selectedUser.name : msg.sender.toUpperCase()}:</strong><br />
                    {msg.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
           <div style={{ margin: "15px 0" }}>
            {!isTakenOver ? (
              <button  className="admin-takeover-button" onClick={handleTakeOver}>Take Over</button>
            ) : (
              <button  className="admin-takeover-button" onClick={handleRelease}>Release</button>
            )}
          </div>

          {isTakenOver && (
            <div className="admin-input-area">
              <input
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                placeholder="Type your reply..."
                onKeyDown={(e) => e.key === "Enter" && handleAdminSend()}
              />
              <button onClick={handleAdminSend}>Send</button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Admin;
