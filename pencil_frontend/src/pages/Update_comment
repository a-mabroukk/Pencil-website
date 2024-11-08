import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateComment = () => {
  const { commentId } = useParams();
  const [commentText, setCommentText] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchComment = async () => {
      if (!token) {
        alert("You need to log in first.");
        return;
      }
      try {
        const response = await axios.get(`http://127.0.0.1:5000/modify-comment?comment_to_modify=${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCommentText(response.data.text);
      } catch (error) {
        console.error("Error fetching comment:", error);
        alert("Failed to load the comment. Please try again.");
      }
    };

    fetchComment();
  }, [commentId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/modify-comment?comment_to_modify=${commentId}`,
        { text: commentText }, // Corrected this line to match backend expectations
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        alert("The comment has been updated successfully.");
        navigate(`/blog/${response.data.comment_to_modify}`); // Use the correct field from the response
      }
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.errors || {});
        alert(error.response.data.message || "Failed to update the comment.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div>
      <h2>Update Comment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            className="form-control"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          {errors.comment && <div className="text-danger">{errors.comment.join(', ')}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateComment;