/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Search,
  Edit,
  Trash2,
  Info,
  X,
  BookOpen,
  SortAsc,
  SortDesc,
  RefreshCw,
  Plus,
  User,
} from "lucide-react";
import Sidebar from "../../components/admin/Sidebar";

const SubjectControllerEdit = () => {
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectModal, setNewSubjectModal] = useState(false);
  const [editSubjectModal, setEditSubjectModal] = useState(false);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editSubjectError, setEditSubjectError] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchSubjectData();
  }, [currentPage, pageSize, searchQuery]);

  const fetchSubjectData = async () => {
    const token = Cookies.get("authToken");
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
      });

      if (searchQuery.trim()) {
        params.append("query", searchQuery.trim());
      }

      const response = await fetch(
        `http://localhost:8080/api/subjects?${params}`,
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
      const data = await response.json();
      setSubjectData(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching subject data:", error);
      setError("Gagal mengambil data mata pelajaran. Silakan coba lagi.");
      setSubjectData([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const validateSubjectName = (name) => {
    if (!name.trim()) {
      return "Nama mata pelajaran tidak boleh kosong";
    }
    if (name.length < 3) {
      return "Nama mata pelajaran harus minimal 3 karakter";
    }
    return null;
  };

  const handleAddSubject = async () => {
    const validationError = validateSubjectName(newSubjectName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("authToken");
      const response = await fetch("http://localhost:8080/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newSubjectName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      alert("Berhasil menambah mata pelajaran");
      setNewSubjectName("");
      setNewSubjectModal(false);
      setCurrentPage(1);
      fetchSubjectData();
    } catch (error) {
      console.error("Error adding subject:", error);
      setError(
        error.message || "Gagal menambah mata pelajaran. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = async () => {
    const validationError = validateSubjectName(editSubjectName);
    if (validationError) {
      setEditSubjectError(validationError);
      return;
    }

    setLoading(true);
    setEditSubjectError(null);
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/subjects/${selectedSubject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: editSubjectName.trim() }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      alert("Berhasil memperbarui mata pelajaran");
      setEditSubjectModal(false);
      setSelectedSubject(null);
      setEditSubjectName("");
      fetchSubjectData();
    } catch (error) {
      console.error("Error editing subject:", error);
      setEditSubjectError(
        error.message || "Gagal memperbarui mata pelajaran. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/subjects/${selectedSubject.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      alert("Berhasil menghapus mata pelajaran");
      setDeleteModal(false);
      setSelectedSubject(null);
      if (subjectData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchSubjectData();
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      setError(
        error.message || "Gagal menghapus mata pelajaran. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSubjectData();
  };

  const handleReset = () => {
    setSearchQuery("");
    setPageSize(10);
    setCurrentPage(1);
    setSortOrder("ASC");
    fetchSubjectData();
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setEditSubjectName(subject.name);
    setEditSubjectError(null);
    setEditSubjectModal(true);
  };

  const openDetailModal = (subject) => {
    setSelectedSubject(subject);
    setDetailModal(true);
  };

  const openDeleteModal = (subject) => {
    setSelectedSubject(subject);
    setDeleteModal(true);
  };

  const closeAllModals = () => {
    setNewSubjectModal(false);
    setEditSubjectModal(false);
    setDetailModal(false);
    setDeleteModal(false);
    setSelectedSubject(null);
    setEditSubjectName("");
    setNewSubjectName("");
    setError(null);
    setEditSubjectError(null);
  };

  return (
    <>
      <Sidebar menuActive="subject" />
      <div className="lg:ml-64 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Data Mata Pelajaran
              </h1>
              <p className="text-gray-600">
                Kelola data mata pelajaran pesantren
              </p>
            </div>
            <button
              onClick={() => setNewSubjectModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mata Pelajaran</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col lg:flex-row gap-4 items-end"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cari Mata Pelajaran
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama mata pelajaran..."
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
                  disabled={loading}
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
                  disabled={loading}
                >
                  {sortOrder === "DESC" ? (
                    <SortDesc className="w-4 h-4" />
                  ) : (
                    <SortAsc className="w-4 h-4" />
                  )}
                  <span>{sortOrder === "DESC" ? "Terbaru" : "Terlama"}</span>
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Cari
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
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
                onClick={fetchSubjectData}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : subjectData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="mx-auto h-12 w-12 text-gray-700" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery
                  ? "Tidak ada data yang sesuai filter"
                  : "Belum ada data mata pelajaran"}
              </p>
              <p className="text-gray-400 mt-1">
                {searchQuery
                  ? "Coba ubah kriteria pencarian"
                  : "Data mata pelajaran akan ditampilkan di sini"}
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
                      Nama Mata Pelajaran
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjectData.map((subject, index) => (
                    <tr
                      key={subject.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <BookOpen className="w-5 h-5 text-emerald-600 mr-3" />
                          {subject.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditModal(subject)}
                            className="text-emerald-600 hover:text-emerald-900 p-1 rounded-md hover:bg-emerald-50"
                            title="Edit"
                            aria-label="Edit mata pelajaran"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(subject)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            title="Hapus"
                            aria-label="Hapus mata pelajaran"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDetailModal(subject)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="Detail"
                            aria-label="Lihat detail mata pelajaran"
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
                disabled={currentPage === 1 || loading}
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
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}

        {subjectData.length > 0 && (
          <div className="mt-6 bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">
                Total Data Mata Pelajaran: {totalElements}
              </span>
              <span className="text-emerald-600 text-sm">
                Halaman {currentPage} dari {totalPages}
                {searchQuery && (
                  <span className="ml-2 text-emerald-700 font-medium">
                    (Terfilter: {subjectData.length} hasil)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Add Subject Modal */}
        {newSubjectModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="add-modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={closeAllModals}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>
              <h2
                id="add-modal-title"
                className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2"
              >
                Tambah Mata Pelajaran
              </h2>
              {error && (
                <div className="mb-4 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="newSubjectName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama Mata Pelajaran
                  </label>
                  <input
                    id="newSubjectName"
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="Masukkan nama mata pelajaran"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleAddSubject}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Memuat..." : "Tambah"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Subject Modal */}
        {editSubjectModal && selectedSubject && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="edit-modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={closeAllModals}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>
              <h2
                id="edit-modal-title"
                className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2"
              >
                Edit Mata Pelajaran
              </h2>
              {editSubjectError && (
                <div className="mb-4 text-red-600 text-sm font-medium">
                  {editSubjectError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="editSubjectName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama Mata Pelajaran
                  </label>
                  <input
                    id="editSubjectName"
                    type="text"
                    value={editSubjectName}
                    onChange={(e) => setEditSubjectName(e.target.value)}
                    placeholder="Masukkan nama mata pelajaran"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleEditSubject}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Memuat..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {detailModal && selectedSubject && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="detail-modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={closeAllModals}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>
              <h2
                id="detail-modal-title"
                className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Detail Mata Pelajaran
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Nama Mata Pelajaran
                    </label>
                    <p className="font-semibold text-gray-900">
                      {selectedSubject.name}
                    </p>
                  </div>
                </div>
                
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && selectedSubject && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="delete-modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={closeAllModals}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>
              <h2
                id="delete-modal-title"
                className="text-xl font-bold text-red-800 mb-6 border-b border-gray-200 pb-2"
              >
                Hapus Mata Pelajaran
              </h2>
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Apakah Anda yakin ingin menghapus mata pelajaran ini?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-red-800">
                    {selectedSubject.name}
                  </p>
                  <p className="text-red-600 text-sm">
                    ID: {selectedSubject.id}
                  </p>
                </div>
                <p className="text-red-600 text-sm mt-2">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteSubject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Memuat..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SubjectControllerEdit;
