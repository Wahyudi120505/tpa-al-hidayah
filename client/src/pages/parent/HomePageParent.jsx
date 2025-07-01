import { BookOpen, Users, School } from 'lucide-react';
import React from 'react';

const HomepageParent = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
            {/* Hero Section */}
            <section className="py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
                        Selamat Datang di <br /> TPA Al-Hidayah
                    </h1>
                    <p className="text-lg mb-6 text-gray-700 max-w-md">
                        Tempat terbaik untuk membentuk karakter Islami sejak dini. Kami membimbing anak-anak dengan kasih sayang, ilmu, dan akhlak mulia.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105">
                        Lihat Program Hafalan
                    </button>
                </div>

                <div className="flex-1">
                    <img
                        src="https://www.min8kotabandaaceh.sch.id/wp-content/uploads/2021/03/dummy-1.png"
                        alt="Kids studying"
                        className="rounded-xl shadow-lg w-full max-w-lg"
                    />
                </div>
            </section>

            {/* Info Section */}
            <section className="px-6 md:px-20 py-12 bg-white">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-10">Mengapa Memilih TPA Al-Hidayah?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-all">
                        <School className="text-blue-600 w-10 h-10 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Lingkungan Islami</h3>
                        <p className="text-sm text-gray-600">
                            Suasana belajar yang mendidik dengan nilai-nilai Islam sejak dini.
                        </p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-all">
                        <BookOpen className="text-blue-600 w-10 h-10 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Metode Hafalan</h3>
                        <p className="text-sm text-gray-600">
                            Menggunakan metode hafalan Al-Qur'an yang menyenangkan dan efektif.
                        </p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-all">
                        <Users className="text-blue-600 w-10 h-10 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Guru Berpengalaman</h3>
                        <p className="text-sm text-gray-600">
                            Diajarkan oleh guru yang sabar, ramah, dan profesional di bidang anak-anak.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomepageParent;
