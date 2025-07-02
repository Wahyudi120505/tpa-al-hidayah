import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { User, Award, Calendar, Users, BookOpen, GraduationCap, X } from "lucide-react";

const GradeStudent = () => {
  const [dataGrades, setDataGrades] = useState([]);
  const [parentId, setParentId] = useState("");
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  console.log(JSON.parse(localStorage.getItem("user")));
  console.log(dataGrades)
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const parent = user?.responseStudent?.[0].responeParent;

    if (parent?.id) {
      setParentId(parent.id);
    } else {
      setError("Data siswa tidak ditemukan.");
    }

    fetchDataGrades();
  }, []);

  useEffect(() => {
    if (dataGrades.length > 0 && parentId) {
      const filtered = dataGrades.filter(
        (grades) => grades?.responseStudent?.responeParent?.id === parseInt(parentId)
      );
      setFilteredGrades(filtered);
    }
  }, [dataGrades, parentId]);

  const fetchDataGrades = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/grades?page=1&size=1000&sortOrder=DESC`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setDataGrades(data.content || []);
      } else {
        setDataGrades([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Gagal mengambil data nilai. Silakan coba lagi.");
    }
  };

  const handleCardClick = (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGrade(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-10 text-center flex items-center justify-center gap-3">
          <GraduationCap className="w-8 h-8" />
          Student Grades Dashboard
        </h1>
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-indigo-100">
          <div className="p-8">
            {filteredGrades.length > 0 ? (
              <div className="space-y-6">
                {filteredGrades.map((grade) => (
                  <div
                    key={grade.id}
                    className="relative bg-white border border-gray-100 rounded-xl p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl group cursor-pointer"
                    onClick={() => handleCardClick(grade)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2 mb-4">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        {grade?.name}
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-3">
                          <p className="text-gray-700 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-500" />
                            <span className="font-medium">Student:</span>{" "}
                            {grade?.responseStudent?.name}
                          </p>
                          <p className="text-gray-700 flex items-center gap-2">
                            <Award className="w-5 h-5 text-indigo-500" />
                            <span className="font-medium">Score:</span>{" "}
                            <span className="text-indigo-600 font-bold text-lg">
                              {grade?.score}
                            </span>
                          </p>
                          <p className="text-gray-700 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            <span className="font-medium">Semester:</span>{" "}
                            {grade?.semester}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12 flex flex-col items-center gap-3">
                <BookOpen className="w-12 h-12 text-gray-400" />
                <p>Data nilai tidak ditemukan untuk siswa ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Grade Details
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Subject:</span>{" "}
                {selectedGrade?.responseSubject?.name}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Student:</span>{" "}
                {selectedGrade?.responseStudent?.name}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Class:</span>{" "}
                {selectedGrade?.responseStudent?.classLevel}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Gender:</span>{" "}
                {selectedGrade?.responseStudent?.gender === "L"
                  ? "Male"
                  : "Female"}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Birth Date:</span>{" "}
                {selectedGrade?.responseStudent?.birthDate
                  ? new Date(
                    selectedGrade.responseStudent.birthDate
                  ).toLocaleDateString()
                  : "-"}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Parent:</span>{" "}
                {selectedGrade?.responseStudent?.responeParent?.name}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Score:</span>{" "}
                <span className="text-indigo-600 font-bold text-lg">
                  {selectedGrade?.score}
                </span>
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Semester:</span>{" "}
                {selectedGrade?.semester}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeStudent;
