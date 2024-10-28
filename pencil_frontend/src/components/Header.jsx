import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import Context from './Context'; // Adjust the path as necessary

export default function Header() {
    const { userData } = useContext(Context); // Access user data from context

    return (
        <nav className="navbar navbar-expand-lg navbar-white">
            <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                    {userData ? (
                        <NavLink className="nav-link" to={`/profile/${userData.id}`}>
                            Profile
                        </NavLink>
                    ) : (
                        <NavLink className="nav-link" to="/login">Login</NavLink>
                    )}
                </li>
                <li className="nav-item"><NavLink className="nav-link" to="/home">Home</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/publish">Write</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/logout">Logout</NavLink></li>
            </ul>
            {/* Search Form */}
            <form className="search-bar">
                <input id="search-query" name="s" type="search" placeholder="Type &amp; Hit Enter..." />
            </form>
        </nav>
    );
}
