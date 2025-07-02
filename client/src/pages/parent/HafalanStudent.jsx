import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { User, Calendar, Users, BookOpen, X } from "lucide-react";

const HafalanStudent = () => {
    const [dataHafalan, setDataHafalan] = useState([]);
    const [filteredHafalan, setFilteredHafalan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [parentId, setParentId] = useState("");
    const [error, setError] = useState("");
    const [selectedHafalan, setSelectedHafalan] = useState(null); // State for selected hafalan
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    console.log(JSON.parse(localStorage.getItem("user")));
    console.log(dataHafalan);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const parent = user?.responseStudent?.[0].responeParent;
    
        if (parent?.id) {
            setParentId(parent.id);
        } else {
            setError("Data siswa tidak ditemukan.");
            setLoading(false);
        }
    
        fetchDataHafalan();
    }, []);
    

    useEffect(() => {
        if (dataHafalan.length > 0 && parentId) {
            const filtered = dataHafalan.filter(
                (hafalan) =>
                    hafalan?.responseStudent?.responeParent?.id === parseInt(parentId)
            );
            setFilteredHafalan(filtered);
        }
    }, [dataHafalan, parentId]);
    

        const fetchDataHafalan = async () => {
            try {
              const token = Cookies.get("authToken");
          
              const response = await fetch(
                "http://localhost:8080/api/student-memorization-status?page=1&size=1000&sortOrder=ASC",
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
          
              const contentType = response.headers.get("content-type");
          
              if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
              }
          
              if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                setDataHafalan(data.content || []);
              } else {
                // Response kosong / tidak JSON
                setDataHafalan([]);
              }
            } catch (err) {
              console.error("Error fetching data:", err);
              setError("Gagal mengambil data hafalan. Silakan coba lagi.");
            } finally {
              setLoading(false);
            }
          };
          

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "SUDAH_HAFAL":
                return "bg-green-100 text-green-800";
            case "BELUM_HAFAL":
                return "bg-red-100 text-red-800";
            case "MENGULANG":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatStatus = (status) => {
        switch (status) {
            case "SUDAH_HAFAL":
                return "Sudah Hafal";
            case "BELUM_HAFAL":
                return "Belum Hafal";
            case "MENGULANG":
                return "Mengulang";
            default:
                return status;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Function to handle card click and open modal
    const handleCardClick = (hafalan) => {
        setSelectedHafalan(hafalan);
        setIsModalOpen(true);
    };

    // Function to close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedHafalan(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            </div>
        );
    }    

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        Data Hafalan Siswa
                    </h1>
                    <p className="text-gray-600">
                        Menampilkan data hafalan untuk{" "}
                        {new Set(filteredHafalan.map((item) => item.responseStudent.id)).size} siswa
                    </p>
                </div>

                {filteredHafalan.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="mx-auto h-16 w-16"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data hafalan</h3>
                        <p className="text-gray-500">Belum ada data hafalan untuk ditampilkan.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredHafalan.map((hafalan) => (
                            <div
                                key={hafalan.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handleCardClick(hafalan)} // Add click handler
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-xl font-semibold text-gray-800 mr-3">
                                                {hafalan.responseStudent.name}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                                                    hafalan.status
                                                )}`}
                                            >
                                                {formatStatus(hafalan.status)}
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-blue-600">
                                            {hafalan.responseSurah.number}. {hafalan.responseSurah.name}
                                        </p>
                                    </div>
                                    <div className="mt-4 lg:mt-0 lg:text-right">
                                        <p className="text-sm text-gray-500">Terakhir diperbarui:</p>
                                        <p className="text-sm font-medium text-gray-700">
                                            {formatDate(hafalan.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal for displaying hafalan details */}
                {isModalOpen && selectedHafalan && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                        <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 relative transform transition-all duration-300 scale-100">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                                Detail Hafalan
                            </h2>
                            <div className="space-y-4">
                                <p className="text-gray-700 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Nama Siswa:</span>{" "}
                                    {selectedHafalan.responseStudent.name}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Kelas:</span>{" "}
                                    {selectedHafalan.responseStudent.classLevel}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Jenis Kelamin:</span>{" "}
                                    {selectedHafalan.responseStudent.gender === "L" ? "Laki-laki" : "Perempuan"}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Tanggal Lahir:</span>{" "}
                                    {formatDate(selectedHafalan.responseStudent.birthDate)}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Surah:</span>{" "}
                                    {selectedHafalan.responseSurah.number}. {selectedHafalan.responseSurah.name}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                                            selectedHafalan.status
                                        )}`}
                                    >
                                        {formatStatus(selectedHafalan.status)}
                                    </span>
                                </p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Orang Tua:</span>{" "}
                                    {selectedHafalan.responseStudent.responeParent.name}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <span className="font-medium">Email Orang Tua:</span>{" "}
                                    {selectedHafalan.responseStudent.responeParent.email}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <span className="font-medium">No. HP Orang Tua:</span>{" "}
                                    {selectedHafalan.responseStudent.responeParent.noHp}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Terakhir Diperbarui:</span>{" "}
                                    {formatDate(selectedHafalan.updatedAt)}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Status Hafalan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="text-2xl font-bold text-green-600">
                                {filteredHafalan.filter((h) => h.status === "SUDAH_HAFAL").length}
                            </div>
                            <div className="text-sm text-green-700">Sudah Hafal</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-600">
                                {filteredHafalan.filter((h) => h.status === "MENGULANG").length}
                            </div>
                            <div className="text-sm text-yellow-700">Mengulang</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <div className="text-2xl font-bold text-red-600">
                                {filteredHafalan.filter((h) => h.status === "BELUM_HAFAL").length}
                            </div>
                            <div className="text-sm text-red-700">Belum Hafal</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HafalanStudent;