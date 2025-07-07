import {
  Globe,
  Home,
  BookAIcon,
  User2Icon,
  School,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
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

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-800 ease-in-out ${
        isScrolled
          ? 'bg-gradient-to-r from-indigo-900 to-indigo-700 shadow-lg backdrop-blur-md'
          : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <School
              className={`h-8 w-8 transition-colors duration-300 ${
                isScrolled ? 'text-yellow-400' : 'text-indigo-600'
              }`}
            />
            <span
              className={`ml-3 text-2xl font-extrabold tracking-tight transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-indigo-800'
              }`}
            >
              TPA Al-Hidayah
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("")}
              className={`flex items-center text-sm font-medium transition-all duration-300 ${
                isScrolled
                  ? 'text-white hover:text-yellow-400'
                  : 'text-indigo-700 hover:text-indigo-500'
              } group`}
            >
              <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Home
            </button>
            <button
              onClick={() => navigate("hafalan")}
              className={`flex items-center text-sm font-medium transition-all duration-300 ${
                isScrolled
                  ? 'text-white hover:text-yellow-400'
                  : 'text-indigo-700 hover:text-indigo-500'
              } group`}
            >
              <BookAIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Hafalan
            </button>
            <button
              onClick={() => navigate("raport")}
              className={`flex items-center text-sm font-medium transition-all duration-300 ${
                isScrolled
                  ? 'text-white hover:text-yellow-400'
                  : 'text-indigo-700 hover:text-indigo-500'
              } group`}
            >
              <GraduationCap className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Raport
            </button>
          </div>

          {/* Right Controls (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className={`p-2 rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'text-white hover:text-yellow-400'
                  : 'text-indigo-700 hover:text-indigo-500'
              }`}
            >
              <Globe className="h-6 w-6" />
            </button>
            <button
              onClick={() => navigate("profile-parent")}
              className={`p-2 rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              } shadow-md`}
            >
              <User2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isScrolled
                  ? 'bg-red-600 text-white hover:bg-red-500'
                  : 'bg-red-500 text-white hover:bg-red-600'
              } shadow-md`}
            >
              Log Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md transition-colors duration-300 ${
                isScrolled ? 'text-white hover:text-yellow-400' : 'text-indigo-700 hover:text-indigo-500'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-indigo-100">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <button
              onClick={() => {
                navigate("");
                toggleMobileMenu();
              }}
              className="flex items-center w-full text-left text-indigo-700 hover:text-indigo-500 text-base font-medium transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </button>
            <button
              onClick={() => {
                navigate("hafalan");
                toggleMobileMenu();
              }}
              className="flex items-center w-full text-left text-indigo-700 hover:text-indigo-500 text-base font-medium transition-colors"
            >
              <BookAIcon className="h-5 w-5 mr-2" />
              Hafalan
            </button>
            <button
              onClick={() => {
                navigate("grade");
                toggleMobileMenu();
              }}
              className="flex items-center w-full text-left text-indigo-700 hover:text-indigo-500 text-base font-medium transition-colors"
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              Grade
            </button>
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-full text-indigo-700 hover:text-indigo-500 transition-colors"
              >
                <Globe className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-md">
                <User2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-full text-sm font-semibold transition-colors shadow-md"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;