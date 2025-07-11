import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Signup.css";
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { fed } from "../URL";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${fed}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password,lang:localStorage.getItem('lang') }),
      });

      const data = await response.json();

      if (data.status) {
        console.log("Sign up successful");
        navigate("/login");
      } else {
        console.log("Sign up not successful");
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <>
      <LanguageSwitcher />
      <div className="signup-container">
        <div className="signup-box">
          <h2>{t('signup')}</h2>
          <label>{t('name')}</label>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <label>{t('email')}</label>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>{t('password')}</label>
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleSignup}>{t('signup')}</button>
        </div>
      </div>
    </>
  );
};

export default Signup;
