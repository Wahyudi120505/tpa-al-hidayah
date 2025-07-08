/* eslint-disable no-unused-vars */
import { BookOpen, Users, School, ArrowRightCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HomepageParent = () => {
  const navigate = useNavigate();

  // Animation variants for hero section
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Animation variants for info cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800">
      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
        <motion.div
          className="flex-1 space-y-6"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-blue-800">
            Selamat Datang di <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              TPA Al-Hidayah
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
            Tempat terbaik untuk membentuk karakter Islami sejak dini. Kami
            membimbing anak-anak dengan kasih sayang, ilmu, dan akhlak mulia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("hafalan")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              <BookOpen size={20} /> Lihat Program Hafalan
            </button>
            <button
              onClick={() => navigate("absensi")}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              <ArrowRightCircle size={20} /> Cek Absensi
            </button>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative rounded-xl shadow-2xl overflow-hidden group">
            <img
              src="https://www.min8kotabandaaceh.sch.id/wp-content/uploads/2021/03/dummy-1.png"
              alt="Kids studying"
              className="w-full max-w-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent"></div>
          </div>
        </motion.div>
      </section>

      {/* Info Section */}
      <section className="px-6 md:px-12 lg:px-20 py-16 bg-white/90 backdrop-blur-sm">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Mengapa Memilih TPA Al-Hidayah?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              icon: <School className="text-blue-600 w-12 h-12 mb-4" />,
              title: "Lingkungan Islami",
              description:
                "Suasana belajar yang mendidik dengan nilai-nilai Islam sejak dini.",
            },
            {
              icon: <BookOpen className="text-blue-600 w-12 h-12 mb-4" />,
              title: "Metode Hafalan",
              description:
                "Menggunakan metode hafalan Al-Qur'an yang menyenangkan dan efektif.",
            },
            {
              icon: <Users className="text-blue-600 w-12 h-12 mb-4" />,
              title: "Guru Berpengalaman",
              description:
                "Diajarkan oleh guru yang sabar, ramah, dan profesional di bidang anak-anak.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 hover:scale-105"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomepageParent;