import {  
  Globe,
  Home,
  BookAIcon,
  User2Icon,
  School
} from 'lucide-react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    Cookies.remove("authToken");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50  transition-colors duration-900 ${
        isScrolled ? 'bg-black shadow-md' : 'bg-gray-300 shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <School className={`h-8 w-8 ${isScrolled ? 'text-white' : 'text-blue-600'}`} />
            <span
              className={`ml-3 text-2xl font-bold tracking-tight ${
                isScrolled ? 'text-white' : 'text-gray-800'
              }`}
            >
              TPA Al-Hidayah
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/parent")}
              className={`flex items-center transition-colors text-sm font-medium ${
                isScrolled ? 'text-white hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </button>
            <button
              onClick={() => navigate("/hafalan")}
              className={`flex items-center transition-colors text-sm font-medium ${
                isScrolled ? 'text-white hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <BookAIcon className="h-4 w-4 mr-1" />
              Hafalan
            </button>
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className={`flex items-center transition-colors ${
                isScrolled ? 'text-white hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Globe className="h-5 w-5" />
            </button>

            <button className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors">
              <User2Icon className="h-5 w-5" />
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
