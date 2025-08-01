/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
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
  Info,
  Users,
  X,
  Hash,
  User,
  Mail,
  Phone,
  UserCircle,
} from "lucide-react";

const ParentController = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorForm, setErrorForm] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [newParentModal, setNewParentModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [detailInfoModal, setDetailInfoModal] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState("ASC");

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sortOrder, searchQuery]);

  const fetchData = async () => {
    const token = Cookies.get("authToken");
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        sortOrder: sortOrder,
      });

      if (searchQuery.trim()) {
        params.append("query", searchQuery.trim());
      }

      const response = await fetch(
        `http://localhost:8080/api/parents?${params}`,
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
      setError("Gagal mengambil data orang tua");
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    noHp: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm(null);
    
    // Validation
    if (!form.name || !form.email || !form.password) {
      setErrorForm("Nama, email, dan password wajib diisi");
      return;
    }

    try {
      const token = Cookies.get("authToken");

      const response = await fetch("http://localhost:8080/api/parents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm({ name: "", email: "", noHp: "", password: "" });
        setNewParentModal(false);
        fetchData();
      } else {
        const errorData = await response.json();
        setErrorForm(errorData.message || "Gagal menambahkan data orang tua");
      }
    } catch (err) {
      console.error("Error saat mengirim data:", err);
      setErrorForm("Terjadi kesalahan server");
    }
  };

  const handleShowEditModal = (parent) => {
    setSelectedParentId(parent.id);
    setForm({
      id: parent.id || "",
      name: parent.name || "",
      email: parent.email || "",
      noHp: parent.noHp || "",
      password: "", // Don't show existing password for security
    });
    setErrorForm(null);
    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setErrorForm(null);
    
    // Validation
    if (!form.name || !form.email || !form.password) {
      setErrorForm("Nama, email, dan password wajib diisi");
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/parents/${selectedParentId}`,
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
        setForm({
          id: "",
          name: "",
          email: "",
          noHp: "",
          password: "",
        });
        setShowEditModal(false);
        setSelectedParentId(null);
        fetchData();
      } else {
        const errorData = await response.json();
        setErrorForm(errorData.message || "Gagal memperbarui data orang tua");
      }
    } catch (error) {
      console.error("Error updating parent:", error);
      setErrorForm("Terjadi kesalahan saat memperbarui data");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const handleReset = () => {
    setSearchQuery("");
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

  const handleClick = async (id) => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(`http://localhost:8080/api/parents/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      setDetailInfoModal(jsonData);
      setInfoModal(true);
    } catch (error) {
      console.error("Gagal mengambil detail data:", error);
      setError("Gagal memuat detail orang tua");
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm(
      "Menghapus data orang tua ini juga akan menghapus semua data yang terkait. Apakah Anda yakin ingin melanjutkan?"
    );
    if (!konfirmasi) return;

    try {
      const token = Cookies.get("authToken");
      const response = await fetch(`http://localhost:8080/api/parents/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Gagal menghapus data");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus data:", error);
      setError("Terjadi kesalahan pada server");
    }
  };

  return (
    <>
      <Sidebar menuActive={"parent"} />
      <div className="lg:ml-64 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Daftar Orang Tua
              </h1>
              <p className="text-gray-600">Kelola data orang tua/wali santri</p>
            </div>
            <button
              onClick={() => setNewParentModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Orang Tua</span>
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col lg:flex-row gap-4 items-end"
            >
              {/* Search Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cari Orang Tua
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama atau email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Page Size */}
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

              {/* Sort Order */}
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

              {/* Action Buttons */}
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
                <Info className="mx-auto h-12 w-12" />
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
                <Users className="mx-auto h-12 w-12" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery
                  ? "Tidak ada data yang sesuai pencarian"
                  : "Belum ada data orang tua"}
              </p>
              <p className="text-gray-400 mt-1">
                {searchQuery
                  ? "Coba ubah kata kunci pencarian"
                  : "Data orang tua akan ditampilkan di sini"}
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
                    <th className="px-20 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. HP
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
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
                                {item.name
                                  ? item.name.charAt(0).toUpperCase()
                                  : "O"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name || "Nama tidak tersedia"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.noHp || "-"}
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
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
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

              {/* Page Numbers */}
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
                Total Orang Tua: {totalElements}
              </span>
              <span className="text-emerald-600 text-sm">
                Halaman {currentPage} dari {totalPages}
                {searchQuery && (
                  <span className="ml-2 text-emerald-700 font-medium">
                    (Terfilter: {data.length} hasil)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
        {/* Edit Parent Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in border border-gray-100">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedParentId(null);
                  setForm({
                    id: "",
                    name: "",
                    email: "",
                    noHp: "",
                    password: "",
                  });
                  setErrorForm(null);
                }}
                aria-label="Tutup Modal"
              >
                <X className="w-6 h-6" />
              </button>

              {errorForm && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {errorForm}
                </div>
              )}

              <h2 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-2">
                Edit Data Orang Tua
              </h2>

              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    No HP
                  </label>
                  <input
                    type="text"
                    name="noHp"
                    value={form.noHp}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
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
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 border border-gray-100 animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                onClick={() => setInfoModal(false)}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <UserCircle className="w-8 h-8 text-emerald-600" />
                <h2 className="text-2xl font-bold text-emerald-700">
                  Detail Orang Tua
                </h2>
              </div>

              <div className="space-y-4 text-sm text-gray-800">
                <div className="flex items-center gap-3">
                  <User className="text-emerald-500 w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Nama</p>
                    <p className="font-medium">{detailInfoModal.name || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-emerald-500 w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium break-words">
                      {detailInfoModal.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-emerald-500 w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">No Telpon</p>
                    <p className="font-medium">{detailInfoModal.noHp || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
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
        {/* Add Parent Modal */}
        {newParentModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => {
                  setNewParentModal(false);
                  setErrorForm(null);
                }}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>

              {errorForm && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {errorForm}
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Tambah Orang Tua
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      No Telpon
                    </label>
                    <input
                      type="text"
                      name="noHp"
                      value={form.noHp}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setNewParentModal(false);
                      setErrorForm(null);
                    }}
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
      </div>
    </>
  );
};

export default ParentController;