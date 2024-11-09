import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
// import Context from './Context'; // Uncomment if using context for user data

export default function Header() {
  const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
  const [profileId, setProfileId] = useState(null);

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
                <NavLink className="nav-link" to={`/profile/${profileId}`}>
                  Profile
                </NavLink>
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
              <li className="nav-item">
                <NavLink className="nav-link" to="/logout">Logout</NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
