import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authReducer";
import { toast } from "sonner";
import apiCall from "../service/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const registered = location.state?.registeredEmail;
    if (registered) {
      setFormData((prev) => ({ ...prev, email: registered }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiCall("/auth/login/", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      localStorage.setItem("authToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(loginSuccess({ user: data.user }));
      toast.success("Logged in successfully");

      const redirectTo = location.state?.from || "/browse";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      
      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-rentease-yellow font-space-grotesk mb-2">
                Welcome Back
              </h1>
              <p className="text-rentease-light font-inter">
                Sign in to your RentEase account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-rentease-yellow bg-rentease-dark border-rentease-yellow/30 focus:ring-rentease-yellow"
                  />
                  <span className="ml-2 text-rentease-light font-inter text-sm">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-rentease-yellow hover:text-rentease-yellow/80 transition-colors font-inter text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-rentease-yellow text-rentease-dark py-3 font-inter font-medium hover:bg-rentease-yellow/90 transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-rentease-light font-inter">
                Don&apos;t have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-rentease-yellow hover:text-rentease-yellow/80 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
