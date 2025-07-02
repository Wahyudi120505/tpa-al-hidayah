import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  Calendar,
  BookOpen,
  DollarSign,
  FileText,
  Menu,
  X,
  LogOut,
  ScrollText,
} from "lucide-react";

const Sidebar = ({ menuActive }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(menuActive);
  const navigate = useNavigate();
  const basePath = "/admin";

  const menuItems = [
    {
      id: "santri",
      name: "Santri",
      icon: Users,
      path: `${basePath}`,
    },
    {
      id: "parent",
      name: "Orang Tua",
      icon: UserCheck,
      path: `${basePath}/parent`,
    },
    {
      id: "absensi",
      name: "Absensi",
      icon: Calendar,
      path: `${basePath}/absensi`,
    },
    {
      id: "hafalan",
      name: "Setoran Hafalan",
      icon: BookOpen,
      path: `${basePath}/memorize`,
    },
    {
      id: "spp",
      name: "SPP",
      icon: DollarSign,
      path: `${basePath}/payment`,
    },
    {
      id: "grades",
      name: "Nilai Ujian",
      icon: FileText,
      path: `${basePath}/grade`,
    },
    {
      id: "subject",
      name: "Subject",
      icon: ScrollText,
      path: `${basePath}/subject`,
    },
  ];


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menuId, path) => {
    setActiveMenu(menuId);
    navigate(path);
  };

  const handleLogOut = () => {
    Cookies.remove("authToken");
    console.log("User logged out");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-gradient-to-b from-emerald-800 to-emerald-900 
        text-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${isOpen ? "w-64" : "w-0"} lg:translate-x-0 lg:w-64
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-emerald-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-emerald-200 text-sm">Pesantren System</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 flex-1">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id, item.path)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg 
                      transition-all duration-200 text-left group
                      ${activeMenu === item.id
                        ? "bg-white text-emerald-800 shadow-lg transform scale-105"
                        : "text-emerald-100 hover:bg-emerald-700 hover:text-white hover:transform hover:scale-105"
                      }
                    `}
                  >
                    <IconComponent
                      className={`
                      w-5 h-5 transition-colors
                      ${activeMenu === item.id
                          ? "text-emerald-700"
                          : "text-emerald-300 group-hover:text-white"
                        }
                    `}
                    />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-emerald-700 space-y-3">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-3 bg-emerald-700 rounded-lg">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Admin</p>
              <p className="text-emerald-200 text-xs">Administrator</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg 
                     text-emerald-100 hover:bg-red-600 hover:text-white 
                     transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-emerald-300 group-hover:text-white transition-colors" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-60 p-3 bg-emerald-800 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Content Spacer for Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;
