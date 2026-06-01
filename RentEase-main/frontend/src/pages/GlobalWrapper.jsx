import { Toaster } from "sonner";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess, logout } from "../store/authReducer";
import { ThemeProvider } from "../context/ThemeContext";

export const GlobalWrapper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth token and user data
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch(loginSuccess({ user }));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        dispatch(logout());
        navigate("/login");
      }
    } else {
      dispatch(logout());
    }
  }, [dispatch, navigate]);

  return (
    <ThemeProvider>
      <Outlet />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};
