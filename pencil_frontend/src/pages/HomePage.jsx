import React, { useEffect, useState } from "react";
import axios from "axios";
import postImage from "../assets/images/post/post-1.jpg";
import userImage from "../assets/images/kate-stone.jpg";
import arrow from "../assets/images/post/arrow.png";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState(null); // Initially null to differentiate initial load
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  // Fetch all posts from Flask backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching posts...");
      setLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:5000/home");
        console.log("Response data:", response.data);
        setPosts(response.data || []);
      } catch (err) {
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/home",
        { input_search: searchInput },
        { headers: { "Content-Type": "application/json" } }
      );

      // Update searchResults based on the response
      const results = Array.isArray(response.data) ? response.data : [];
      setSearchResults(results.length > 0 ? results : []); // Empty array if no results
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="banner text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto">
              <h1 className="mb-5">What Would You <br/> Like To Read Today?</h1>
            </div>
          </div>
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search posts..."
              className="form-control"
            />
            <button type="submit" className="btn btn-primary mt-2">Search</button>
          </form>
        </div>

        <svg className="banner-shape-1" width="39" height="40" viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.965848 20.6397L0.943848 38.3906L18.6947 38.4126L18.7167 20.6617L0.965848 20.6397Z" stroke="#040306"
            strokeMiterlimit="10" />
          <path className="path" d="M10.4966 11.1283L10.4746 28.8792L28.2255 28.9012L28.2475 11.1503L10.4966 11.1283Z" />
          <path d="M20.0078 1.62949L19.9858 19.3804L37.7367 19.4024L37.7587 1.65149L20.0078 1.62949Z" stroke="#040306"
            strokeMiterlimit="10" />
        </svg>

        <svg className="banner-shape-2" width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
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

        <svg className="banner-shape-3" width="39" height="40" viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.965848 20.6397L0.943848 38.3906L18.6947 38.4126L18.7167 20.6617L0.965848 20.6397Z" stroke="#040306"
            strokeMiterlimit="10" />
          <path className="path" d="M10.4966 11.1283L10.4746 28.8792L28.2255 28.9012L28.2475 11.1503L10.4966 11.1283Z" />
          <path d="M20.0078 1.62949L19.9858 19.3804L37.7367 19.4024L37.7587 1.65149L20.0078 1.62949Z" stroke="#040306"
            strokeMiterlimit="10" />
        </svg>

        <svg className="banner-border" height="240" viewBox="0 0 2202 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 123.043C67.2858 167.865 259.022 257.325 549.762 188.784C764.181 125.427 967.75 112.601 1200.42 169.707C1347.76 205.869 1901.91 374.562 2201 1"
            strokeWidth="2" />
        </svg>
      </div>
      {/* Conditional Rendering for Search Results */}
      {searchResults !== null ? (
        <section className="section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 mb-4">
                <h1 className="h2 mb-4">Search results for
                  <mark>{decodeURIComponent(searchInput).replace(/\+/g, ' ')}</mark>
                </h1>
              </div>
              <div className="col-lg-10">
                {searchResults.length > 0 ? (
                  searchResults.map((post) => (
                    <article key={post.id} className="card mb-4">
                      <div className="row card-body">
                        <div className="col-md-4 mb-4 mb-md-0">
                          <div className="post-slider slider-sm">
                            <img src={`http://127.0.0.1:5000/static/uploads/${post.post_image}`} className="card-img" alt="post-thumb" style={{ height: "200px", objectFit: "cover" }}/>
                          </div>
                        </div>
                        <div className="col-md-8">
                          <h3 className="h4 mb-3"><a className="post-title" href={`/blog/${post.id}`}>{post.title}</a></h3>
                          <ul className="card-meta list-inline">
                            <li className="list-inline-item">
                              <a href="author-single.html" className="card-meta-author">
                                <img src="images/john-doe.jpg" alt="John Doe"/>
                                <span>John Doe</span>
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <i className="ti-calendar"></i>{new Date(post.publication_date).toLocaleDateString()}
                            </li>
                          </ul>
                          <p>{post.title}</p>
                          <a href={`/blog/${post.id}`} className="btn btn-outline-primary">Read More</a>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="col-lg-10 text-center">
                    <img className="mb-5" src="images/no-search-found.svg" alt=""/>
                    <h3>No Search Found</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="section-sm">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 mb-5 mb-lg-0">
                <div className="col-12 mb-5 mb-lg-0">
          <h2 className="h5 section-title">All Posts</h2>
          <div className="row">
            {posts.map((post) => (
              <div key={post.id} className="col-lg-4 col-sm-6">
                <article className="card mb-4">
                  <div className="post-slider slider-sm">
                    <img src={`http://127.0.0.1:5000/static/uploads/${post.post_image}`} className="card-img-top" alt="post-thumb"/>
                  </div>
                  <div className="card-body">
                    <h3 className="h4 mb-3"><a className="post-title" href={`/blog/${post.id}`}>{post.title}</a></h3>
                    <ul className="card-meta list-inline">
                      <li className="list-inline-item">
                        <a href="author-single.html" className="card-meta-author">
                          <img src="images/john-doe.jpg" alt="John Doe"/>
                          <span>John Doe</span>
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
              </div>
            ))}
          </div>
          </div>
          </div>
          </div>
        </div>
        </section>
      )}
    </>
  );
};

export default HomePage;