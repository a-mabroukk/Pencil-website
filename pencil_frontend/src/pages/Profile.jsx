import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
//import userImage from "../assets/images/kate-stone.jpg";
//import arrow from "../assets/images/post/arrow.png";

const UserProfile = () => {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null); // Holds the logged-in user's ID

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      const decodedToken = JSON.parse(atob(savedToken.split(".")[1])); // Decode JWT to get user ID
      setUserId(decodedToken.user_id);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/profile?profile_id=${profileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Adjust API endpoint
        console.log(response.data);
        if (response.data.category === "success") {
          setProfile(response.data.profile);
        } else {
          setError(response.data.message || "Profile not found.");
        }
      } catch (err) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
        setError("Error fetching profile data. Please try again later.");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchProfile(); // Fetch data if token and postId are valid
    }
  }, [profileId, token]);

  // Edit profile
  //const handleEditBlog = () => {
    //navigate(`/update-profile/${profileId}`); // Redirect to the modify page
  //};


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <>
      <div className="author">
        <div className="container mt-5">
          <div className="row no-gutters justify-content-center">
            <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
              {profile.profile_picture ? (
                <img className="author-image" src={`http://127.0.0.1:5000/static/uploads/${profile.profile_picture}`}/>
                ) : (
                  <p>No profile picture uploaded</p>
              )}
            </div>
            <div className="col-md-8 col-lg-6 text-center text-md-left">
              <h1 className="mb-2">{profile.name || "Unknown"}</h1>
                <strong className="mb-2 d-block">Author</strong>
                <div className="content">
                  <p>{profile.bio || "No bio available."}</p>
                </div>
                <ul className="list-inline social-icons">
                  <li className="list-inline-item">{profile.gmail_links && (
                    <a href={profile.gmail_links}><i className="ti-email"></i></a>)}
                  </li>
                  <li className="list-inline-item">{profile.facebook_links && (
                    <a href={profile.facebook_links}><i className="ti-facebook"></i></a>)}
                  </li>
                  <li className="list-inline-item">{profile.instagram_links && (
                    <a href={profile.instagram_links}><i className="ti-instagram"></i></a>)}
                  </li>
                  <li className="list-inline-item">{profile.x_links && (
                    <a href={profile.x_links}><i className="ti-twitter-alt"></i></a>)}
                  </li>
                  <li className="list-inline-item">{profile.github_links && (
                    <a href={profile.github_links}><i className="ti-github"></i></a>)}
                  </li>
                  <li className="list-inline-item">{profile.linkedin_links && (
                    <a href={profile.linkedin_links}><i className="ti-linkedin"></i></a>)}
                  </li>
                  <li className="list-inline-item">
                    {/* Only show edit button if logged-in user is the profile owner */}
                    {userId === profile.owner && (
                    <Link to={`/update-profile/${profileId}`} role="button" className="ti-pencil-alt pointer-crouser fs-4"></Link>
                  )}
                </li>
                  <li className="list-inline-item">
                    <Link to={`/home`} role="button" className="back-button"></Link>
                  </li>
                </ul>
            </div>
          </div>
        </div>
        <svg className="author-shape-1" width="39" height="40" viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.965848 20.6397L0.943848 38.3906L18.6947 38.4126L18.7167 20.6617L0.965848 20.6397Z" stroke="#040306"
            strokeMiterlimit="10" />
          <path className="path" d="M10.4966 11.1283L10.4746 28.8792L28.2255 28.9012L28.2475 11.1503L10.4966 11.1283Z" />
          <path d="M20.0078 1.62949L19.9858 19.3804L37.7367 19.4024L37.7587 1.65149L20.0078 1.62949Z" stroke="#040306"
            strokeMiterlimit="10" />
        </svg>

      
        <svg className="author-shape-2" width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d)">
            <path className="path"
              d="M24.1587 21.5623C30.02 21.3764 34.6209 16.4742 34.435 10.6128C34.2491 4.75147 29.3468 0.1506 23.4855 0.336498C17.6241 0.522396 13.0233 5.42466 13.2092 11.286C13.3951 17.1474 18.2973 21.7482 24.1587 21.5623Z" />
            <path
              d="M5.64626 20.0297C11.1568 19.9267 15.7407 24.2062 16.0362 29.6855L24.631 29.4616L24.1476 10.8081L5.41797 11.296L5.64626 20.0297Z"
              stroke="#040306" strokeMiterlimit="10" />
          </g>
          <defs>
            <filter id="filter0_d" x="0.905273" y="0" width="37.8663" height="38.1979" filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
          </defs>
        </svg>

        
        <svg className="author-shape-3" width="39" height="40" viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.965848 20.6397L0.943848 38.3906L18.6947 38.4126L18.7167 20.6617L0.965848 20.6397Z" stroke="#040306"
            strokeMiterlimit="10" />
          <path className="path" d="M10.4966 11.1283L10.4746 28.8792L28.2255 28.9012L28.2475 11.1503L10.4966 11.1283Z" />
          <path d="M20.0078 1.62949L19.9858 19.3804L37.7367 19.4024L37.7587 1.65149L20.0078 1.62949Z" stroke="#040306"
            strokeMiterlimit="10" />
        </svg>

        
        <svg className="author-border" height="240" viewBox="0 0 2202 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 123.043C67.2858 167.865 259.022 257.325 549.762 188.784C764.181 125.427 967.75 112.601 1200.42 169.707C1347.76 205.869 1901.91 374.562 2201 1"
            strokeWidth="2" />
        </svg>
      </div>
      <section className="section-sm" id="post">
        <div className="container">
          <div className="row">
            {profile && profile.users && profile.users.posts && 
              profile.users.posts.length > 0 ? (
                <div className="col-lg-8 mx-auto">
                  {profile.users.posts.map((post) => (
                    <article className="card mb-4" key={post.id}>
                      <div className="post-slider">
                        <img src={`http://127.0.0.1:5000/static/uploads/${post.post_image}`} className="card-img-top" alt="post-thumb"/>
                      </div>
                      <div className="card-body">
                        <h2 className="mb-3"><a className="post-title" href={`/blog/${post.id}`} key={post.id}>{post.title}</a></h2>
                        <ul className="card-meta list-inline">
                          <li className="list-inline-item">
                            <a href={`/update-profile/${profile.owner}`} className="card-meta-author">
                              <img src={`http://127.0.0.1:5000/static/uploads/${profile.profile_picture}`}/>
                              <span></span>
                            </a>
                          </li>
                          <li className="list-inline-item">
								            <i className="ti-calendar"></i>{new Date(post.publication_date).toLocaleDateString()}
							            </li>
                        </ul>
                        <p>{post.content.slice(0, 100)}...</p>
						            <a href={`/blog/${post.id}`} className="btn btn-outline-primary">Read More</a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No posts available.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default UserProfile;