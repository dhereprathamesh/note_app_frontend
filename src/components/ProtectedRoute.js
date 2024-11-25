import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  // Check for the presence of the token in localStorage

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in");
      return;
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
