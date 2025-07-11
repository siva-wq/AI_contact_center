import axios from "axios";
import React, { useState } from "react";
import { fed } from "../URL";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePassChange = (e) => {
    setNewPass(e.target.value);
  };

  const setPass = async () => {
    try {
      const response = await axios.post(`${fed}/forgotpass`, {
        email,
        password: newPass,
      });
      setMsg(response.data.message);
    } catch (error) {
      setMsg("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  // Inline styles
  const containerStyle = {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#fefefe",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "20px"
  };

  const formGroupStyle = {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column"
  };

  const labelStyle = {
    marginBottom: "6px",
    fontWeight: "600"
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.2s ease"
  };

  const messageStyle = {
    textAlign: "center",
    marginTop: "15px",
    color: "green",
    fontWeight: "500"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Reset Your Password</h2>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          required
          style={inputStyle}
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>New Password</label>
        <input
          type="password"
          name="password"
          value={newPass}
          onChange={handlePassChange}
          placeholder="Enter new password"
          required
          style={inputStyle}
        />
      </div>

      <button onClick={setPass} style={buttonStyle}>Submit</button>

      <p style={messageStyle}>{msg}</p>
    </div>
  );
};

export default ForgotPass;
