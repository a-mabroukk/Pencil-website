import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import Footer from "../components/Footer/Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email_address: "",
    password1: "",
    password2: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/register",
        formData
      );
      console.log(response.data); // Handle success response
      navigate("/home"); // Redirect to home page or another page after successful registration
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        setErrorMessage(error.response.data.error); // Set error message from server response
      } else {
        setErrorMessage("An error occurred. Please try again."); // General error
      }
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center text-center">
        <form
          onSubmit={handleSubmit}
          className="form-register form-container "
          style={{ color: "white" }}
        >
          <img
            className="mb-4" width="200px"  height="200px"
            src={logo}
            alt=""
          />
          <h1 className="h3 mb-3 font-weight-normal">
            Please Create your Account
          </h1>
          <br />
          <label>User Name</label>
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="User Name"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label>Email Address</label>
          <input
            type="email"
            name="email_address"
            className="form-control"
            placeholder="Email Address"
            value={formData.email_address}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password1"
            className="form-control"
            placeholder="Password"
            value={formData.password1}
            onChange={handleChange}
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            name="password2"
            className="form-control"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            required
          />
          {errorMessage && (
            <div className="alert alert-danger mt-2">{errorMessage}</div>
          )}
          <br />
          <div className="checkbox mb-3">
            <p className="small fw-bold mt-2 pt-1 mb-0">
              Already have an account?
              <Link to={"/login"} className="link-danger">
                login
              </Link>
            </p>
          </div>
          <button type="submit" className="btn btn-lg btn-block btn-primary">
            Create an Account
          </button>
        </form>
        <br />
      </div>
      <div>
      <Footer />
      </div>
    </>
  );
};

export default Register;
