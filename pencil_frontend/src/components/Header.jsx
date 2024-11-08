import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import Context from './Context'; // Uncomment if using context for user data

export default function Header() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
    const { profileId } = useParams(); // Replace `current_user` with the actual context or prop

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/profile?profile_id=${profileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                if (response.data.category === "success") {
                    navigate(`/my-profile/`)
                    //setProfile(response.data.profile);
                } else {
                    setError(response.data.message || "Profile not found.");
                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
                setError("Error fetching profile data. Please try again later.");
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token && profileId) {
            fetchProfile();
        }
    }, [profileId, token, navigate]);

    return (
        <nav className="navbar navbar-expand-lg navbar-white">
            <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                    <NavLink className="nav-link" to={`/my-profile`}>
                        Profile
                    </NavLink>
                    <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/home">Home</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/publish">Write</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/logout">Logout</NavLink>
                </li>
            </ul>
        </nav>
    );
}