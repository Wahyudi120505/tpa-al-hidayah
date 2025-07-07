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
  Users,
  Info,
  Trash2,
  Edit,
  Plus,
  X,
  Phone,
  Mail,
  User,
  Hash,
  Baby,
  Calendar,
  BadgeInfo,
} from "lucide-react";
import Select from "react-select";

const GradeController = () => {
  const [dataGrades, setDataGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState("DESC");
  // const [showFilters, setShowFilters] = useState(false);
  const [newGradeModal, setNewGradeModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [detailInfoModal, setDetailInfoModal] = useState({});
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [form, setForm] = useState({
    semester: "",
    academicYear: "",
    studentId: "",
    scores: [], // Array to store { subjectId, score } objects
  });
  const [formError, setFormError] = useState(null);

  const fetchData = async () => {
    const token = Cookies.get("authToken");
    setLoading(true);
    setError(null);

    try {
      // Fetch grades
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        sortOrder: sortOrder,
      });

      if (searchQuery.trim()) {
        params.append("query", searchQuery.trim());
      }

      const gradesResponse = await fetch(
        `http://localhost:8080/api/grades?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!gradesResponse.ok) {
        throw new Error(`HTTP error! status: ${gradesResponse.status}`);
      }

      const gradesData = await gradesResponse.json();
      setDataGrades(gradesData.content || []);
      setTotalPages(gradesData.totalPages || 0);
      setTotalElements(gradesData.totalElements || 0);

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

      const subjectsResponse = await fetch(
        "http://localhost:8080/api/subjects?page=1&size=1000&sortOrder=ASC",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!subjectsResponse.ok) {
        throw new Error(`HTTP error! status: ${subjectsResponse.status}`);
      }
      const subjectsData = await subjectsResponse.json();
      setSubjects(subjectsData.content || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Gagal mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sortOrder, searchQuery]);

  useEffect(() => {
    if (subjects.length > 0 && form.scores.length === 0) {
      setForm((prev) => ({
        ...prev,
        scores: subjects.map((subject) => ({
          subjectId: subject.id,
          score: "",
        })),
      }));
    }
  }, [subjects]);

  const studentOptions = students.map((student) => ({
    value: student.id,
    label: `${student.name}`,
  }));

  const subjectOptions = subjects.map((subject) => ({
    value: subject.id,
    label: `${subject.name}`,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null);
  };

  const handleScoreChange = (subjectId, value) => {
    setForm((prev) => ({
      ...prev,
      scores: prev.scores.map((scoreObj) =>
        scoreObj.subjectId === subjectId ? { ...scoreObj, score: value } : scoreObj
      ),
    }));
    setFormError(null);
  };

  const handleNextSlide = () => {
    if (!form.studentId || !form.semester || !form.academicYear) {
      setFormError("Semua field di Slide 1 wajib diisi");
      return;
    }
    setCurrentSlide(2);
    setFormError(null);
  };

  const handlePreviousSlide = () => {
    setCurrentSlide(1);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidScores = form.scores.filter(
      (scoreObj) =>
        scoreObj.score === "" ||
        isNaN(scoreObj.score) ||
        scoreObj.score < 0 ||
        scoreObj.score > 100
    );

    if (invalidScores.length > 0) {
      setFormError("Semua nilai harus diisi dengan angka valid antara 0 dan 100");
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const requests = form.scores.map((scoreObj) =>
        fetch("http://localhost:8080/api/grades", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            semester: form.semester,
            score: Number(scoreObj.score),
            academicYear: form.academicYear,
            studentId: Number(form.studentId),
            subjectId: Number(scoreObj.subjectId),
          }),
        })
      );

      const responses = await Promise.all(requests);
      const errors = responses.filter((res) => !res.ok);

      if (errors.length > 0) {
        const errorData = await Promise.all(errors.map((res) => res.json()));
        setFormError(
          errorData
            .map((err) => err.message || "Gagal menambah grade")
            .join("; ")
        );
        return;
      }

      alert("Berhasil menambah semua nilai");
      setForm({
        semester: "",
        academicYear: "",
        studentId: "",
        scores: subjects.map((subject) => ({
          subjectId: subject.id,
          score: "",
        })),
      });
      setNewGradeModal(false);
      setCurrentSlide(1);
      fetchData();
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      setFormError("Terjadi kesalahan server");
    }
  };

  const handleClick = async (id) => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(`http://localhost:8080/api/grades/${id}`, {
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
      setError("Gagal mengambil detail grade. Silakan coba lagi.");
    }
  };

  const handleShowEditModal = (grade) => {
    setSelectedGradeId(grade.id);
    setForm({
      semester: grade.semester || "",
      score: grade.score ? grade.score : "",
      academicYear: grade.academicYear || "",
      studentId: grade.responseStudent?.id ? grade.responseStudent.id : "",
      subjectId: grade.responseSubject?.id ? grade.responseSubject.id : "",
    });
    setFormError(null);
    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (
      !form.semester ||
      !form.scores ||
      !form.academicYear ||
      !form.studentId ||
      !form.subjectId
    ) {
      setFormError("Semua field wajib diisi");
      return;
    }

    if (isNaN(form.scores) || form.scores < 0 || form.scores > 100) {
      setFormError("Nilai harus antara 0 dan 100");
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/api/grades/${selectedGradeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            semester: form.semester,
            score: Number(form.score),
            academicYear: form.academicYear,
            studentId: Number(form.studentId),
            subjectId: Number(form.subjectId),
          }),
        }
      );

      if (response.ok) {
        alert("Berhasil memperbarui grade");
        setForm({
          semester: "",
          academicYear: "",
          studentId: "",
          scores: subjects.map((subject) => ({
            subjectId: subject.id,
            score: "",
          })),
        });
        setShowEditModal(false);
        setSelectedGradeId(null);
        setFormError(null);
        fetchData();
      } else {
        const errorData = await response.json();
        setFormError(errorData.message || "Gagal memperbarui grade");
      }
    } catch (error) {
      console.error("Error updating grade:", error);
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
    setCurrentPage(1);
    setSortOrder("DESC");
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

  return (
    <>
      <Sidebar menuActive={"grades"} />
      <div className="lg:ml-64 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Data Nilai Santri
              </h1>
              <p className="text-gray-600">
                Kelola data nilai santri pesantren
              </p>
            </div>
            <button
              onClick={() => setNewGradeModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Grade</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col lg:flex-row gap-4 items-end"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cari Nilai
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama santri atau ujian..."
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
          ) : dataGrades.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="mx-auto h-12 w-12 text-gray-700" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery
                  ? "Tidak ada data yang sesuai filter"
                  : "Belum ada data nilai"}
              </p>
              <p className="text-gray-400 mt-1">
                {searchQuery
                  ? "Coba ubah kriteria pencarian"
                  : "Data nilai akan ditampilkan di sini"}
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
                      Mata Pelajaran
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nilai
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tahun Ajaran
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
                  {dataGrades.map((item, index) => (
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
                        {item.responseSubject?.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {item.score ? item.score : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {item.semester || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {item.academicYear || "-"}
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

        {dataGrades.length > 0 && (
          <div className="mt-6 bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">
                Total Data Nilai: {totalElements}
              </span>
              <span className="text-emerald-600 text-sm">
                Halaman {currentPage} dari {totalPages}
                {searchQuery && (
                  <span className="ml-2 text-emerald-700 font-medium">
                    (Terfilter: {dataGrades.length} hasil)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {newGradeModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => {
                  setNewGradeModal(false);
                  setCurrentSlide(1);
                  setForm({
                    semester: "",
                    academicYear: "",
                    studentId: "",
                    scores: subjects.map((subject) => ({
                      subjectId: subject.id,
                      score: "",
                    })),
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
                Tambah Nilai - Slide {currentSlide} dari 2
              </h2>
              <form
                onSubmit={
                  currentSlide === 2 ? handleSubmit : (e) => e.preventDefault()
                }
              >
                {formError && (
                  <div className="mb-4 text-red-600 text-sm font-medium">
                    {formError}
                  </div>
                )}
                {currentSlide === 1 && (
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
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="semester"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Semester
                      </label>
                      <select
                        id="semester"
                        name="semester"
                        value={form.semester}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        required
                      >
                        <option value="" disabled>
                          Pilih Semester
                        </option>
                        <option value="Ganjil">Ganjil</option>
                        <option value="Genap">Genap</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="academicYear"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tahun Ajaran
                      </label>
                      <input
                        type="text"
                        id="academicYear"
                        name="academicYear"
                        value={form.academicYear}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="Contoh: 2023/2024"
                        required
                      />
                    </div>
                  </div>
                )}
                {currentSlide === 2 && (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">
                            {subject.name}
                          </label>
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            value={
                              form.scores.find(
                                (s) => s.subjectId === subject.id
                              )?.score || ""
                            }
                            onChange={(e) =>
                              handleScoreChange(subject.id, e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="0-100"
                            min="0"
                            max="100"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex justify-between space-x-3">
                  <div>
                    {currentSlide === 2 && (
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        onClick={handlePreviousSlide}
                      >
                        Kembali
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => {
                        setNewGradeModal(false);
                        setCurrentSlide(1);
                        setForm({
                          semester: "",
                          academicYear: "",
                          studentId: "",
                          scores: subjects.map((subject) => ({
                            subjectId: subject.id,
                            score: "",
                          })),
                        });
                        setFormError(null);
                      }}
                    >
                      Batal
                    </button>
                    {currentSlide === 1 ? (
                      <button
                        type="button"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                        onClick={handleNextSlide}
                        disabled={loading}
                      >
                        Lanjut
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {loading ? "Memuat..." : "Tambah"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="edit-modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-100">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => setShowEditModal(false)}
                aria-label="Tutup modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2
                id="edit-modal-title"
                className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2"
              >
                Edit Nilai
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
                      htmlFor="subjectId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mata Pelajaran
                    </label>
                    <Select
                      inputId="subjectId"
                      name="subjectId"
                      options={subjectOptions}
                      onChange={(selectedOption) =>
                        setForm((prev) => ({
                          ...prev,
                          subjectId: selectedOption?.value || "",
                        }))
                      }
                      value={
                        subjectOptions.find(
                          (opt) => opt.value === form.subjectId
                        ) || null
                      }
                      placeholder="Pilih Mata Pelajaran..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="semester"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Semester
                    </label>
                    <select
                      id="semester"
                      name="semester"
                      value={form.semester}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    >
                      <option value="" disabled>
                        Pilih Semester
                      </option>
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="score"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nilai
                    </label>
                    <input
                      type="number"
                      id="score"
                      name="score"
                      value={form.score}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Masukkan nilai (0-100)"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="academicYear"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tahun Ajaran
                    </label>
                    <input
                      type="text"
                      id="academicYear"
                      name="academicYear"
                      value={form.academicYear}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Contoh: 2023/2024"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => setShowEditModal(false)}
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
                <Users className="w-6 h-6" /> Detail Nilai
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <User className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Nama Santri
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
                      Mata Pelajaran
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.responseSubject?.name || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Nilai
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.score
                        ? detailInfoModal.score.toFixed(1)
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Baby className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Semester
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.semester || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 text-emerald-500" />
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Tahun Ajaran
                    </label>
                    <p className="font-semibold">
                      {detailInfoModal.academicYear || "-"}
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

export default GradeController;