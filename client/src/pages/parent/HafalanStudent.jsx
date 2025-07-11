/* eslint-disable no-unused-vars */
import Cookies from "js-cookie";
import {
  ArrowLeftCircle,
  GraduationCap,
  Smile,
  User,
  User2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HafalanStudent = () => {
  const [dataStudents, setDataStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [parentId, setParentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  const fetchHafalanStudent = async (studentId) => {
    try {
      setLoading(true);
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/student-memorization-status/student/${studentId}`,
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
        memorization: jsonData,
      });
      setLoading(false);
      setCurrentPage(1);
    } catch (error) {
      setError("Gagal mengambil data hafalan.");
      setLoading(false);
    }
  };

  const handleStudentClick = (student) => {
    setTamp("");
    setSelectedStudent(student);
    fetchHafalanStudent(student.id);
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setTamp("h-[600px]");
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUDAH_HAFAL":
        return "bg-green-100 text-green-800";
      case "BELUM_HAFAL":
      case "TIDAK_HAFAL":
      case null:
      case "":
        return "bg-red-100 text-red-800";
      case "MENGULANG":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belum Di Perbarui";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    selectedStudent?.memorization?.slice(indexOfFirstItem, indexOfLastItem) ||
    [];
  const totalPages = Math.ceil(
    (selectedStudent?.memorization?.length || 0) / itemsPerPage
  );

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto space-y-6 ${tamp} overflow-y-auto`}>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Data Hafalan Santri
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
              className="bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between hover:shadow-2xl transition duration-300"
              onClick={() => handleStudentClick(student)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>
                <p className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <User2 className="text-blue-500" size={20} /> {student.name}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <GraduationCap className="text-green-500" size={16} /> Kelas:{" "}
                  {student.classLevel}
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
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-blue-100">
                      Kelas: {selectedStudent.classLevel || "-"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleClose()}
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  <ArrowLeftCircle size={28} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Status Hafalan
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
              ) : selectedStudent.memorization?.length > 0 ? (
                <>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Surah
                          </th>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Terakhir Diperbarui
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems
                          .sort(
                            (a, b) =>
                              new Date(b.updatedAt) - new Date(a.updatedAt)
                          )
                          .map((item) => (
                            <tr
                              key={item.suratId}
                              className="hover:bg-gray-50 text-center"
                            >
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {item.surah?.name || "-"} (Surah{" "}
                                {item.surah?.number || "-"})
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                    item.memorizationStatus
                                  )}`}
                                >
                                  {item.memorizationStatus === "SUDAH_HAFAL"
                                    ? "Sudah Hafal"
                                    : item.memorizationStatus === "MENGULANG"
                                    ? "Mengulang"
                                    : "Belum Hafal"}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-sm text-gray-500">
                                {formatDate(item.updatedAt)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination Controls */}
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
                  <Smile className="mx-auto h-12 w-62 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Tidak ada data hafalan
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Belum ada catatan hafalan untuk santri ini.
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

export default HafalanStudent;
