import React from "react";
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
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HeaderCust />

      {/* About Section */}
      <section className="relative text-black py-24 px-30 lg:px-30 rounded-br-[100px]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
          {/* Left Image */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="/src/images/Rectangle 1.png"
              alt="About Iwak"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2 mt-6 lg:mt-0 lg:pl-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-yellow-400 leading-tight">
              Tentang Kami
            </h1>
            <p className="mt-4 text-lg">
              Selamat datang di iwak., platform e-commerce terpercaya yang
              menyediakan bibit ikan air tawar berkualitas unggul untuk
              mendukung kesuksesan peternak dan pecinta budidaya ikan di seluruh
              Indonesia. Kami berkomitmen untuk menyediakan bibit ikan segar,
              sehat, dan cepat tumbuh yang dipilih langsung dari indukan
              terbaik. Dengan pengalaman dan dedikasi tinggi, kami memastikan
              bahwa setiap produk yang Anda terima telah melalui proses seleksi
              dan perawatan terbaik.
            </p>
            <p className="mt-4 text-lg">
              Di iwak., kami percaya bahwa kesuksesan Anda adalah prioritas
              kami. Dengan layanan pengiriman yang aman dan cepat, serta
              dukungan pelanggan yang siap membantu, kami hadir untuk menjadi
              mitra terpercaya dalam perjalanan budidaya Anda. Mari bersama-sama
              menciptakan hasil panen melimpah dan masa depan yang lebih cerah
              untuk perikanan Indonesia!
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
                236 5th SE Avenue, New York NY10000, United States
              </p>
            </div>

            {/* Telepon */}
            <div className="flex flex-col items-center">
              <PhoneIcon className="h-10 w-10 text-[#003D47]" />
              <h3 className="text-xl font-semibold mt-3">Telephone</h3>
              <p className="text-gray-600">Mobile: (+84) 546-6789</p>
              <p className="text-gray-600">Hotline: (+84) 456-6789</p>
            </div>

            {/* Jam Kerja */}
            <div className="flex flex-col items-center">
              <ClockIcon className="h-10 w-10 text-[#003D47]" />
              <h3 className="text-xl font-semibold mt-3">Jam Kerja</h3>
              <p className="text-gray-600">Monday-Friday: 9:00 - 22:00</p>
              <p className="text-gray-600">Saturday-Sunday: 9:00 - 21:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#FAF3EA] py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {/* High Quality */}
            <div className="flex flex-col items-center">
              <TrophyIcon className="h-10 w-10 text-[#003D47]" />
              <h3 className="text-lg font-semibold mt-3">High Quality</h3>
              <p className="text-gray-600 text-sm">
                Crafted from top materials
              </p>
            </div>

            {/* Warranty Protection */}
            <div className="flex flex-col items-center">
              <ShieldCheckIcon className="h-10 w-10 text-[#003D47]" />
              <h3 className="text-lg font-semibold mt-3">
                Warranty Protection
              </h3>
              <p className="text-gray-600 text-sm">Over 2 years</p>
            </div>

            {/* Free Shipping */}
            <div className="flex flex-col items-center">
              <TruckIcon className="h-10 w-10 text-[#003D47]" />
              <h3 className="text-lg font-semibold mt-3">Free Shipping</h3>
              <p className="text-gray-600 text-sm">Order over $150</p>
            </div>

            {/* 24/7 Support */}
            <div className="flex flex-col items-center">
              <TruckIcon className="h-10 w-10 text-[#003D47]" />
              <h3 className="text-lg font-semibold mt-3">24 / 7 Support</h3>
              <p className="text-gray-600 text-sm">Dedicated support</p>
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