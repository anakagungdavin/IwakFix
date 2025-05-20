import React, { useState, useEffect } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  TrophyIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";

const AboutPage = () => {
  const images = ["/images/uptd1.jpeg", "/images/uptd2.jpeg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // Bersihkan timer saat komponen unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <HeaderCust />
      </div>

      {/* About Section */}
      <section className="relative text-black py-24 px-30 lg:px-30 rounded-br-[100px]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
          {/* Left Image  */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src={images[currentImageIndex]}
              alt="About Iwak"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2 mt-6 lg:mt-0 lg:pl-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-yellow-400 leading-tight">
              Tentang Kami
            </h1>
            <p className="mt-4 text-lg text-justify">
              UPTD Aneka Usaha Perikanan merupakan Unit Pelaksana Teknis Daerah
              yang berada di lingkup Dinas Ketahanan Pangan dan Pertanian Kota
              Surakarta. UPTD Aneka Usaha Perikanan atau yang disingkat UPTD AUP
              berlokasi di Jalan Pleret Raya, Kelurahan Sumber, Kecamatan
              Banjarsari, Kota Surakarta. Salah satu tugas UPTD AUP adalah
              menyediakan pasokan benih ikan yang berkualitas untuk keperluan
              budidaya masyarakat terutama di Kota Surakarta dan sekitarnya.
              Untuk saat ini jenis ikan yang dibudidayakan di UPTD AUP adalah
              ikan lele dan ikan nila. Jenis ikan lele yang kami budidayakan
              yaitu jenis lele mutiara dan lele sangkuriang. Untuk ikan nila
              yang kami budidayakan yaitu jenis ikan nila merah larasati.
              Kedepan kami akan terus menambah jenis ikan yang dibudidayakan
              untuk memenuhi permintaan pasar dan tetap menjamin kualitas benih
              kami
            </p>
          </div>
        </div>
      </section>

      {/* Hubungi Kami Section */}
      <section className="py-5">
        <div className="max-w-6xl mx-auto lg:px-30">
          <h2 className="text-4xl font-bold text-center text-[#003D47]">
            Hubungi Kami
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Silakan hubungi kami untuk informasi lebih lanjut mengenai produk
            kami.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10 text-center">
            {/* Alamat */}
            <div className="flex flex-col items-center">
              <MapPinIcon className="h-10 w-10 text-[#003D47]" />
              <h3 className="text-xl font-semibold mt-3">Alamat</h3>
              <p className="text-gray-600">
                Jalan Pleret Raya, Kelurahan Sumber, Kecamatan Banjarsari, Kota
                Surakarta
              </p>
            </div>

            {/* Telepon */}
            <div className="flex flex-col items-center">
              <PhoneIcon className="h-10 w-10 text-[#003D47]" />
              <h3 className="text-xl font-semibold mt-3">Telepon</h3>
              <p className="text-gray-600">Mobile: 085713561686</p>
            </div>

            {/* Jam Kerja */}
            <div className="flex flex-col items-center">
              <ClockIcon className="h-10 w-10 text-[#003D47]" />
              <h3 className="text-xl font-semibold mt-3">Waktu Pelayanan</h3>
              <p className="text-gray-600">Senin-Kamis: 8:00 - 15:00</p>
              <p className="text-gray-600">Jumat: 8:00 - 13:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterCust />
    </div>
  );
};

export default AboutPage;
