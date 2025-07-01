const FooterParent = () => {
    return (
      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1: Brand Info */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">TPA Al-Hidayah</h2>
            <p className="text-sm">
              Tempat pendidikan anak usia dini berbasis nilai-nilai Islam. 
              Menumbuhkan karakter, akhlak, dan hafalan Al-Qur'an sejak dini.
            </p>
          </div>
  
          {/* Section 2: Navigasi */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/parent" className="hover:text-white transition">Home</a></li>
              <li><a href="/hafalan" className="hover:text-white transition">Program Hafalan</a></li>
              <li><a href="/tentang" className="hover:text-white transition">Tentang Kami</a></li>
              <li><a href="/kontak" className="hover:text-white transition">Kontak</a></li>
            </ul>
          </div>
  
          {/* Section 3: Kontak */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Hubungi Kami</h3>
            <p className="text-sm">Jl. Contoh No.123, Kota Edukasi</p>
            <p className="text-sm mt-1">Email: info@tpa-alhidayah.sch.id</p>
            <p className="text-sm">Telp: 0812-3456-7890</p>
          </div>
        </div>
  
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TPA Al-Hidayah. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default FooterParent;
  