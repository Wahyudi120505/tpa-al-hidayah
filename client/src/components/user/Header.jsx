import { Globe, MapPin, Star, Users, Calendar, ArrowRight, Menu, X, Search, Filter, Heart, Camera, Mountain, Waves, TreePine, Utensils } from 'lucide-react';

const Header = () => {


  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Mountain className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">
                  Tripify
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 px-3 py-2 text-sm font-medium"
                >
                  home
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  destination{" "}
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  tours
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  about
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  contact
                </a>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Toggle */}
              <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                <Globe className="h-4 w-4 mr-1" />
              </button>

              {/* Register Business Button */}
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                registerBusiness
              </button>

              {/* Login/Register */}
              <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                login
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                register
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
