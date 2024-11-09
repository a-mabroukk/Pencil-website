import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
// import Context from './Context'; // Uncomment if using context for user data

export default function Header() {
  const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
  const [profileId, setProfileId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/my-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileId(response.data.profileId);
      })
      .catch((error) => {
        console.error("Error fetching profile ID:", error);
      });
  }, []);
  const handleLogout = async () => {
    try {
      await axios.get("http://127.0.0.1:5000/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove token and navigate to login page
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="navigation fixed-top">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-white">
          <a className="navbar-brand order-1" href="index.html">
            <img className="img-fluid" width="100px" src="images/logo.png"
              alt=""/>
          </a>
          <div className="collapse navbar-collapse text-center order-lg-2 order-3" id="navigation">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                {profileId ? (
                  <NavLink className="nav-link" to={`/profile/${profileId}`}>
                    Profile
                  </NavLink>
                ) : (
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                )}
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/home" role="button">
                  homepage
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/publish" role="button">
                  Write
                </NavLink>
              </li>
              {profileId && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="#" onClick={handleLogout}>Logout</NavLink>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
