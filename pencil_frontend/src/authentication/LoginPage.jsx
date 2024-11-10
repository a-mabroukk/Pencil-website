import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import Footer from "../components/Footer/Footer";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const Login = async (e) => {
    e.preventDefault();
    await axios
      .post(
        "http://127.0.0.1:5000/login",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        //console.log(response.data);
        const token = response.data.access_token;
        setToken(token);
        localStorage.setItem("authToken", token);
        navigate("/home");
      })
      .catch(function (error) {
        console.log(error, "error");
        if (error.response && error.response.status === 401) {
          alert("Invalid credentials");
        }
      });
  };

  return (
    <>
      <div className="container d-flex justify-content-center text-center">
        <form className="form-container">
          <img
            className="mb-4"  width="200px"  height="180px"
            src={logo}
            alt=""
          />
          <h1 className="h3 mb-3 font-weight-normal">Please Login</h1>
          <br />

          {/* Username Input */}
          <label className="sr-only">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />

          {/* Password Input */}
          <label className="sr-only">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <div className="form-check mb-0">
            <input
              className="form-check-input me-2"
              type="checkbox"
              value=""
              id="form2Example3"
            />
            <label className="form-check-label" htmlFor="form2Example3">
              Remember me
            </label>
          </div>
          <div className="text-center text-lg-start mt-4 pt-2">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={Login}
            >
              Log In
            </button>
            <p className="small fw-bold mt-2 pt-1 mb-0">
              Don't have an account?
              <Link to={"/register"} className="link-danger">
                Register
              </Link>
            </p>
          </div>
        </form>
        {message && <div className="alert mt-3">{message}</div>}
        <br />
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;