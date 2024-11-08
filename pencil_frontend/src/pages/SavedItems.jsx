import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SavedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const fetchSavedPosts = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/saved-items", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setItems(response.data);
        } catch (err) {
          setError("Failed to load saved items. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchSavedPosts();
    }
  }, [token]);

  if (loading) {
    return <p>Loading saved items...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mt-5">
      <header>
        <h1>Saved Items</h1>
      </header>
      <div className="row mt-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div className="col-md-4" key={item.id}>
              <div className="card mb-4">
                <img
                  src={item.post_image || "https://via.placeholder.com/150"}
                  className="card-img-top"
                  alt={item.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">
                    {item.content.slice(0, 100)}...
                  </p>
                  <button
                    onClick={() => navigate(`/blog/${item.id}`)}
                    className="btn btn-primary"
                  >
                    View Blog
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs saved yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedItems;