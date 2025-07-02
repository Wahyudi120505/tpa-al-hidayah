/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Select from "react-select";
import Sidebar from "../../components/admin/Sidebar";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  User,
  Hash,
  Users,
  Info,
  BadgeInfo,
  Calendar,
  Baby,
  BookOpen,
} from "lucide-react";

const AbsensiController = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [newAbsensiModal, setNewAbsensiModal] = useState(false);
  const [tampIdStudent, setTampIdStudent] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAbsensiId, setSelectedAbsensiId] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const [detailInfoModal, setDetailInfoModal] = useState({});
  const [form, setForm] = useState({
    id: "",
    date: new Date().toISOString().split("T")[0],
    status: "",
    student_id: 0,
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // State for bulk attendance
  const [attendanceData, setAttendanceData] = useState([]);
  const [bulkDate, setBulkDate] = useState(today);
  const [classLevelFilter, setClassLevelFilter] = useState("");

  useEffect(() => {
    fetchData();
    fetchStudentData();
  }, [currentPage, pageSize, sortOrder, searchQuery, dateFilter, statusFilter]);

  const fetchData = async () => {
    const token = Cookies.get("authToken");
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        sortOrder: sortOrder,
      });

      if (searchQuery.trim()) {
        params.append("query", searchQuery.trim());
      }

      if (dateFilter) {
        params.append("startDate", dateFilter);
        params.append("endDate", dateFilter);
      }

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      const response = await fetch(
        `http://localhost:8080/api/attendances?${params}`,
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
      setData(jsonData.content || []);
      setTotalPages(jsonData.totalPages || 0);
      setTotalElements(jsonData.totalElements || 0);
    } catch (error) {
      console.log("Gagal ambil data:", error);
      setError("Gagal mengambil data absensi");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async () => {
    try {
      const token = Cookies.get("authToken");

      const resMeta = await fetch(
        "http://localhost:8080/api/students?page=1&size=1&sortOrder=ASC",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const meta = await resMeta.json();
      const total = meta.totalElements || 1000;

      const response = await fetch(
        `http://localhost:8080/api/students?page=1&size=${total}&sortOrder=ASC`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setTampIdStudent(data.content || []);
      setAttendanceData(
        (data.content || []).map((student) => ({
          studentId: student.id,
          status: "",
        }))
      );
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Gagal mengambil data santri");
    }
  };

  const handleBulkAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("authToken");
      const validAttendances = attendanceData
        .filter((item) => item.status)
        .map((item) => ({
          date: bulkDate,
          status: item.status,
          studentId: item.studentId,
        }));

      if (validAttendances.length === 0) {
        alert("Pilih setidaknya satu status kehadiran untuk santri!");
        return;
      }

      const responses = await Promise.all(
        validAttendances.map((attendance) =>
          fetch("http://localhost:8080/api/attendances", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(attendance),
          })
        )
      );

      const allSuccessful = responses.every((res) => res.ok);
      if (allSuccessful) {
        alert("Data absensi berhasil ditambahkan!");
        setAttendanceData(
          tampIdStudent.map((student) => ({
            studentId: student.id,
            status: "",
          }))
        );
        setBulkDate(today);
        setClassLevelFilter("");
        setNewAbsensiModal(false);
        fetchData();
      } else {
        alert("Gagal menambahkan beberapa data absensi");
      }
    } catch (err) {
      console.error("Error saat mengirim data:", err);
      alert("Terjadi kesalahan server");
    }
  };

  const handleShowEditModal = (absensi) => {
    setSelectedAbsensiId(absensi.id);
    setForm({
      id: absensi.id || "",
      date: absensi.date
        ? new Date(absensi.date).toISOString().split("T")[0]
        : "",
      status: absensi.status || "",
      student_id: absensi.responseStudent.id,
    });
    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/attendances/${selectedAbsensiId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: form.date,
            status: form.status,
            studentId: form.student_id,
          }),
        }
      );

      if (response.ok) {
        alert("Data absensi berhasil diperbarui!");
        setForm({
          id: "",
          date: today,
          status: "",
          student_id: 0,
        });
        setShowEditModal(false);
        setSelectedAbsensiId(null);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(
          `Gagal memperbarui data: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating absensi:", error);
      alert("Gagal memperbarui data absensi");
    }
  };

  const handleClick = async (id) => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/attendances/${id}`,
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
      setDetailInfoModal(jsonData);
      setInfoModal(true);
    } catch (error) {
      console.error("Gagal mengambil detail data:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const handleReset = () => {
    setSearchQuery("");
    setDateFilter("");
    setStatusFilter("");
    setCurrentPage(1);
    setSortOrder("DESC");
    setPageSize(10);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const studentOptions = tampIdStudent.map((student) => ({
    value: student.id,
    label: `${student.name} (ID: ${student.id})`,
  }));

  const classLevels = [
    ...new Set(
      tampIdStudent.map((student) => student.classLevel).filter(Boolean)
    ),
  ].sort();

  const filteredStudents = classLevelFilter
    ? tampIdStudent.filter((student) => student.classLevel === classLevelFilter)
    : tampIdStudent;

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "HADIR":
        return "bg-green-100 text-green-800";
      case "ALFA":
        return "bg-red-100 text-red-800";
      case "SAKIT":
        return "bg-blue-100 text-blue-800";
      case "IZIN":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <>
      <Sidebar menuActive={"absensi"} />
      <div className="lg:ml-64 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Data Absensi Harian
              </h1>
              <p className="text-gray-600">
                Kelola data kehadiran santri harian
              </p>
            </div>
            <button
              onClick={() => setNewAbsensiModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Absensi</span>
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col lg:flex-row gap-4 items-end"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cari Santri
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama santri..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Per Halaman
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urutan
                </label>
                <button
                  type="button"
                  onClick={toggleSortOrder}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {sortOrder === "DESC" ? (
                    <SortDesc className="w-4 h-4" />
                  ) : (
                    <SortAsc className="w-4 h-4" />
                  )}
                  <span>{sortOrder === "DESC" ? "Terbaru" : "Terlama"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                  showFilters
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cari
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </form>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => {
                        setDateFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Kehadiran
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Semua Status</option>
                      <option value="HADIR">Hadir</option>
                      <option value="ALFA">Tidak Hadir</option>
                      <option value="SAKIT">Sakit</option>
                      <option value="IZIN">Izin</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="ml-3 text-gray-600">Memuat data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">
                <Info className="mx-auto h-12 w-12 text-gray-700" />
              </div>
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="mx-auto h-12 w-12 text-gray-700" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery || dateFilter || statusFilter
                  ? "Tidak ada data yang sesuai filter"
                  : "Belum ada data absensi"}
              </p>
              <p className="text-gray-400 mt-1">
                {searchQuery || dateFilter || statusFilter
                  ? "Coba ubah kriteria pencarian"
                  : "Data absensi akan ditampilkan di sini"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Santri
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="text-emerald-600 font-medium text-sm">
                                {item.responseStudent?.name
                                  ? item.responseStudent.name
                                      .charAt(0)
                                      .toUpperCase()
                                  : "S"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.responseStudent?.name ||
                                "Nama tidak tersedia"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Kelas: {item.responseStudent?.classLevel || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {item.date ? formatDate(item.date) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                            item.status
                          )}`}
                        >
                          {item.status === "HADIR" && "Hadir"}
                          {item.status === "ALFA" && "Alfa"}
                          {item.status === "SAKIT" && "Sakit"}
                          {item.status === "IZIN" && "Izin"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleShowEditModal(item)}
                            className="text-emerald-600 hover:text-emerald-900 p-1 rounded-md hover:bg-emerald-50"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleClick(item.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="Detail"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan{" "}
              <span className="font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              sampai{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, totalElements)}
              </span>{" "}
              dari <span className="font-medium">{totalElements}</span> data
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? "bg-emerald-600 text-white"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
        {/* Summary Stats */}
        {data.length > 0 && (
          <div className="mt-6 bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">
                Total Absensi: {totalElements}
              </span>
              <span className="text-emerald-600 text-sm">
                Halaman {currentPage} dari {totalPages}
                {(searchQuery || dateFilter || statusFilter) && (
                  <span className="ml-2 text-emerald-700 font-medium">
                    (Terfilter: {data.length} hasil)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
        {/* Tambah Absensi Modal */}
        {newAbsensiModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl sm:max-w-5xl transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => setNewAbsensiModal(false)}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2
                id="modal-title"
                className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2"
              >
                Tambah Absensi
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="bulkDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tanggal
                    </label>
                    <input
                      type="date"
                      id="bulkDate"
                      value={bulkDate}
                      onChange={(e) => setBulkDate(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="classLevelFilter"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Filter Kelas
                    </label>
                    <select
                      id="classLevelFilter"
                      value={classLevelFilter}
                      onChange={(e) => setClassLevelFilter(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="">Semua Kelas</option>
                      {classLevels.map((level) => (
                        <option key={level} value={level}>
                          Kelas {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Santri
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hadir
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Izin
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alfa
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sakit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <span className="text-emerald-600 font-medium text-sm">
                                    {student.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Kelas: {student.classLevel || "-"}
                                </div>
                              </div>
                            </div>
                          </td>
                          {["HADIR", "IZIN", "ALFA", "SAKIT"].map((status) => (
                            <td
                              key={status}
                              className="px-6 py-4 whitespace-nowrap text-center"
                            >
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                checked={
                                  attendanceData.find(
                                    (item) => item.studentId === student.id
                                  )?.status === status
                                }
                                onChange={() =>
                                  handleBulkAttendanceChange(student.id, status)
                                }
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => setNewAbsensiModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Memuat..." : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Edit Absensi Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in border border-gray-100">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAbsensiId(null);
                  setForm({
                    id: "",
                    date: today,
                    status: "",
                    student_id: 0,
                  });
                }}
                aria-label="Tutup Modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-2">
                Edit Absensi
              </h2>

              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Pilih status</option>
                    <option value="HADIR">HADIR</option>
                    <option value="IZIN">IZIN</option>
                    <option value="ALFA">ALFA</option>
                    <option value="SAKIT">SAKIT</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Santri
                  </label>
                  <Select
                    inputId="studentId"
                    name="studentId"
                    options={studentOptions}
                    onChange={(selectedOption) =>
                      setForm((prev) => ({
                        ...prev,
                        student_id: selectedOption?.value || "",
                      }))
                    }
                    value={
                      studentOptions.find(
                        (opt) => opt.value === form.student_id
                      ) || null
                    }
                    placeholder="Pilih Santri..."
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition"
                  disabled={loading}
                >
                  {loading ? "Memuat..." : "Simpan Perubahan"}
                </button>
              </form>
            </div>
          </div>
        )}
        {/* Info Modal */}
        {infoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all duration-300 ease-in-out">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 border border-gray-100 animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                onClick={() => setInfoModal(false)}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-bold text-emerald-700 mb-6 border-b pb-3 flex items-center gap-2">
                <Users className="w-6 h-6" /> Detail Santri
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Hash className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      ID
                    </label>
                    <p className="font-semibold">{detailInfoModal.id || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Nama
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseStudent?.name || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BadgeInfo className="mt-1 text-emerald-500" />
                  <div className="flex flex-col">
                    <label className="text-xs uppercase text-gray-400 mb-1">
                      Gender
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="px-2 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r from-emerald-500 to-green-500">
                        {detailInfoModal.responseStudent?.gender === "L"
                          ? "Laki-laki"
                          : "Perempuan"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Tgl Lahir
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseStudent?.birthDate
                        ? new Date(
                            detailInfoModal.responseStudent.birthDate
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Baby className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Kelas
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseStudent?.classLevel || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Tanggal
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.date
                        ? new Date(detailInfoModal.date).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Status
                    </label>
                    <div className="flex flex-col">
                      <p className="inline-block mt-1 px-2 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r from-emerald-500 to-green-500">
                        {detailInfoModal.status || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Orang Tua
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseStudent?.responeParent?.name ||
                        "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                  onClick={() => setInfoModal(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AbsensiController;
