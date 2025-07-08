/* eslint-disable no-unused-vars */
import Cookies from "js-cookie";
import {
  Info,
  ArrowLeftCircle,
  DownloadCloud,
  User2,
  CalendarDays,
  GraduationCap,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RaportStudent = () => {
  const [dataStudents, setDataStudents] = useState([]);
  const [studentId, setStudentId] = useState([]);
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false); // New state for download animation

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const parent = user?.responseStudent?.[0]?.responeParent;
    if (parent?.id) {
      setParentId(parent.id);
    } else {
      setError("Gagal mengambil Data Orang Tua");
    }
    fetchDataStudent();
  }, []);

  useEffect(() => {
    const filtered = dataStudents.filter(
      (student) => student.responeParent?.id === parentId
    );
    setStudentId(filtered);
  }, [dataStudents, parentId]);

  const fetchDataStudent = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        "http://localhost:8080/api/students?page=1&size=1000&sortOrder=ASC",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const jsonData = await response.json();
      setDataStudents(jsonData.content);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const rapotStudent = async (params) => {
    try {
      setIsDownloading(true); // Start animation
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/report/student/${params.id}/download`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Raport-${params.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengunduh raport:", error);
      setError("Gagal mengunduh raport. Silakan coba lagi.");
    } finally {
      setIsDownloading(false); // Stop animation
    }
  };

  const handleDownloadReport = () => {
    if (selectedStudent) {
      rapotStudent(selectedStudent);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 h-[600px]">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Data Raport Santri
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {!selectedStudent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {studentId.map((student) => (
              <motion.div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between hover:shadow-2xl transition duration-300"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <User2 className="text-blue-500" size={20} /> {student.name}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <GraduationCap className="text-green-500" size={16} />
                    Kelas: {student.classLevel}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
              <User2 size={24} /> Detail Santri
            </h2>

            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <User2 size={18} className="text-purple-500" />{" "}
                <strong>Nama:</strong> {selectedStudent.name}
              </p>
              <p className="flex items-center gap-2">
                <GraduationCap size={18} className="text-green-500" />{" "}
                <strong>Kelas:</strong> {selectedStudent.classLevel}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays size={18} className="text-orange-500" />{" "}
                <strong>Tanggal Lahir:</strong> {selectedStudent.birthDate}
              </p>
              <p className="flex items-center gap-2">
                <User2 size={18} className="text-pink-500" />{" "}
                <strong>Jenis Kelamin:</strong> {selectedStudent.gender}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow transition duration-200 ${
                  isDownloading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isDownloading ? (
                    <motion.div
                      key="loading"
                      initial={{ rotate: 0, opacity: 0 }}
                      animate={{ rotate: 360, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ rotate: { repeat: Infinity, duration: 1 } }}
                    >
                      <DownloadCloud size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="download"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <DownloadCloud size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
                {isDownloading ? "Mengunduh..." : "Download Raport"}
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="flex items-center gap-2 bg-gray-300 text-black px-4 py-2 rounded-xl hover:bg-gray-400 shadow"
              >
                <ArrowLeftCircle size={20} /> Kembali
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RaportStudent;