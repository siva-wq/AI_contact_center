import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import Fchat from './pages/Fchat';
import Admin from './pages/Admin';
import ForgotPass from './components/ForgotPass';

function App() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [role,setrole]=useState(null);
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setrole(localStorage.getItem('role'));
    setUserId(storedUserId);
  }, []);

  const handleSignupComplete = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    setUserId(null);
    navigate("/login");
  };

  const ProtectedRoute = ({ element }) => {
    console.log(userId)
    return userId ? element : <p>Please log in to view this page.</p>;
  };

  return (
    <div>
      <header>
        <h1>AI Contact Center</h1>
        {role === "admin" ? (
          <div>
            <button onClick={() => navigate("/")}>Dashboard</button>
            <button onClick={() => navigate("/admin")}>Admin</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : userId && role !== "admin" ? (
          <div>
            <button onClick={() => navigate("/")}>Dashboard</button>
            <button onClick={() => navigate("/Chat")}>Chat</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Signup</button>
          </div>
        )}

      </header>

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup onSignupComplete={handleSignupComplete} />} />
          <Route path="/" element={<ProtectedRoute element={<Dashboard userId={userId} />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
          <Route path="/Chat" element={<Fchat />} />
          <Route path="/forgot" element={<ForgotPass />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
