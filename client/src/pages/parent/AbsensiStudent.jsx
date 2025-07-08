/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftCircle,
  GraduationCap,
  User,
  User2,
  XCircle,
  Smile,
} from "lucide-react";

const AbsensiStudent = () => {
  const [parentId, setParentId] = useState("");
  const [dataStudents, setDataStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [tamp, setTamp] = useState("h-[600px]");

  const SkeletonLoader = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
  );

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const parent = user?.responseStudent?.[0]?.responeParent;

      if (parent?.id) {
        setParentId(parent.id);
      } else {
        setError("Data orang tua tidak ditemukan.");
      }
      fetchDataStudent();
    } catch (error) {
      setError("Gagal memuat data pengguna.");
    }
  }, []);

  useEffect(() => {
    const filtered = dataStudents.filter(
      (student) => student.responeParent?.id === parentId
    );
    setFilteredStudents(filtered);
  }, [dataStudents, parentId]);

  const fetchDataStudent = async () => {
    try {
      setLoading(true);
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      setDataStudents(jsonData.content);
      setLoading(false);
    } catch (error) {
      setError("Gagal mengambil data siswa.");
      setLoading(false);
    }
  };

  const fetchAbsensiStudent = async (studentId) => {
    try {
      setLoading(true);
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/attendance-summary/student/${studentId}/last-months?monthsBack=12`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      setSelectedStudent({
        ...dataStudents.find((s) => s.id === studentId),
        attendance: jsonData,
      });
      setLoading(false);
      setCurrentPage(1);
    } catch (error) {
      setError("Gagal mengambil data absensi.");
      setLoading(false);
    }
  };

  const handleStudentClick = (student) => {
    setTamp("");
    setSelectedStudent(student);
    fetchAbsensiStudent(student.id);
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setTamp("h-[600px]");
    setCurrentPage(1);
  };

  const getStatusColor = (count) => {
    return count > 0
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    selectedStudent?.attendance?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil(
    (selectedStudent?.attendance?.length || 0) / itemsPerPage
  );

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto space-y-6 ${tamp} overflow-y-auto`}>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Data Absensi Santri
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

      {!selectedStudent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {filteredStudents.map((student) => (
            <motion.div
              key={student.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between hover:shadow-2xl transition duration-300"
              onClick={() => handleStudentClick(student)}
            >
              <div>
                <p className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <User2 className="text-blue-500" size={20} />
                  {student.name}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <GraduationCap className="text-green-500" size={16} />
                  Kelas: {student.classLevel}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="text-blue-100" size={28} />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-blue-100">
                      Kelas: {selectedStudent.classLevel || "-"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  <ArrowLeftCircle size={28} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Ringkasan Absensi
              </h3>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <SkeletonLoader
                      key={i}
                      className="h-20 w-full rounded-lg"
                    />
                  ))}
                </div>
              ) : selectedStudent.attendance?.length > 0 ? (
                <>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Bulan
                          </th>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Total Hari
                          </th>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Hadir
                          </th>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Izin
                          </th>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Alpa
                          </th>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Sakit
                          </th>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Persentase Kehadiran
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 text-center"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {item.month} {item.year}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {item.totalDays}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  item.hadirCount
                                )}`}
                              >
                                {item.hadirCount}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  item.izinCount
                                )}`}
                              >
                                {item.izinCount}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  item.alfaCount
                                )}`}
                              >
                                {item.alfaCount}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  item.sakitCount
                                )}`}
                              >
                                {item.sakitCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {item.attendancePercentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-4 flex justify-center space-x-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 bg-blue-500 text-white rounded ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-600"
                        }`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`px-4 py-2 rounded ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 bg-blue-500 text-white rounded ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-600"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Smile className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Tidak ada data absensi
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Belum ada catatan absensi untuk santri ini.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AbsensiStudent;
