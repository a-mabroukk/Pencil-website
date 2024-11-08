import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProfile = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    gmail: "",
    facebook: "",
    instagram: "",
    x: "",
    linkedin: "",
    github: "",
    picture: [],
  });
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/profile?profile_id=${profileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data.profile);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          setFlashMessage({
            type: "danger",
            message: "Profile not found or you do not have permission to modify.",
          });
          navigate("/home");
        }
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [profileId, navigate, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const imagesArray = [];
      for (let i = 0; i < files.length; i++) {
        if (fileValidate(files[i])) {
          imagesArray.push(files[i]);
        }
      }
      setProfile((prevProfile) => ({
        ...prevProfile,
        picture: imagesArray,
      }));
    } else {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append files and other profile data
    profile.picture.forEach((file) => {
      data.append("picture", file);
    });
    data.append("name", profile.name);
    data.append("username", profile.username);
    data.append("bio", profile.bio);
    data.append("gmail", profile.gmail);
    data.append("facebook", profile.facebook);
    data.append("instagram", profile.instagram);
    data.append("x", profile.x);
    data.append("linkedin", profile.linkedin);
    data.append("github", profile.github);

    console.log("Submitting profile data:", {
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      gmail: profile.gmail,
      facebook: profile.facebook,
      instagram: profile.instagram,
      x: profile.x,
      linkedin: profile.linkedin,
      github: profile.github,
      pictures: profile.picture.map((file) => file.name), // Log names of uploaded files
    });

    try {
      setLoading(true);
      const response = await axios.post(
        `http://127.0.0.1:5000/update-profile?profile_id=${profileId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile update response:", response.data); // Log response
      setProfile(response.data.profile); // Update the profile state with the new profile data
      alert("Profile updated successfully!");
      navigate(`/profile/${profileId}`);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const fileValidate = (file) => {
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg"
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "",
      }));
      return true;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "File type allowed only jpg, png, jpeg",
      }));
      return false;
    }
  };

  return (
    <div className="container mt-5">
      {flashMessage && <div className={`alert alert-${flashMessage.type}`}>{flashMessage.message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="picture">Profile Picture</label>
          <input
            type="file"
            className="form-control"
            name="picture"
            multiple
            onChange={handleChange}
          />
          {errors.picture && <div className="alert alert-danger">{errors.picture}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={profile.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={profile.username || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            className="form-control"
            id="bio"
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="gmail">Gmail</label>
          <input
            type="email"
            className="form-control"
            id="gmail"
            name="gmail"
            value={profile.gmail || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="text"
            className="form-control"
            id="facebook"
            name="facebook"
            value={profile.facebook || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="instagram">Instagram</label>
          <input
            type="text"
            className="form-control"
            id="instagram"
            name="instagram"
            value={profile.instagram || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="x">X</label>
          <input
            type="text"
            className="form-control"
            id="x"
            name="x"
            value={profile.x || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn</label>
          <input
            type="text"
            className="form-control"
            id="linkedin"
            name="linkedin"
            value={profile.linkedin || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="github">GitHub</label>
          <input
            type="text"
            className="form-control"
            id="github"
            name="github"
            value={profile.github || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;