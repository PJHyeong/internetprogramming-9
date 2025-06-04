import React, { useState } from "react";
import Main from "./main";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("autoLogin");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <>
      <Header user={user} 
      isLoggedIn={isLoggedIn} 
      onLogout={handleLogout} 
      onLogin={handleLogin} 
      onClick={() => navigate('/')}/>
      <Main onLogin={handleLogin} user={user}/>
    </>
  );
}

export default App;
