import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditReply = () => {
  const { replyId } = useParams();
  const [replyText, setReplyText] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchReply = async () => {
      if (!token) {
        alert("You need to log in first.");
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/edit-reply-on-comment?reply_to_modify=${replyId}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Check if the response contains valid reply data
        if (response.data.replies && response.data.replies.text) {
          setReplyText(response.data.replies.text); // Set the actual reply text
        } else {
          alert("Reply data not found.");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            alert("Session expired. Please log in again.");
            navigate('/login');
          } else if (error.response.status === 500) {
            alert("An error occurred on the server. Please try again later.");
          } else {
            alert("Error fetching reply.");
          }
        } else {
          alert("Network error. Please check your connection.");
        }
        console.error("Error fetching reply:", error);
      }
    };

    fetchReply();
  }, [replyId, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You need to log in first.");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/edit-reply-on-comment?reply_to_modify=${replyId}`,
        { reply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("The reply has been updated successfully.");
        navigate(`/blog/${response.data.reply_to_modify}`);
      }
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.errors || {});
        alert(error.response.data.message || "Failed to update the reply.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Error updating reply:", error);
    }
  };

  return (
    <div>
      <h2>Edit Reply</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="replyText">Reply</label>
          <textarea
            id="replyText"
            className="form-control"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
          />
          {errors.reply && <div className="text-danger">{errors.reply.join(', ')}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditReply;