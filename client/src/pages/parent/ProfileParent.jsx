import { useEffect, useState } from "react";
import { Mail, User, Shield, Users } from "lucide-react";

const ProfileParent = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setData(user);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-center">
          <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
            <User className="w-8 h-8 text-yellow-400" />
            Parent Profile
          </h1>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-300">
            <Mail className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-lg font-semibold text-indigo-900">
                {data.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-300">
            <User className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">User ID</p>
              <p className="text-lg font-semibold text-indigo-900">
                {data.idAppUser || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-300">
            <Users className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Parent ID</p>
              <p className="text-lg font-semibold text-indigo-900">
                {data.parentId || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-300">
            <Shield className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Role</p>
              <p className="text-lg font-semibold text-indigo-900">
                {data.role || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileParent;