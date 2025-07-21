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
  Edit,
  Trash2,
  Users,
  Info,
  Plus,
  X,
  Hash,
  User,
  BadgeInfo,
  Calendar,
  Baby,
  BookOpen,
} from "lucide-react";

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const StudentMemorizationController = () => {
  const [dataHafalan, setDataHafalan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [showFilters, setShowFilters] = useState(false);
  const [startUpdatedAt, setStartUpdatedAt] = useState("");
  const [endUpdatedAt, setEndUpdatedAt] = useState("");
  const [status, setStatus] = useState("");
  const [newMemorizationModal, setNewMemorizationModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [detailInfoModal, setDetailInfoModal] = useState({});
  const [students, setStudents] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMemorizationId, setSelectedMemorizationId] = useState(null);
  const [classLevelFilter, setClassLevelFilter] = useState("");
  const [form, setForm] = useState({
    status: "",
    updatedAt: new Date().toISOString().split("T")[0],
    studentId: "",
    surahIds: [], // Changed to array for multiple surahs
  });
  const [formError, setFormError] = useState(null);

  // Debounce filter inputs
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500);
  const debouncedStartUpdatedAt = useDebounce(startUpdatedAt, 500);
  const debouncedEndUpdatedAt = useDebounce(endUpdatedAt, 500);
  const debouncedStatus = useDebounce(status, 500);

  // Filter student options based on classLevelFilter
  const studentOptions = students
    .filter(
      (student) => !classLevelFilter || student.classLevel === classLevelFilter
    )
    .map((student) => ({
      value: student.id,
      label: `${student.name} (Kelas ${student.classLevel || "-"})`,
    }));

  const classLevels = [
    ...new Set(students.map((student) => student.classLevel).filter(Boolean)),
  ].sort();

  const surahOptions = surahs.map((surah) => ({
    value: surah.id,
    label: `${surah.name} (Surah ${surah.number})`,
  }));

  useEffect(() => {
    fetchData();
    fetchStudentData();
    fetchSurahData();
  }, [
    currentPage,
    pageSize,
    sortOrder,
    debouncedSearchQuery,
    debouncedStartUpdatedAt,
    debouncedEndUpdatedAt,
    debouncedStatus,
  ]);

  const fetchData = async () => {
    const token = Cookies.get("authToken");
    setLoading(true);
    setFilterLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error(
          "Token autentikasi tidak ditemukan. Silakan login kembali."
        );
      }

      // Validate date range
      if (debouncedStartUpdatedAt && debouncedEndUpdatedAt) {
        const start = new Date(debouncedStartUpdatedAt);
        const end = new Date(debouncedEndUpdatedAt);
        if (start > end) {
          throw new Error("Tanggal mulai tidak boleh setelah tanggal akhir.");
        }
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        sortOrder: sortOrder,
        sortBy: "id",
      });

      if (debouncedSearchQuery) {
        params.append("query", debouncedSearchQuery);
      }
      if (debouncedStartUpdatedAt) {
        params.append("startUpdatedAt", debouncedStartUpdatedAt);
      }
      if (debouncedEndUpdatedAt) {
        params.append("endUpdatedAt", debouncedEndUpdatedAt);
      }
      if (debouncedStatus) {
        params.append("status", debouncedStatus);
      }

      const response = await fetch(
        `http://localhost:8080/api/student-memorization-status?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Gagal mengambil data hafalan: status ${response.status}, ${
            errorText || "Tidak ada detail kesalahan dari server"
          }`
        );
      }

      const jsonData = await response.json();
      setDataHafalan(jsonData.content || []);
      setTotalPages(jsonData.totalPages || 0);
      setTotalElements(jsonData.totalElements || 0);
    } catch (error) {
      console.error("Gagal mengambil data hafalan:", error);
      setError(
        error.message.includes("startUpdatedAt") ||
          error.message.includes("endUpdatedAt")
          ? "Filter tanggal tidak valid. Periksa rentang tanggal."
          : error.message.includes("status")
          ? "Filter status tidak valid. Pilih status yang sesuai."
          : `Gagal mengambil data hafalan: ${error.message}`
      );
      setDataHafalan([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const fetchStudentData = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan.");
      }
      const response = await fetch(
        `http://localhost:8080/api/students?page=1&size=1000&sortOrder=ASC`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Gagal mengambil data santri: HTTP ${response.status}`);
      }

      const data = await response.json();
      setStudents(data.content || []);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Gagal mengambil data santri untuk dropdown.");
    }
  };

  const fetchSurahData = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan.");
      }
      const response = await fetch(
        `http://localhost:8080/api/surah?page=1&size=1000&sortOrder=ASC`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Gagal mengambil data surah: HTTP ${response.status}`);
      }

      const data = await response.json();
      setSurahs(data.content || []);
    } catch (error) {
      console.error("Error fetching surah data:", error);
      setError("Gagal mengambil data surah untuk dropdown.");
    }
  };

  const handleShowEditModal = (e) => {
    setSelectedMemorizationId(e.id);
    setForm({
      status: e.status || "",
      studentId: e.responseStudent.id,
      updatedAt: e.updatedAt
        ? new Date(e.updatedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      surahIds: [e.responseSurah.id], // Single surah for edit
    });
    setClassLevelFilter(e.responseStudent?.classLevel || "");
    setFormError(null);
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null);
  };

  const handleStatusChange = (selectedStatus) => {
    setForm((prev) => ({
      ...prev,
      status: prev.status === selectedStatus ? "" : selectedStatus,
    }));
    setFormError(null);
  };

  const handleSurahChange = (surahId) => {
    setForm((prev) => {
      const isSelected = prev.surahIds.includes(surahId);
      const newSurahIds = isSelected
        ? prev.surahIds.filter((id) => id !== surahId)
        : [...prev.surahIds, surahId];
      return { ...prev, surahIds: newSurahIds };
    });
    setFormError(null);
  };

  const handleClassLevelFilterChange = (e) => {
    const selectedClass = e.target.value;
    setClassLevelFilter(selectedClass);

    if (form.studentId) {
      const selectedStudent = students.find(
        (student) => student.id === Number(form.studentId)
      );
      if (
        selectedStudent &&
        selectedStudent.classLevel !== selectedClass &&
        selectedClass !== ""
      ) {
        setForm((prev) => ({ ...prev, studentId: "" }));
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!form.status || !form.studentId || !form.surahIds.length) {
      setFormError("Semua field wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan.");
      }

      const response = await fetch(
        `http://localhost:8080/api/student-memorization-status/${selectedMemorizationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: form.status,
            studentId: Number(form.studentId),
            surahId: Number(form.surahIds[0]), // Single surah for edit
            updatedAt: form.updatedAt,
          }),
        }
      );

      if (response.ok) {
        alert("Data hafalan berhasil diperbarui!");
        setForm({
          status: "",
          updatedAt: new Date().toISOString().split("T")[0],
          studentId: "",
          surahIds: [],
        });
        setClassLevelFilter("");
        setShowEditModal(false);
        setSelectedMemorizationId(null);
        fetchData();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setFormError(
          errorData.message || `Gagal memperbarui data: HTTP ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error updating memorization:", error);
      setFormError("Gagal memperbarui data hafalan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.status || !form.studentId || !form.surahIds.length) {
      setFormError("Semua field wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan.");
      }

      const requests = form.surahIds.map((surahId) =>
        fetch("http://localhost:8080/api/student-memorization-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: form.status,
            updatedAt: form.updatedAt,
            studentId: Number(form.studentId),
            surahId: Number(surahId),
          }),
        })
      );

      const responses = await Promise.all(requests);
      const errors = responses.filter((res) => !res.ok);

      if (errors.length > 0) {
        const errorData = await Promise.all(
          errors.map((res) => res.json().catch(() => ({})))
        );
        setFormError(
          errorData
            .map(
              (err) =>
                err.message || `Gagal menambah setoran: HTTP ${err.status}`
            )
            .join("; ")
        );
        return;
      }

      alert("Berhasil menambah setoran hafalan");
      setForm({
        status: "",
        updatedAt: new Date().toISOString().split("T")[0],
        studentId: "",
        surahIds: [],
      });
      setClassLevelFilter("");
      setNewMemorizationModal(false);
      fetchData();
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      setFormError("Terjadi kesalahan server: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setStartUpdatedAt("");
    setEndUpdatedAt("");
    setStatus("");
    setClassLevelFilter("");
    setCurrentPage(1);
    setSortOrder("ASC");
    setPageSize(10);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    setCurrentPage(1);
  };

  const handleShowInfo = (item) => {
    setDetailInfoModal(item);
    setInfoModal(true);
  };

  return (
    <>
      <Sidebar menuActive="hafalan" />
      <div className="lg:ml-64 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Status Hafalan Santri
              </h1>
              <p className="text-gray-600">
                Kelola data hafalan santri pesantren
              </p>
            </div>
            <button
              onClick={() => {
                setNewMemorizationModal(true);
                setForm({
                  status: "",
                  updatedAt: new Date().toISOString().split("T")[0],
                  studentId: "",
                  surahIds: [],
                });
                setClassLevelFilter("");
                setFormError(null);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              disabled={loading || filterLoading}
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Setoran Hafalan Santri</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col lg:flex-row gap-4 items-end"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cari Hafalan
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama santri atau surah..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    disabled={loading || filterLoading}
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
                  disabled={loading || filterLoading}
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
                  disabled={loading || filterLoading}
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
                disabled={loading || filterLoading}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                  disabled={loading || filterLoading}
                >
                  {filterLoading ? "Mencari..." : "Cari"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={loading || filterLoading}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </form>

            {showFilters && (
              <div className="flex flex-col lg:flex-row gap-4 w-full mt-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={startUpdatedAt}
                    onChange={(e) => setStartUpdatedAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    disabled={loading || filterLoading}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Akhir
                  </label>
                  <input
                    type="date"
                    value={endUpdatedAt}
                    onChange={(e) => setEndUpdatedAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    disabled={loading || filterLoading}
                  />
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
                disabled={loading || filterLoading}
              >
                Coba Lagi
              </button>
            </div>
          ) : dataHafalan.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="mx-auto h-12 w-12 text-gray-700" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {debouncedSearchQuery ||
                debouncedStartUpdatedAt ||
                debouncedEndUpdatedAt ||
                debouncedStatus
                  ? "Tidak ada data hafalan yang sesuai dengan filter"
                  : "Belum ada data hafalan"}
              </p>
              <p className="text-gray-400 mt-1">
                {debouncedSearchQuery ||
                debouncedStartUpdatedAt ||
                debouncedEndUpdatedAt ||
                debouncedStatus
                  ? "Coba ubah kriteria pencarian atau filter"
                  : "Tambahkan data hafalan baru untuk memulai"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Santri
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Surah
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Update
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orang Tua
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataHafalan.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {(currentPage - 1) * pageSize + index + 1}
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
                        {item.responseSurah?.name
                          ? `${item.responseSurah.name} (Surah ${item.responseSurah.number})`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === "SUDAH_HAFAL"
                              ? "bg-green-100 text-green-800"
                              : item.status === "BELUM_HAFAL"
                              ? "bg-red-100 text-red-800"
                              : item.status === "MENGULANG"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status === "SUDAH_HAFAL"
                            ? "Sudah Hafal"
                            : item.status === "BELUM_HAFAL"
                            ? "Belum Hafal"
                            : item.status === "MENGULANG"
                            ? "Mengulang"
                            : item.status || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {item.responseStudent?.responeParent?.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleShowEditModal(item)}
                            className="text-emerald-600 hover:text-emerald-900 p-1 rounded-md hover:bg-emerald-50"
                            title="Edit"
                            disabled={loading || filterLoading}
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleShowInfo(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="Info"
                            disabled={loading || filterLoading}
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
                disabled={currentPage === 1 || loading || filterLoading}
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
                    } ${
                      loading || filterLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={loading || filterLoading}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === totalPages || loading || filterLoading
                }
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}

        {dataHafalan.length > 0 && (
          <div className="mt-6 bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">
                Total Data Hafalan: {totalElements}
              </span>
              <span className="text-emerald-600 text-sm">
                Halaman {currentPage} dari {totalPages}
                {(debouncedSearchQuery ||
                  debouncedStartUpdatedAt ||
                  debouncedEndUpdatedAt ||
                  debouncedStatus) && (
                  <span className="ml-2 text-emerald-700 font-medium">
                    (Terfilter: {totalElements} hasil)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Add Memorization Modal */}
        {newMemorizationModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => {
                  setNewMemorizationModal(false);
                  setForm({
                    status: "",
                    updatedAt: new Date().toISOString().split("T")[0],
                    studentId: "",
                    surahIds: [],
                  });
                  setClassLevelFilter("");
                  setFormError(null);
                }}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>
              <h2
                id="modal-title"
                className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2"
              >
                Tambah Setoran Hafalan Santri
              </h2>
              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="mb-4 text-red-600 text-sm font-medium">
                    {formError}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="classLevelFilter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Filter Kelas
                    </label>
                    <select
                      id="classLevelFilter"
                      value={classLevelFilter}
                      onChange={handleClassLevelFilterChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      disabled={loading}
                    >
                      <option value="">Semua Kelas</option>
                      {classLevels.map((level) => (
                        <option key={level} value={level}>
                          Kelas {level}
                        </option>
                      ))}
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
                          studentId: selectedOption?.value || "",
                        }))
                      }
                      value={
                        studentOptions.find(
                          (opt) => opt.value === form.studentId
                        ) || null
                      }
                      placeholder="Pilih Santri..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {["SUDAH_HAFAL", "BELUM_HAFAL", "MENGULANG"].map(
                        (status) => (
                          <label
                            key={status}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={form.status === status}
                              onChange={() => handleStatusChange(status)}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              disabled={loading}
                            />
                            <span className="text-sm">
                              {status === "SUDAH_HAFAL"
                                ? "Sudah Hafal"
                                : status === "BELUM_HAFAL"
                                ? "Belum Hafal"
                                : "Mengulang"}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="updatedAt"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tanggal Update
                    </label>
                    <input
                      type="date"
                      id="updatedAt"
                      name="updatedAt"
                      value={form.updatedAt}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Surah
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {surahs.map((surah) => (
                        <label
                          key={surah.id}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <input
                            type="checkbox"
                            checked={form.surahIds.includes(surah.id)}
                            onChange={() => handleSurahChange(surah.id)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            disabled={loading}
                          />
                          <span className="text-sm">
                            {surah.name} (Surah {surah.number})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setNewMemorizationModal(false);
                      setForm({
                        status: "",
                        updatedAt: new Date().toISOString().split("T")[0],
                        studentId: "",
                        surahIds: [],
                      });
                      setClassLevelFilter("");
                      setFormError(null);
                    }}
                    disabled={loading}
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

        {/* Edit Memorization Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50"
            aria-modal="true"
            role="dialog"
            aria-labelledby="edit-modal-title"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in border border-gray-100">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedMemorizationId(null);
                  setForm({
                    status: "",
                    updatedAt: new Date().toISOString().split("T")[0],
                    studentId: "",
                    surahIds: [],
                  });
                  setClassLevelFilter("");
                  setFormError(null);
                }}
                aria-label="Tutup Modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2
                id="edit-modal-title"
                className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-2"
              >
                Edit Data Hafalan Santri
              </h2>

              <form onSubmit={handleEdit}>
                {formError && (
                  <div className="mb-4 text-red-600 text-sm font-medium">
                    {formError}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="classLevelFilter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Filter Kelas
                    </label>
                    <select
                      id="classLevelFilter"
                      value={classLevelFilter}
                      onChange={handleClassLevelFilterChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      disabled={loading}
                    >
                      <option value="">Semua Kelas</option>
                      {classLevels.map((level) => (
                        <option key={level} value={level}>
                          Kelas {level}
                        </option>
                      ))}
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
                          studentId: selectedOption?.value || "",
                        }))
                      }
                      value={
                        studentOptions.find(
                          (opt) => opt.value === form.studentId
                        ) || null
                      }
                      placeholder="Pilih Santri..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {["SUDAH_HAFAL", "BELUM_HAFAL", "MENGULANG"].map(
                        (status) => (
                          <label
                            key={status}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={form.status === status}
                              onChange={() => handleStatusChange(status)}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              disabled={loading}
                            />
                            <span className="text-sm">
                              {status === "SUDAH_HAFAL"
                                ? "Sudah Hafal"
                                : status === "BELUM_HAFAL"
                                ? "Belum Hafal"
                                : "Mengulang"}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="updatedAt"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tanggal Update
                    </label>
                    <input
                      type="date"
                      id="updatedAt"
                      name="updatedAt"
                      value={form.updatedAt}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Surah
                    </label>
                    <Select
                      inputId="surahId"
                      name="surahId"
                      options={surahOptions}
                      onChange={(selectedOption) =>
                        setForm((prev) => ({
                          ...prev,
                          surahIds: selectedOption?.value
                            ? [selectedOption.value]
                            : [],
                        }))
                      }
                      value={
                        surahOptions.find((opt) =>
                          form.surahIds.includes(opt.value)
                        ) || null
                      }
                      placeholder="Pilih Surah..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={loading}
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedMemorizationId(null);
                      setForm({
                        status: "",
                        updatedAt: new Date().toISOString().split("T")[0],
                        studentId: "",
                        surahIds: [],
                      });
                      setClassLevelFilter("");
                      setFormError(null);
                    }}
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Memuat..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {infoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all duration-300 ease-in-out"
            aria-modal="true"
            role="dialog"
            aria-labelledby="detail-modal-title"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 border border-gray-100 animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                onClick={() => setInfoModal(false)}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2
                id="detail-modal-title"
                className="text-3xl font-bold text-emerald-700 mb-6 border-b pb-3 flex items-center gap-2"
              >
                <BookOpen className="w-6 h-6" /> Detail Setoran Hafalan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Surah
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseSurah?.name
                        ? `${detailInfoModal.responseSurah.name} (Surah ${detailInfoModal.responseSurah.number})`
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BadgeInfo className="w-5 h-5 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Status
                    </label>
                    <p
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        detailInfoModal.status === "SUDAH_HAFAL"
                          ? "bg-green-100 text-green-800"
                          : detailInfoModal.status === "BELUM_HAFAL"
                          ? "bg-red-100 text-red-800"
                          : detailInfoModal.status === "MENGULANG"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {detailInfoModal.status === "SUDAH_HAFAL"
                        ? "Sudah Hafal"
                        : detailInfoModal.status === "BELUM_HAFAL"
                        ? "Belum Hafal"
                        : detailInfoModal.status === "MENGULANG"
                        ? "Mengulang"
                        : detailInfoModal.status || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Tanggal Update
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.updatedAt
                        ? new Date(
                            detailInfoModal.updatedAt
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
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
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                  onClick={() => setInfoModal(false)}
                  disabled={loading}
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

export default StudentMemorizationController;
