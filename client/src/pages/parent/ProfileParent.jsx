import { useEffect, useState } from "react";
import { Mail, User, Shield, Users, User2, Phone } from "lucide-react";

const ProfileParent = () => {
  const [data, setData] = useState({});
  const [dataStudent, setDataStudent] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setData(user);
    if (user?.responseStudent) {
      setDataStudent(user.responseStudent);
    }
  }, []);

  const nameParent = dataStudent?.[0]?.responeParent?.name;
  const noTelp = dataStudent?.[0]?.responeParent?.noHp;
  console.log(noTelp);

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


          <div className="lex items-center gap-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-300">
            <User2 className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Name</p>
              <p className="text-lg font-semibold text-indigo-900">
                {nameParent || "N/A"}
              </p>
            </div>
          </div>

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
            <Phone className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Phone Number</p>
              <p className="text-lg font-semibold text-indigo-900">
                {noTelp || "N/A"}
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

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-800">Children</h2>
            {dataStudent.map((student) => (
              <div
                key={student.id}
                className="border border-indigo-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-indigo-900">{student.name || "N/A"}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Gender:</span>{" "}
                    {student.gender === "L" ? "Laki-laki" : student.gender === "P" ? "Perempuan" : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Birth Date:</span>{" "}
                    {student.birthDate || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Class Level:</span>{" "}
                    {student.classLevel || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Student ID:</span>{" "}
                    {student.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileParent;