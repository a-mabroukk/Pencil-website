import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import postImage from "../assets/images/post/post-1.jpg";
import userImage from "../assets/images/kate-stone.jpg";
import arrow from "../assets/images/post/arrow.png";

const BlogPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [childReplyText, setChildReplyText] = useState({});
  const [saveMessage, setSaveMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To track errors
  const [token, setToken] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showChildReplyForm, setShowChildReplyForm] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Fetch blog and comments on mount
  useEffect(() => {
    const fetchBlogAndComments = async () => {
      setIsLoading(true); // Set loading state before making API call
      setError(null); // Reset any previous error

      try {
        if (!postId || !token) {
          throw new Error("Missing postId or token.");
        }

        const response = await axios.get(
          `http://127.0.0.1:5000/blog?post_id=${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          console.log("Blog and comments fetched successfully.", response.data);
          setBlog(response.data.post);
          setComments(response.data.comments || []);
        } else {
          throw new Error("No blog data received.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // If unauthorized, redirect to the login page
          navigate("/login");
        }
        console.error("Error fetching blog and comments:", error.message);
        setError(error.message || "Error fetching blog and comments.");
      } finally {
        setIsLoading(false); // Ensure loading state is set to false even on error
      }
    };
    if (token && postId) {
      fetchBlogAndComments(); // Fetch data if token and postId are valid
    }
  }, [postId, token]);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/blog?post_id=${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(response.data.comments || []);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
      console.error("Error fetching comments:", error);
      console.error(
        "Error fetching blog and comments:",
        error.response || error.message
      );

      setError("Error fetching comments.");
    }
  };

  // Add comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!commentText.trim()) return;

      await axios.post(
        `http://127.0.0.1:5000/blog?post_id=${postId}`,
        { comment: commentText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Error adding comment.");
    }
  };

  // Add reply to a comment
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    console.log("commentId", commentId);
    try {
      if (!replyText[commentId]?.trim()) return;
      await axios.post(
        `http://127.0.0.1:5000/blog?post_id=${postId}`,
        {
          reply: replyText[commentId],
          comment_id: commentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReplyText({ ...replyText, [commentId]: "" });
      fetchComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      setError("Error adding reply.");
    }
  };

  // Add reply to a reply (child reply)
  const handleChildReplySubmit = async (e, replyId) => {
    e.preventDefault();
    try {
      if (!childReplyText[replyId]?.trim()) return;

      await axios.post(
        `http://127.0.0.1:5000/blog?post_id=${postId}`,
        {
          reply_reply: childReplyText[replyId],
          reply_id: replyId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChildReplyText({ ...childReplyText, [replyId]: "" });
      fetchComments();
    } catch (error) {
      console.error("Error adding child reply:", error);
      setError("Error adding child reply.");
    }
  };
  const handleDeleteBlog = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/delete?post_id=${postId}`,
        {}, // Empty data payload
        { headers: { Authorization: `Bearer ${token}` } } // Headers containing JWT token
      );

      if (response.status === 200) {
        alert("Blog deleted successfully.");
        navigate("/"); // Navigate to the home page after successful deletion
      } else {
        // Handle unexpected status codes
        alert(response.data.message || "Error deleting blog.");
      }
    } catch (error) {
      if (error.response) {
        // Specific error based on response status
        alert(error.response.data.message || "Failed to delete the blog.");
      } else {
        // Generic error for other cases
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Error deleting blog:", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    console.log("Attempting to delete comment with ID:", commentId); // Debugging output
    if (!commentId) {
      alert("Error: commentId is missing.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/delete-comment?comment_id=${commentId}`,
        {}, // Empty data payload
        { headers: { Authorization: `Bearer ${token}` } } // Headers containing JWT token
      );

      // Check for a successful response
      if (response.status === 200) {
        alert(response.data.message || "Comment deleted successfully."); // Use the message from the response
        //navigate(`/blog/${response.data.post_id}`); // Navigate to the post associated with the comment
        fetchComments(); // Refresh comments after successful deletion
      } else {
        // Handle unexpected status codes
        alert(response.data.message || "Error deleting comment.");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Failed to delete the comment.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    console.log("Attempting to delete reply with ID:", replyId); // Debugging output
    if (!replyId) {
      alert("Error: replyId is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reply?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/delete-reply-comment?reply_id=${replyId}`,
        {}, // Empty data payload
        { headers: { Authorization: `Bearer ${token}` } } // Headers containing JWT token
      );

      if (response.status === 200) {
        alert(response.data.message || "Reply comment deleted successfully.");
        fetchComments(); // Refresh comments after successful deletion
      } else {
        alert(response.data.message || "Error deleting reply.");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Failed to delete the reply.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Error deleting reply:", error);
    }
  };

  // Save blog
  const handleSaveBlog = async () => {
    if (!token) {
      alert("Please log in first!");
      navigate("/login"); // Redirect to login if not logged in
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/blog?post_id=${postId}`,
        { save: true },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
        }
      );
      setSaveMessage(response.data.message);
      console.log("Blog saved successfully:", response.data);
      navigate(`/saved-items/`);
    } catch (error) {
      console.error("Error saving blog:", error);
      setError("Error saving blog.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };
  const toggleChildReplyForm = (replyId) => {
    setShowChildReplyForm((prevState) => ({
      ...prevState,
      [replyId]: !prevState[replyId],
    }));
  };

  return (
    <div>
      {/* Blog Post */}
      {blog && (
        <div className="blog-post">
          <section className="section">
            <div className="container">
              <div className="row justify-content-center">
                <div className=" col-lg-9  mb-5 mb-lg-0">
                  <article>
                    <div className="post-slider mb-4">
                      <img
                        src={`http://127.0.0.1:5000/static/uploads/${blog.post_image}`}
                        className="card-img"
                        alt="post-thumb"
                      ></img>
                    </div>
                    <h1 className="h2">{blog.title} </h1>
                    <div className="d-flex justify-content-between">
                      <ul className="card-meta my-3 list-inline">
                        <li className="list-inline-item">
                          <a
                            href={`/profile/${blog.owner}`}
                            className="card-meta-author"
                          >
                            <img
                              src={`http://127.0.0.1:5000/static/uploads/${blog.image}`}
                            ></img>
                            <span>{blog.userName}</span>
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <i className="ti-calendar"></i>
                          {new Date(blog.publication_date).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </li>
                      </ul>
                      {blog.owner == blog.currentUser && (
                        <>
                          <Link
                            to={`/modify/${postId}`}
                            role="button"
                            className="ti-pencil-alt pointer-crouser fs-4"
                          ></Link>
                          <Link
                            to="#"
                            role="button"
                            className="ti-trash pointer-cursor fs-4"
                            onClick={handleDeleteBlog}
                          ></Link>
                        </>
                      )}
                      <Link
                        to="#"
                        role="button"
                        className="ti-save pointer-cursor fs-4"
                        onClick={handleSaveBlog}
                      ></Link>
                    </div>

                    <div className="content">
                      <p>{blog.content}</p>
                    </div>
                  </article>
                  {/*    <button onClick={handleSaveBlog} className="btn btn-success">
                    Save Blog
                  </button>
                  {saveMessage && <p>{saveMessage}</p>}*/}
                </div>
                {/* Comments Section */}
                <div className="col-lg-9 col-md-12">
                  <div className="mb-5 border-top mt-4 pt-5">
                    <h3 className="mb-4">Comments</h3>
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="media d-block d-sm-flex mb-4 pb-4">
                            <a
                              className="d-inline-block mr-2 mb-3 mb-md-0"
                              href={`/profile/${comment.comment_owner}`}
                            >
                              <img
                                src={`http://127.0.0.1:5000/static/uploads/${comment.image}`}
                                width={70}
                                height={70}
                                className="mr-3 rounded-circle"
                                alt=""
                              ></img>
                            </a>
                            <div className="media-body">
                              <a
                                href={`/profile/${comment.comment_owner}`}
                                className="h4 d-inline-block mb-3"
                              >
                                {comment.userName}
                              </a>
                              <p>{comment.text}</p>
                              <Link
                                to={`/modify-comment/${comment.id}`}
                                role="button"
                                className="ti-pencil-alt pointer-cursor fs-4"
                              />
                              <Link
                                to="#"
                                role="button"
                                className="ti-trash pointer-cursor fs-4"
                                onClick={() => handleDeleteComment(comment.id)}
                              ></Link>

                              <span className="text-black-800 mr-3 font-weight-600">
                                {new Date(
                                  comment.publication_date
                                ).toLocaleString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                              <a
                                className="text-primary font-weight-600 reply-button"
                                data-comment-id={comment.id}
                                onClick={() => toggleReplyForm(comment.id)}
                              >
                                Reply
                              </a>
                              {/* Reply Form */}
                              {/*<div id="reply-form-{{ comment.id }}" className="reply-form" style="display: none; margin-top: 10px;">*/}
                              <div
                                className={`reply-form ${
                                  showReplyForm[comment.id] ? "show" : ""
                                }`}
                              >
                                {showReplyForm[comment.id] && (
                                  <form
                                    className="d-flex justify-content-center align-items-center"
                                    onSubmit={(e) =>
                                      handleReplySubmit(e, comment.id)
                                    }
                                  >
                                    <textarea
                                      rows="auto"
                                      minrows="3"
                                      value={replyText[comment.id] || ""}
                                      className="form-control shadow-none reply"
                                      onChange={(e) =>
                                        setReplyText({
                                          ...replyText,
                                          [comment.id]: e.target.value,
                                        })
                                      }
                                      placeholder="Write a reply..."
                                    />

                                    <button
                                      className="btn btn-primary px-3 py-2 my-3 ml-2 text-nowrap"
                                      type="submit"
                                    >
                                      send
                                    </button>
                                  </form>
                                )}
                              </div>
                              {/*</div>*/}
                            </div>
                          </div>

                          {comment.replies &&
                            comment.replies.map((reply) => (
                              <div key={reply.id} className="reply ">
                                <div className="d-flex flex-column align-items-end">
                                  <div className="media d-block d-sm-flex w-100">
                                    <div className="d-inline-block mr-2 mb-3 mb-md-0">
                                      <a href={`/profile/${reply.responder}`}>
                                        <img
                                          src={`http://127.0.0.1:5000/static/uploads/${reply.image}`}
                                          width={50}
                                          height={50}
                                          className="mr-3 rounded-circle"
                                          alt=""
                                        />
                                      </a>
                                    </div>
                                    <div className="media-body">
                                      <a
                                        href={`/profile/${reply.responder}`}
                                        className="h4 d-inline-block mb-3"
                                      >
                                        {reply.userName}
                                      </a>
                                      <p>{reply.text}</p>
                                      <Link
                                        to={`/edit-reply-on-comment/${reply.id}`}
                                        role="button"
                                        className="ti-pencil-alt pointer-cursor fs-4"
                                      ></Link>
                                      <Link
                                        to="#"
                                        role="button"
                                        className="ti-trash pointer-cursor fs-4"
                                        onClick={() =>
                                          handleDeleteReply(reply.id)
                                        }
                                      ></Link>
                                      <span className="text-black-800 mr-3 font-weight-600">
                                        {new Date(
                                          reply.publication_date
                                        ).toLocaleString("en-US", {
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "numeric",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}
                                      </span>
                                      <a
                                        className="text-primary font-weight-600 reply-button"
                                        data-comment-id="{{ reply.id }}"
                                        onClick={() =>
                                          toggleChildReplyForm(reply.id)
                                        }
                                      >
                                        Reply
                                      </a>
                                    </div>

                                    {/* Child Reply Form */}
                                    {/*<div id="reply-form-{{ reply.id }}" className="reply-form" style="display: none; margin-top: 10px;">*/}
                                  </div>
                                  <div
                                    className={`reply-child reply-form ${
                                      showChildReplyForm[reply.id] ? "show" : ""
                                    }`}
                                  >
                                    {showChildReplyForm[reply.id] && (
                                      <form
                                        className="d-flex justify-content-center align-items-center"
                                        onSubmit={(e) =>
                                          handleChildReplySubmit(e, reply.id)
                                        }
                                      >
                                        <textarea
                                          rows="auto"
                                          minrows="3"
                                          value={childReplyText[reply.id] || ""}
                                          className="form-control shadow-none reply"
                                          onChange={(e) =>
                                            setChildReplyText({
                                              ...childReplyText,
                                              [reply.id]: e.target.value,
                                            })
                                          }
                                          placeholder="Write a reply to this reply..."
                                        />
                                        <button
                                          className="btn btn-primary px-3 py-2 my-3 ml-2 text-nowrap"
                                          type="submit"
                                        >
                                          Comment Now
                                        </button>
                                      </form>
                                    )}
                                  </div>
                                </div>
                                {reply.replies &&
                                  reply.replies.map((childReply) => (
                                    <div key={childReply.id} className="ml-5 mt-3 child-reply">
                                      <div className="media d-block d-sm-flex w-100">
                                        <div className="d-inline-block mr-2 mb-3 mb-md-0"
                                          href={`/profile/${childReply.child_reply_owner}`}>
                                          <a>
                                            <img
                                              src={`http://127.0.0.1:5000/static/uploads/${childReply.image}`}
                                              width={50}
                                              height={50}
                                              className="mr-3 rounded-circle"
                                              alt=""
                                            />
                                          </a>
                                        </div>

                                        <div className="media-body">
                                          <a
                                            href={`/profile/${childReply.child_reply_owner}`}
                                            className="h4 d-inline-block mb-3"
                                          >
                                            {childReply.userName}
                                          </a>
                                          <p>{childReply.text}</p>

                                          <span className="text-black-800 mr-3 font-weight-600">
                                            {new Date(
                                              childReply.publication_date
                                            ).toLocaleString("en-US", {
                                              month: "long",
                                              day: "numeric",
                                              year: "numeric",
                                              hour: "numeric",
                                              minute: "2-digit",
                                              hour12: true,
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ))}
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-4">Leave a Reply</h3>
                    <form onSubmit={handleCommentSubmit}>
                      <div className="row">
                        <div className="form-group col-md-12">
                          <textarea
                            className="form-control shadow-none"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your comment..."
                            required
                          ></textarea>
                        </div>
                      </div>
                      <button className="btn btn-primary" type="submit">
                        Comment Now
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

BlogPage.propTypes = {
  token: PropTypes.string.isRequired,
};

export default BlogPage;
