/* eslint-disable no-unused-vars */
import Cookies from "js-cookie";
import { Info, ArrowLeftCircle, DownloadCloud, User2, CalendarDays, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RaportStudent = () => {
  const [dataStudents, setDataStudents] = useState([]);
  const [studentId, setStudentId] = useState([]);
  const [parentId, setParentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const parent = user?.responseStudent?.[0]?.responeParent;
    if (parent?.id) {
      setParentId(parent.id);
    }
    fetchDataStudent();
  }, []);

  useEffect(() => {
    const filtered = dataStudents.filter((student) => student.responeParent?.id === parentId);
    setStudentId(filtered);
  }, [dataStudents, parentId]);

  const fetchDataStudent = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch('http://localhost:8080/api/students?page=1&size=1000&sortOrder=ASC', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const jsonData = await response.json();
      setDataStudents(jsonData.content);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const rapotStudent = async (params) => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(`http://localhost:8080/report/student/${params.id}/download`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `Raport-${params.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengunduh raport:", error);
    }
  };

  const handleDownloadReport = () => {
    if (selectedStudent) {
      rapotStudent(selectedStudent);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 h-[600px]">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Data Siswa & Raport</h1>

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
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between hover:shadow-2xl transition duration-300"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <User2 className="text-blue-500" size={20} /> {student.name}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <GraduationCap className="text-green-500" size={16} /> Kelas: {student.classLevel}
                  </p>
                </div>
                <button onClick={() => setSelectedStudent(student)} className="text-blue-500 hover:text-blue-700">
                  <Info size={24} />
                </button>
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
              <User2 size={24} /> Detail Siswa
            </h2>

            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2"><User2 size={18} className="text-purple-500" /> <strong>Nama:</strong> {selectedStudent.name}</p>
              <p className="flex items-center gap-2"><GraduationCap size={18} className="text-green-500" /> <strong>Kelas:</strong> {selectedStudent.classLevel}</p>
              <p className="flex items-center gap-2"><CalendarDays size={18} className="text-orange-500" /> <strong>Tanggal Lahir:</strong> {selectedStudent.birthDate}</p>
              <p className="flex items-center gap-2"><User2 size={18} className="text-pink-500" /> <strong>Jenis Kelamin:</strong> {selectedStudent.gender}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow"
              >
                <DownloadCloud size={20} /> Download Raport
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