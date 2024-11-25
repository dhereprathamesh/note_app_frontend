import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "3rem", color: "#ff6f61" }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
        Oops! It seems like you're lost in space.
      </p>
      <img
        src="https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif"
        alt="Funny lost in space GIF"
        style={{
          width: "300px",
          height: "auto",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      />
      <p>
        But don't worry, we’ve got you covered! Click the button below to go
        back to safety.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
          fontSize: "1rem",
        }}
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
