/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Search, Edit, Trash2, Info, X, BookOpen, Calendar, User, SortAsc, SortDesc, Filter, RefreshCw } from "lucide-react";

const SubjectControllerEdit = () => {
    const [subjectData, setSubjectData] = useState([]);
    const [filteredSubjectData, setFilteredSubjectData] = useState([]);
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectModal, setNewSubjectModal] = useState(false);
    const [editSubjectModal, setEditSubjectModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [editSubjectName, setEditSubjectName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("ASC");
    const [showFilters, setShowFilters] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchSubjectData();
    }, [currentPage, pageSize, sortOrder, searchQuery]);

    const fetchSubjectData = async () => {
        try {
            const token = Cookies.get("authToken");
            const response = await fetch(
                `http://localhost:8080/api/subjects?page=${currentPage}&size=${pageSize}&sortOrder=${sortOrder}&sortBy=id&search=${encodeURIComponent(searchQuery)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setSubjectData(data.content || []);
            setFilteredSubjectData(data.content || []);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || data.content.length || 0);
        } catch (error) {
            console.error("Error fetching subject data:", error);
            setSubjectData([]);
            setFilteredSubjectData([]);
            setTotalPages(1);
            setTotalElements(0);
        }
    };

    const handleAddSubject = async () => {
        try {
            const token = Cookies.get("authToken");
            const response = await fetch("http://localhost:8080/api/subjects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newSubjectName }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setNewSubjectName("");
            setNewSubjectModal(false);
            setCurrentPage(1);
            fetchSubjectData();
        } catch (error) {
            console.error("Error adding subject:", error);
        }
    };

    const handleEditSubject = async () => {
        try {
            const token = Cookies.get("authToken");
            const response = await fetch(`http://localhost:8080/api/subjects/${selectedSubject.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: editSubjectName }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setEditSubjectModal(false);
            setSelectedSubject(null);
            setEditSubjectName("");
            fetchSubjectData();
        } catch (error) {
            console.error("Error editing subject:", error);
        }
    };

    const handleDeleteSubject = async () => {
        try {
            const token = Cookies.get("authToken");
            const response = await fetch(`http://localhost:8080/api/subjects/${selectedSubject.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setDeleteModal(false);
            setSelectedSubject(null);
            fetchSubjectData();
        } catch (error) {
            console.error("Error deleting subject:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if(searchQuery !== "") {
            const filteredData = subjectData.filter((subject) => subject.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredSubjectData(filteredData);
            setCurrentPage(1);
        }

        setCurrentPage(1);
    };

    const handleReset = () => {
        setSearchQuery("");
        setPageSize(10);
        setCurrentPage(1);
        setSortOrder("ASC");
        setShowFilters(false);
        fetchSubjectData();
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
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
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-gray-100 p-6">
            <div className="lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-extrabold text-emerald-800 flex items-center gap-3 mb-6">
                        <BookOpen className="w-8 h-8" />
                        Subject Management
                    </h2>

                    {/* Add Subject Button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setNewSubjectModal(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                        >
                            + Add Subject
                        </button>
                    </div>

                    {/* Search and Filter Component */}
                    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-end">
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
                    </div>

                    {/* Subject List */}
                    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-emerald-100">
                        <div className="p-8">
                            {filteredSubjectData.length > 0 ? (
                                <div className="space-y-6">
                                    {filteredSubjectData.map((subject) => (
                                        <div
                                            key={subject.id}
                                            className="relative bg-white border border-gray-100 rounded-xl p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                            <div className="relative z-10 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <BookOpen className="w-6 h-6 text-emerald-600" />
                                                    <div>
                                                        <h3 className="text-xl font-bold text-emerald-900">{subject.name}</h3>
                                                        <p className="text-gray-600 text-sm">Subject ID: {subject.id}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openDetailModal(subject)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                                                        title="View Details"
                                                    >
                                                        <Info className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(subject)}
                                                        className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all duration-200"
                                                        title="Edit Subject"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(subject)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                                                        title="Delete Subject"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-12 flex flex-col items-center gap-3">
                                    <BookOpen className="w-12 h-12 text-gray-400" />
                                    <p>No subjects found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination and Summary */}
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

                    {filteredSubjectData.length > 0 && (
                        <div className="mt-6 bg-emerald-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-emerald-800 font-medium">
                                    Total Data Mata Pelajaran: {totalElements}
                                </span>
                                <span className="text-emerald-600 text-sm">
                                    Halaman {currentPage} dari {totalPages}
                                    {searchQuery && (
                                        <span className="ml-2 text-emerald-700 font-medium">
                                            (Terfilter: {filteredSubjectData.length} hasil)
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Add Subject Modal */}
                    {newSubjectModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                            <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl transform transition-all duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-emerald-900">Add New Subject</h3>
                                    <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Subject Name"
                                    value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={closeAllModals}
                                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddSubject}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Subject Modal */}
                    {editSubjectModal && selectedSubject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                            <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl transform transition-all duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-emerald-900">Edit Subject</h3>
                                    <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Subject Name"
                                    value={editSubjectName}
                                    onChange={(e) => setEditSubjectName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={closeAllModals}
                                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditSubject}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Detail Modal */}
                    {detailModal && selectedSubject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                            <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-emerald-600" />
                                        Subject Details
                                    </h3>
                                    <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-emerald-50 rounded-lg p-4">
                                        <p className="text-gray-700 flex items-center gap-2 mb-2">
                                            <BookOpen className="w-5 h-5 text-emerald-500" />
                                            <span className="font-medium">Subject Name:</span>
                                        </p>
                                        <p className="text-emerald-900 font-bold text-xl ml-7">{selectedSubject.name}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 flex items-center gap-2 mb-2">
                                            <User className="w-5 h-5 text-gray-500" />
                                            <span className="font-medium">Subject ID:</span>
                                        </p>
                                        <p className="text-gray-800 font-semibold ml-7">{selectedSubject.id}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-gray-700 flex items-center gap-2 mb-2">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            <span className="font-medium">Created:</span>
                                        </p>
                                        <p className="text-blue-800 font-semibold ml-7">
                                            {selectedSubject.createdAt ? new Date(selectedSubject.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeAllModals}
                                    className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {deleteModal && selectedSubject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                            <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl transform transition-all duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-red-900">Delete Subject</h3>
                                    <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="mb-6">
                                    <p className="text-gray-700 mb-4">Are you sure you want to delete this subject?</p>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="font-semibold text-red-800">{selectedSubject.name}</p>
                                        <p className="text-red-600 text-sm">ID: {selectedSubject.id}</p>
                                    </div>
                                    <p className="text-red-600 text-sm mt-2">This action cannot be undone.</p>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={closeAllModals}
                                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteSubject}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectControllerEdit;