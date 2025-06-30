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
} from "lucide-react";

const AbsensiController = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sortOrder, searchQuery, dateFilter, statusFilter]);

  const fetchData = async () => {
    const token = Cookies.get("authToken");
    setLoading(true);
    setError(null);
    // console.log("token:", token);

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
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
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
              {/* Search Input */}
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

              {/* Filter Toggle */}
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

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Date Filter */}
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

                  {/* Status Filter */}
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
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
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
                      Aksi
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
      </div>
    </>
  );
};

export default AbsensiController;
