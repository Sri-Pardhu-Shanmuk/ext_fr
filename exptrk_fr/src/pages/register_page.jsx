import React from "react";
import "./authcss.css";
import { Link , useNavigate } from "react-router-dom";
import { User, Lock, Mail } from "lucide-react";
import {useState} from "react";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const backendUrl = "https://ext-bd.onrender.com/";


  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post(`${backendUrl}register`, {
      "username": username,
      "password": password
    });
    navigate("/");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-top">

          <h1>Create Account</h1>

          <p>
            Create your finance dashboard account
          </p>

        </div>





        <form className="auth-form" onSubmit={handleRegister}>

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
            Register
          </button>

        </form>





        <div className="auth-bottom">

          <p>
            Already have an account?
          </p>

          <Link to="/">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default RegisterPage;