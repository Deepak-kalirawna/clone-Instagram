import React from "react";
import InstagramLogo from "../assets/insta-logo.png";
import Avatar from "@mui/material/Avatar";
import "./Header.css";
function Header({ username }) {
  return (
    <div className="app__header">
      <img
        className="app__headerImage"
        src={InstagramLogo}
        alt="instagram-logo"
      />
      <Avatar className="app__headerAvatar" alt={username} src="image" />
    </div>
  );
}

export default Header;
