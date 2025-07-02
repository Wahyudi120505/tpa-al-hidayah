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
  Mail,
  Phone,
  BookOpen,
} from "lucide-react";

const StudentMemorizationController = () => {
  const [dataHafalan, setDataHafalan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [newMemorizationModal, setNewMemorizationModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [detailInfoModal, setDetailInfoModal] = useState({});
  const [students, setStudents] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMemorizationId, setSelectedMemorizationId] = useState(null);

  const [form, setForm] = useState({
    status: "",
    updatedAt: new Date().toISOString().split("T")[0],
    studentId: "",
    surahId: "",
  });
  const [formError, setFormError] = useState(null);

  const studentOptions = students.map((student) => ({
    value: student.id,
    label: `${student.name} (ID: ${student.id})`,
  }));

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
    searchQuery,
    startDate,
    endDate,
    status,
  ]);

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
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }
      if (status) {
        params.append("status", status);
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
      setError(`Gagal mengambil data hafalan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async () => {
    try {
      const token = Cookies.get("authToken");
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
        throw new Error("Gagal mengambil data santri");
      }

      const data = await response.json();
      setStudents(data.content || []);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Gagal mengambil data santri untuk dropdown");
    }
  };

  const fetchSurahData = async () => {
    try {
      const token = Cookies.get("authToken");
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
        throw new Error("Gagal mengambil data surah");
      }

      const data = await response.json();
      setSurahs(data.content || []);
    } catch (error) {
      console.error("Error fetching surah data:", error);
      setError("Gagal mengambil data surah untuk dropdown");
    }
  };

  const handleShowEditModal = (e) => {
    setSelectedMemorizationId(e.id);
    setForm({
      id: e.id || "",
      status: e.status || "",
      studentId: e.responseStudent.id,
      updatedAt: e.updatedAt
        ? new Date(e.updatedAt).toISOString().split("T")[0]
        : "",
      surahId: e.responseSurah.id,
    });
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

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/student-memorization-status/${selectedMemorizationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (response.ok) {
        alert("Data santri berhasil diperbarui!");
        setForm({
          id: "",
          status: "",
          updatedAt: "",
          studentId: 0,
          surahId: 0,
        });
        setShowEditModal(false);
        setSelectedMemorizationId(null);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(
          `Gagal memperbarui data: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Gagal memperbarui data santri");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.status || !form.studentId || !form.surahId) {
      setFormError("Semua field wajib diisi");
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        "http://localhost:8080/api/student-memorization-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            updatedAt: new Date().toISOString().split("T")[0],
            studentId: Number(form.studentId),
            surahId: Number(form.surahId),
          }),
        }
      );

      if (response.ok) {
        alert("Berhasil menambah setoran");
        setForm({
          status: "",
          updatedAt: new Date().toISOString().split("T")[0],
          studentId: "",
          surahId: "",
        });
        setNewMemorizationModal(false);
        fetchData();
      } else {
        alert("Gagal menambah setoran");
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      alert("Terjadi kesalahan server");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const handleReset = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setCurrentPage(1);
    setSortOrder("ASC");
    setPageSize(10);
    fetchData();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  };

  const handleShowInfo = (item) => {
    setDetailInfoModal(item);
    setInfoModal(true);
  };

  return (
    <>
      <Sidebar menuActive={"hafalan"} />
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
              onClick={() => setNewMemorizationModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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
              <div className="flex flex-col lg:flex-row gap-4 w-full mt-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Akhir
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Semua Status</option>
                    <option value="SUDAH_HAFAL">Sudah Hafal</option>
                    <option value="BELUM_HAFAL">Belum Hafal</option>
                    <option value="MENGULANG">Mengulang</option>
                  </select>
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
          ) : dataHafalan.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="mx-auto h-12 w-12 text-gray-700" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery || startDate || endDate || status
                  ? "Tidak ada data yang sesuai filter"
                  : "Belum ada data hafalan"}
              </p>
              <p className="text-gray-400 mt-1">
                {searchQuery || startDate || endDate || status
                  ? "Coba ubah kriteria pencarian"
                  : "Data hafalan akan ditampilkan di sini"}
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
                    <th className="px-20 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataHafalan.map((item) => (
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
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleShowInfo(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="Info"
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
        {dataHafalan.length > 0 && (
          <div className="mt-6 bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">
                Total Data Hafalan: {totalElements}
              </span>
              <span className="text-emerald-600 text-sm">
                Halaman {currentPage} dari {totalPages}
                {(searchQuery || startDate || endDate || status) && (
                  <span className="ml-2 text-emerald-700 font-medium">
                    (Terfilter: {dataHafalan.length} hasil)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
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
                onClick={() => setNewMemorizationModal(false)}
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
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    >
                      <option value="">Pilih Status</option>
                      <option value="SUDAH_HAFAL">Sudah Hafal</option>
                      <option value="BELUM_HAFAL">Belum Hafal</option>
                      <option value="MENGULANG">Mengulang</option>
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
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="surahId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Surah
                    </label>
                    <Select
                      inputId="surahId"
                      name="surahId"
                      options={surahOptions}
                      onChange={(selectedOption) =>
                        setForm((prev) => ({
                          ...prev,
                          surahId: selectedOption?.value || "",
                        }))
                      }
                      value={
                        surahOptions.find(
                          (opt) => opt.value === form.surahId
                        ) || null
                      }
                      placeholder="Pilih Surah..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => setNewMemorizationModal(false)}
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
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in border border-gray-100">
              {/* Tombol Tutup */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedMemorizationId(null);
                  setForm({
                    id: "",
                    status: "",
                    updatedAt: "",
                    studentId: 0,
                    surahId: 0,
                  });
                }}
                aria-label="Tutup Modal"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Judul */}
              <h2 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-2">
                Edit Data Hafalan Santri
              </h2>

              {/* Form */}
              <form onSubmit={handleEdit}>
                {formError && (
                  <div className="mb-4 text-red-600 text-sm font-medium">
                    {formError}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    >
                      <option value="SUDAH_HAFAL">Sudah Hafal</option>
                      <option value="BELUM_HAFAL">Belum Hafal</option>
                      <option value="MENGULANG">Mengulang</option>
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
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="surahId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Surah
                    </label>
                    <Select
                      inputId="surahId"
                      name="surahId"
                      options={surahOptions}
                      onChange={(selectedOption) =>
                        setForm((prev) => ({
                          ...prev,
                          surahId: selectedOption?.value || "",
                        }))
                      }
                      value={
                        surahOptions.find(
                          (opt) => opt.value === form.surahId
                        ) || null
                      }
                      placeholder="Pilih Surah..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  {/* <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => setShowEditModal(false)}
                  >
                    Batal
                  </button> */}
                  <button
                    type="submit"
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition"
                    disabled={loading}
                  >
                    {loading ? "Memuat..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                <BookOpen className="w-6 h-6" /> Detail Setoran Hafalan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Hash className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      ID Setoran
                    </label>
                    <p className="font-semibold">{detailInfoModal.id || "-"}</p>
                  </div>
                </div>
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
                  <BadgeInfo className="mt-1 text-emerald-500" />
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
              </div>

              <h3 className="text-xl font-semibold text-emerald-600 mt-8 mb-4 border-b pb-2 flex items-center gap-2">
                <User className="w-5 h-5" /> Data Santri
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Hash className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      ID Santri
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseStudent?.id || "-"}
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
                  <BadgeInfo className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Gender
                    </label>
                    <p
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        detailInfoModal.responseStudent?.gender === "L"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {detailInfoModal.responseStudent?.gender === "L"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Tanggal Lahir
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
              </div>

              <h3 className="text-xl font-semibold text-emerald-600 mt-8 mb-4 border-b pb-2 flex items-center gap-2">
                <Users className="w-5 h-5" /> Data Orang Tua
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Hash className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      ID
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseStudent?.responeParent?.id ||
                        "-"}
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
                      {detailInfoModal.responseStudent?.responeParent?.name ||
                        "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Email
                    </label>
                    <p className="font-semibold break-words">
                      {detailInfoModal.responseStudent?.responeParent?.email ||
                        "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      No HP
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseStudent?.responeParent?.noHp ||
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

export default StudentMemorizationController;
