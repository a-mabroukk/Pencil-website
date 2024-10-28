// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import Header from './components/Header';
import HomePage from "./pages/HomePage";
import Login from "./authentication/LoginPage";
import Register from "./authentication/Register";
import Logout from "./authentication/Logout";
import PostForm from "./pages/Add_blog";
import BlogPost from "./pages/Blog";
import ModifyPost from "./pages/Modify_blog";
import EditProfile from "./pages/Edit_profile";
import UserProfile from "./pages/Profile";
import { UserProvider } from './components/Context'; // Import the provider

function App() {
    const [token, setToken] = useState('');

    const Layout = () => {
        return (
            <>
                <Header />
                <div className="content"><Outlet /></div>
            </>
        );
    };
  

    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/home" element={<HomePage token={token} />} />
                        <Route path="/publish" element={<PostForm token={token} />} />
                        <Route path="/profile/:profileId" element={<UserProfile token={token} />} />
                        <Route path="/logout" element={<Logout token={token} />} />
                    </Route>
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/register" element={<Register token={token} />} />
                    <Route path="/blog/:postId" element={<BlogPost token={token} />} />
                    <Route path="/modify/:postId" element={<ModifyPost token={token} />} />
                    <Route path="/update-profile/:profileId" element={<EditProfile token={token} />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;