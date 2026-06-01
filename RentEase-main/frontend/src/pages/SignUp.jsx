import { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import apiCall from "../service/api";
import { toast } from "sonner";

const PASSWORD_HINT =
  "Use at least 8 characters with letters and numbers (follow strength hints after submit).";

function validatePasswordClient(password) {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    const pwdErr = validatePasswordClient(formData.password);
    if (pwdErr) {
      toast.error(pwdErr);
      return;
    }

    try {
      await apiCall("/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      toast.success("Account created successfully. Sign in to continue.");
      navigate("/login", {
        replace: true,
        state: { registeredEmail: formData.email.trim().toLowerCase() },
      });
    } catch (error) {
      toast.error(error.message || "Registration failed");
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
                Join RentEase
              </h1>
              <p className="text-rentease-light font-inter">
                Create your account and start renting
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-rentease-yellow font-medium font-inter mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-rentease-yellow font-medium font-inter mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

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
                  placeholder="john@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Phone Number <span className="text-rentease-light/60 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                  placeholder="+91 98765 43210"
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
                  autoComplete="new-password"
                />
                <p className="text-xs text-rentease-light/70 mt-2 font-inter">{PASSWORD_HINT}</p>
              </div>

              <div>
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1 text-rentease-yellow bg-rentease-dark border-rentease-yellow/30 focus:ring-rentease-yellow"
                    required
                  />
                  <span className="text-rentease-light font-inter text-sm">
                    I agree to RentEase&apos;s{" "}
                    <Link to="/terms" className="text-rentease-yellow">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-rentease-yellow">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-rentease-yellow text-rentease-dark py-3 font-inter font-medium hover:bg-rentease-yellow/90 transition-colors"
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-rentease-light font-inter">
                Already have an account?{" "}
                <Link to="/login" className="text-rentease-yellow font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
