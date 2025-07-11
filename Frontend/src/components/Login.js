import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';
import LanguageSwitcher from './LanguageSwitcher';
import { fed } from '../URL';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    lang:localStorage.getItem('lang')
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${fed}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {

        const data = await response.json();
        console.log("data")
        console.log(data)
        console.log(data.id)
        localStorage.setItem('userId', data.id);
        localStorage.setItem('role',data.role);
        if (data.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/")
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LanguageSwitcher />
      <div className="login-container">

        <div className="login-card">
          <h2>{t('login')}</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>{t('password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "loginin" : t('submit')}
            </button>
          </form>
          <p>new user click<button onClick={() => navigate("/signup")}>{t('signup')}</button></p>
          <button onClick={() => navigate("/forgot")}>{t('forgotpass')}</button>
        </div>
      </div>
    </>
  );
};

export default Login;
