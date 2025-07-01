import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const HafalanStudent = () => {
    const [dataHafalan, setDataHafalan] = useState([]);
    const [filteredHafalan, setFilteredHafalan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [parentId, setParentId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const parentId = user.parentId;
        setParentId(parentId);
        fetchDataHafalan();
    }, []);

    useEffect(() => {
        if (dataHafalan.length > 0 && parentId) {
            const filtered = dataHafalan.filter(
                (hafalan) => hafalan.responseStudent.responeParent.id === parseInt(parentId)
            );
            setFilteredHafalan(filtered);
        }
    }, [dataHafalan, parentId]);

    const fetchDataHafalan = async () => {
        try {
            const token = Cookies.get("authToken");

            const resMeta = await fetch(
                "http://localhost:8080/api/student-memorization-status?page=1&size=1&sortOrder=ASC",
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
                `http://localhost:8080/api/student-memorization-status?page=1&size=${total}&sortOrder=ASC`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            setDataHafalan(data.content || []);
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
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Hafalan Siswa</h1>
                        <p className="text-gray-600">
                            Menampilkan data hafalan untuk {
                                new Set(filteredHafalan.map(item => item.responseStudent.id)).size
                            } siswa
                        </p>
                </div>

                {filteredHafalan.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                            <div key={hafalan.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
                                        <p className="text-gray-600 text-sm mb-1">
                                            Kelas: {hafalan.responseStudent.classLevel} | Jenis Kelamin:{" "}
                                            {hafalan.responseStudent.gender === "L" ? "Laki-laki" : "Perempuan"}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Tanggal Lahir: {formatDate(hafalan.responseStudent.birthDate)}
                                        </p>
                                    </div>
                                    <div className="mt-4 lg:mt-0 lg:text-right">
                                        <p className="text-sm text-gray-500">Terakhir diperbarui:</p>
                                        <p className="text-sm font-medium text-gray-700">{formatDate(hafalan.updatedAt)}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="mb-3 sm:mb-0">
                                            <h4 className="font-medium text-gray-800 mb-1">Surah yang Dihafal:</h4>
                                            <p className="text-lg font-semibold text-blue-600">
                                                {hafalan.responseSurah.number}. {hafalan.responseSurah.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">Orang Tua:</p>
                                            <p className="font-medium text-gray-700">
                                                {hafalan.responseStudent.responeParent.name}
                                            </p>
                                            <p className="text-sm text-gray-500">{hafalan.responseStudent.responeParent.email}</p>
                                            <p className="text-sm text-gray-500">{hafalan.responseStudent.responeParent.noHp}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
