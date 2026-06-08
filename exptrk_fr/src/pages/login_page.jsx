import React from "react";
import "./authcss.css";
import { Link , useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import {useState} from "react";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res=await axios.post("https://ext-bd.onrender.com/login", {
        "username": username,
        "password": password,
        
      });
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("username", res.data.username);
      navigate("/dashboard");
    } catch (error) {
      
      alert("Login failed. Please check your credentials and try again or register if you don't have an account.");

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-top">

          <h1>Welcome Back</h1>

          <p>
            Login to continue managing your finances
          </p>

        </div>





        <form className="auth-form" onSubmit={handleLogin}>

          <div className="auth-input-group">

            <label>Username</label>

            <div className="auth-input-wrapper">

              <User size={18} />

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

            </div>

          </div>





          <div className="auth-input-group">

            <label>Password</label>

            <div className="auth-input-wrapper">

              <Lock size={18} />

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>

          </div>





          <button className="auth-button">
            Login
          </button>

        </form>





        <div className="auth-bottom">

          <p>
            Dont have an account?
          </p>

          <Link to="/register">
            Register
          </Link>

        </div>

      </div>

    </div>
  );
};

export default LoginPage;