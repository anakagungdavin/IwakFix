// src/components/Customer/WebsiteStatsSection.jsx
import React, { useState, useEffect } from "react";
import StatCard from "/src/components/cards/StatCard"; // Pastikan path ini benar
// Anda bisa mengimpor ikon spesifik untuk setiap kartu jika mau
import {
  FaRegCalendarCheck, // Hari Ini
  FaRegCalendarAlt, // Kemarin
  FaCalendarWeek, // Minggu Ini
  FaCalendarDay, // Bulan Ini (bisa juga FaRegCalendar)
  FaRegStar, // Tahun Ini (atau ikon lain yang relevan)
  FaUsers, // Jumlah
} from "react-icons/fa";

const WebsiteStatsSection = () => {
  const [stats, setStats] = useState({
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatsData = async () => {
      setLoading(true);
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
        const response = await fetch(`${apiUrl}/api/stats/visitors`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.success && result.data) {
          setStats(result.data);
        } else {
          throw new Error(result.message || "Gagal mengambil data statistik");
        }
      } catch (error) {
        console.error("Error fetching website stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  // handleCardDetailClick tidak lagi relevan karena kartu tidak bisa diklik
  // const handleCardDetailClick = (cardTitle) => { ... };

  if (loading) {
    return (
      <div className="py-12 px-4 text-center text-gray-500">
        {" "}
        {/* Sedikit padding lebih */}
        Memuat statistik pengunjung...
      </div>
    );
  }

  // Palet warna yang senada dan modern
  // Anda bisa membuat ini lebih dinamis atau menyimpannya di konfigurasi tema
  const cardThemes = [
    {
      title: "Hari Ini",
      valueKey: "today",
      bgColor: "bg-rose-700 hover:bg-rose-600",
      icon: <FaRegCalendarCheck />,
    },
    {
      title: "Kemarin",
      valueKey: "yesterday",
      bgColor: "bg-violet-700 hover:bg-violet-600",
      icon: <FaRegCalendarAlt />,
    },
    {
      title: "Minggu Ini",
      valueKey: "thisWeek",
      bgColor: "bg-emerald-600 hover:bg-emerald-500",
      icon: <FaCalendarWeek />,
    },
    {
      title: "Bulan Ini",
      valueKey: "thisMonth",
      bgColor: "bg-amber-500 hover:bg-amber-400",
      textColor: "text-slate-800",
      icon: <FaCalendarDay />,
    }, // Kuning butuh teks gelap
    {
      title: "Tahun Ini",
      valueKey: "thisYear",
      bgColor: "bg-sky-700 hover:bg-sky-600",
      icon: <FaRegStar />,
    },
    {
      title: "Jumlah",
      valueKey: "total",
      bgColor: "bg-[#003D47] hover:bg-[#002c33]",
      icon: <FaUsers />,
    }, // Menggunakan warna utama tema
  ];

  return (
    <div className="py-10 md:py-16 px-4">
      {" "}
      {/* Padding lebih untuk seksi */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12 text-center">
          {" "}
          {/* Judul di tengah */}
          <h2 className="text-2xl font-bold text-center mb-6">
            Statistik Pengunjung Website
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {cardThemes.map((theme) => (
            <StatCard
              key={theme.title}
              title={theme.title}
              value={stats[theme.valueKey]}
              bgColor={theme.bgColor}
              textColor={theme.textColor} // Akan undefined jika tidak diset, jadi default StatCard berlaku
              icon={theme.icon}
              // onDetailClick tidak lagi diteruskan
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteStatsSection;
