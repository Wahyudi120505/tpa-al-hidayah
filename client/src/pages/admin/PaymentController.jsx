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
  UserPlus,
  Info,
  Plus,
  X,
  Edit,
  Trash2,
  Users,
  XCircle,
  CheckCircle,
  Calendar,
  User,
  BadgeInfo,
} from "lucide-react";
import Select from "react-select";

const PaymentController = () => {
  const [dataPayments, setDataPayments] = useState([]);
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
  const [newPaymentModal, setNewPaymentModal] = useState(false);
  const [editPaymentModal, setEditPaymentModal] = useState(false);
  const [editPaymentId, setEditPaymentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [infoModal, setInfoModal] = useState(false);
  const [detailInfoModal, setDetailInfoModal] = useState({});
  const [form, setForm] = useState({
    studentId: "",
    date: new Date().toISOString().split("T")[0], // Default to current date (YYYY-MM-DD)
    paymentDate: new Date().toISOString().split("T")[0], // Default to current date (YYYY-MM-DD)
    status: "",
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchData();
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
      // Fetch payments
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
        `http://localhost:8080/api/payments?${params}`,
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
          `Gagal mengambil data pembayaran: status ${response.status}, ${
            errorText || "Tidak ada detail kesalahan dari server"
          }`
        );
      }

      const jsonData = await response.json();
      setDataPayments(jsonData.content || []);
      setTotalPages(jsonData.totalPages || 0);
      setTotalElements(jsonData.totalElements || 0);

      // Fetch students for the dropdown
      const studentsResponse = await fetch(
        "http://localhost:8080/api/students?page=1&size=1000&sortOrder=ASC",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!studentsResponse.ok) {
        throw new Error(`HTTP error! status: ${studentsResponse.status}`);
      }
      const studentsData = await studentsResponse.json();
      setStudents(studentsData.content || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setError(`Gagal mengambil data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const studentOptions = students.map((student) => ({
    value: student.id,
    label: `${student.name}`,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null);
  };

  const handleShowEditModal = (payment) => {
    setForm({
      studentId: payment.responseStudent?.id || "",
      date: payment.date ? payment.date.split("T")[0] : "",
      paymentDate: payment.paymentDate ? payment.paymentDate.split("T")[0] : "",
      status: payment.status || "",
    });
    setEditPaymentId(payment.id);
    setEditPaymentModal(true);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.date || !form.paymentDate || !form.status) {
      setFormError("Semua field wajib diisi");
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const url = editPaymentId
        ? `http://localhost:8080/api/payments/${editPaymentId}`
        : "http://localhost:8080/api/payments";
      const method = editPaymentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: Number(form.studentId),
          date: form.date,
          paymentDate: form.paymentDate,
          status: form.status,
        }),
      });

      if (response.ok) {
        alert(
          editPaymentId
            ? "Data pembayaran berhasil diperbarui!"
            : "Data pembayaran berhasil ditambahkan!"
        );
        setForm({
          studentId: "",
          date: new Date().toISOString().split("T")[0],
          paymentDate: new Date().toISOString().split("T")[0],
          status: "",
        });
        setNewPaymentModal(false);
        setEditPaymentModal(false);
        setEditPaymentId(null);
        setFormError(null);
        fetchData();
      } else {
        const errorData = await response.json();
        setFormError(errorData.message || "Gagal menyimpan pembayaran");
      }
    } catch (err) {
      console.error("Error saat mengirim data:", err);
      setFormError("Terjadi kesalahan server");
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
      <Sidebar menuActive={"spp"} />
      <div className="lg:ml-64 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Data Pembayaran
              </h1>
              <p className="text-gray-600">Kelola data pembayaran santri</p>
            </div>
            <button
              onClick={() => {
                setNewPaymentModal(true);
                setForm({
                  studentId: "",
                  date: new Date().toISOString().split("T")[0],
                  paymentDate: new Date().toISOString().split("T")[0],
                  status: "",
                });
                setFormError(null);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Payment</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col lg:flex-row gap-4 items-end"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cari Pembayaran
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama santri atau status..."
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
                    <option value="LUNAS">Lunas</option>
                    <option value="BELUM_DIBAYAR">Belum Dibayar</option>
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
          ) : dataPayments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <UserPlus className="mx-auto h-12 w-12 text-gray-700" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery || startDate || endDate || status
                  ? "Tidak ada data yang sesuai filter"
                  : "Belum ada data pembayaran"}
              </p>
              <p className="text-gray-400 mt-1">
                {searchQuery || startDate || endDate || status
                  ? "Coba ubah kriteria pencarian"
                  : "Data pembayaran akan ditampilkan di sini"}
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
                      Nama Santri
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {dataPayments.map((item, index) => (
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
                        {item.date
                          ? new Date(item.date).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === "LUNAS"
                              ? "bg-green-100 text-green-800"
                              : item.status === "BELUM_DIBAYAR"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status === "LUNAS"
                            ? "Lunas"
                            : item.status === "BELUM_DIBAYAR"
                            ? "Belum Dibayar"
                            : item.status || "-"}
                        </span>
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
                            onClick={() => handleShowInfo(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="Delete"
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

        {dataPayments.length > 0 && (
          <div className="mt-6 bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">
                Total Pembayaran: {totalElements}
              </span>
              <span className="text-emerald-600 text-sm">
                Halaman {currentPage} dari {totalPages}
                {(searchQuery || startDate || endDate || status) && (
                  <span className="ml-2 text-emerald-700 font-medium">
                    (Terfilter: {dataPayments.length} hasil)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {newPaymentModal && (
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
                  setNewPaymentModal(false);
                  setForm({
                    studentId: "",
                    date: new Date().toISOString().split("T")[0],
                    paymentDate: new Date().toISOString().split("T")[0],
                    status: "",
                  });
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
                Tambah Pembayaran
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
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
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
                      <option value="" disabled>
                        Pilih Status
                      </option>
                      <option value="LUNAS">Lunas</option>
                      <option value="BELUM_DIBAYAR">Belum Dibayar</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setNewPaymentModal(false);
                      setForm({
                        studentId: "",
                        date: new Date().toISOString().split("T")[0],
                        paymentDate: new Date().toISOString().split("T")[0],
                        status: "",
                      });
                      setFormError(null);
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

        {editPaymentModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="edit-modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => {
                  setEditPaymentModal(false);
                  setEditPaymentId(null);
                  setForm({
                    studentId: "",
                    date: new Date().toISOString().split("T")[0],
                    paymentDate: new Date().toISOString().split("T")[0],
                    status: "",
                  });
                  setFormError(null);
                }}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2
                id="edit-modal-title"
                className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2"
              >
                Edit Pembayaran
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
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
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
                      <option value="" disabled>
                        Pilih Status
                      </option>
                      <option value="LUNAS">Lunas</option>
                      <option value="BELUM_DIBAYAR">Belum Dibayar</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setEditPaymentModal(false);
                      setEditPaymentId(null);
                      setForm({
                        studentId: "",
                        date: new Date().toISOString().split("T")[0],
                        paymentDate: new Date().toISOString().split("T")[0],
                        status: "",
                      });
                      setFormError(null);
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Memuat..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {infoModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="info-modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => setInfoModal(false)}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2
                id="info-modal-title"
                className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center space-x-2"
              >
                <Info className="w-5 h-5 text-emerald-600" />
                <span>Detail Pembayaran</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Nama Santri
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseStudent?.name ||
                        "Tidak tersedia"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Tanggal Pembayaran
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.paymentDate
                        ? new Date(
                            detailInfoModal.paymentDate
                          ).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "Tidak tersedia"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BadgeInfo className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">Status</label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        detailInfoModal.status === "LUNAS"
                          ? "bg-green-100 text-green-800"
                          : detailInfoModal.status === "BELUM_DIBAYAR"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {detailInfoModal.status === "LUNAS"
                        ? "Lunas"
                        : detailInfoModal.status === "BELUM_DIBAYAR"
                        ? "Belum Dibayar"
                        : detailInfoModal.status || "Tidak tersedia"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Orang Tua
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseStudent?.responeParent?.name ||
                        "Tidak tersedia"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setInfoModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

export default PaymentController;
