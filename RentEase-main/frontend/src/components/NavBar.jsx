import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authReducer";
import { toast } from "sonner";
// import RentEaseLogo from "./RentEaseLogo";
// import Logo from "./Logo";

const navLinks = [
  { to: "/", text: "Home" },
  { to: "/browse", text: "Browse Rentals" },
  { to: "/post-rental", text: "Post Rental" },
  { to: "/about", text: "About" },
  { to: "/contact", text: "Contact" },
  { to: "/dashboard", text: "Dashboard", authOnly: true },
];

const authLinks = [
  { to: "/login", text: "Login" },
  { to: "/sign-up", text: "Sign Up" },
];

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const avatarLetter = (user?.first_name || user?.email || "U").charAt(0).toUpperCase();
  const filteredLinks = navLinks.filter((link) => !link.authOnly || isAuthenticated);

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    dispatch(logout());
    setIsProfileOpen(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="bg-rentease-dark border-b border-rentease-yellow/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-rentease-yellow flex items-center justify-center">
              <span className="text-rentease-dark font-bold text-lg font-mono">R</span>
            </div>
            <span className="text-rentease-yellow font-bold text-xl font-space-grotesk">
              RentEase
            </span>
          </Link>
          

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors duration-200 font-inter font-medium ${
                    isActive ? "text-rentease-yellow" : "text-rentease-light hover:text-rentease-yellow"
                  }`
                }
              >
                {link.text}
              </NavLink>
            ))}
            {isAuthenticated && user?.is_staff && (
              <Link
                to="/admin-dashboard"
                className="text-rentease-light hover:text-rentease-yellow transition-colors duration-200 font-inter font-medium"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-rentease-yellow text-rentease-dark font-bold"
                >
                  {avatarLetter}
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-2 w-44 bg-rentease-gray border border-rentease-yellow/20 py-2 z-50"
                    >
                      <Link to="/profile" className="block px-4 py-2 text-rentease-light hover:text-rentease-yellow">My Profile</Link>
                      <Link to="/my-rentals" className="block px-4 py-2 text-rentease-light hover:text-rentease-yellow">My Rentals</Link>
                      <Link to="/my-requests" className="block px-4 py-2 text-rentease-light hover:text-rentease-yellow">My Requests</Link>
                      <button onClick={logoutHandler} className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300">Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              authLinks.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    index === 0
                      ? "text-rentease-light hover:text-rentease-yellow transition-colors duration-200 font-inter font-medium"
                      : "bg-rentease-yellow text-rentease-dark px-4 py-2 font-inter font-medium hover:bg-rentease-yellow/90 transition-colors duration-200"
                  }
                >
                  {link.text}
                </Link>
              ))
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-rentease-light hover:text-rentease-yellow focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-rentease-dark border-t border-rentease-yellow/20"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {filteredLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-3 py-2 text-rentease-light hover:text-rentease-yellow hover:bg-rentease-gray/20 transition-colors duration-200 font-inter"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
                {isAuthenticated && user?.is_staff && (
                  <Link
                    to="/admin-dashboard"
                    className="block px-3 py-2 text-rentease-light hover:text-rentease-yellow hover:bg-rentease-gray/20 transition-colors duration-200 font-inter"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="border-t border-rentease-yellow/20 pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" className="block px-3 py-2 text-rentease-light" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                      <Link to="/my-rentals" className="block px-3 py-2 text-rentease-light" onClick={() => setIsMobileMenuOpen(false)}>My Rentals</Link>
                      <Link to="/my-requests" className="block px-3 py-2 text-rentease-light" onClick={() => setIsMobileMenuOpen(false)}>My Requests</Link>
                      <button onClick={logoutHandler} className="block px-3 py-2 text-red-400">Logout</button>
                    </>
                  ) : (
                    authLinks.map((link, index) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={
                          index === 0
                            ? "block px-3 py-2 text-rentease-light hover:text-rentease-yellow hover:bg-rentease-gray/20 transition-colors duration-200 font-inter"
                            : "block mx-3 my-2 px-3 py-2 bg-rentease-yellow text-rentease-dark font-inter font-medium hover:bg-rentease-yellow/90 transition-colors duration-200"
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.text}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default NavBar;
