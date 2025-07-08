/* eslint-disable no-unused-vars */
import {
  Home,
  BookAIcon,
  User2Icon,
  School,
  GraduationCap,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("authToken");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return (
      location.pathname.endsWith(`/${path}`) || location.pathname === `/${path}`
    );
  };

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: i * 0.1 },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.4, type: "spring", stiffness: 100 },
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  const navItems = [
    {
      path: "home-parent",
      label: "Home",
      icon: (
        <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
      ),
    },
    {
      path: "hafalan",
      label: "Hafalan",
      icon: (
        <BookAIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
      ),
    },
    {
      path: "raport",
      label: "Raport",
      icon: (
        <GraduationCap className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
      ),
    },
    {
      path: "absensi",
      label: "Absensi",
      icon: (
        <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
      ),
    },
  ];

  return (
    <motion.nav
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-gradient-to-r from-blue-700 to-indigo-700 shadow-xl backdrop-blur-lg"
          : "bg-white shadow-lg"
      }`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <School
              className={`h-9 w-9 transition-colors duration-300 ${
                isScrolled ? "text-yellow-300" : "text-blue-600"
              }`}
            />
            <span
              className={`ml-3 text-xl sm:text-2xl font-extrabold tracking-tight transition-colors duration-300 ${
                isScrolled ? "text-white" : "text-blue-800"
              }`}
            >
              TPA Al-Hidayah
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) => (
              <motion.button
                key={item.path}
                custom={index}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center text-lg font-bold transition-all duration-300 group px-3 py-2 rounded-md ${
                  isActivePath(item.path)
                    ? isScrolled
                      ? "text-yellow-300 border-b-2 border-yellow-300 bg-yellow-50/20"
                      : "text-blue-800 border-b-2 border-blue-600 bg-blue-50/10"
                    : isScrolled
                    ? "text-white hover:text-yellow-300 hover:bg-yellow-50/10"
                    : "text-blue-700 hover:text-blue-500 hover:bg-blue-50/10"
                }`}
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={() => navigate("profile-parent")}
              className={`p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <User2Icon className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log Out
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.div
            className="md:hidden flex items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md transition-colors duration-300 ${
                isScrolled
                  ? "text-white hover:text-yellow-300"
                  : "text-blue-700 hover:text-blue-500"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-xl border-t border-blue-200"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.path}
                  custom={index}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => {
                    navigate(item.path);
                    toggleMobileMenu();
                  }}
                  className={`flex items-center w-full text-left text-lg font-bold transition-all duration-300 rounded-md py-3 px-4 ${
                    isActivePath(item.path)
                      ? "text-blue-800 border-l-4 border-blue-600 bg-blue-100/50"
                      : "text-blue-700 hover:text-blue-500 hover:bg-blue-50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              ))}
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => {
                    navigate("profile-parent");
                    toggleMobileMenu();
                  }}
                  className="p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User2Icon className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 rounded-full text-sm font-bold transition-all duration-300 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Log Out
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Header;
