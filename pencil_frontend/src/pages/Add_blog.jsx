import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    console.log("Form Data being sent:", formData);
    console.log("Authorization Token:", token); // Log token


    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/publish",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adding token to the Authorization header
          },
        }
      );

      console.log("Hhhhhhhhhhhhhhhhhhhhh",response.data.post_id); // Handle success response
      navigate(`/blog/${response.data.post_id}`); // Redirect to the newly created post
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.error ||
            "An error occurred while creating the post."
        );
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add a New Blog Post</h2>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows="5"
            required
            value={formData.content}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <a href="/blog" className="btn btn-secondary">
          Cancel
        </a>
      </form>
    </div>
  );
};

export default PostForm;