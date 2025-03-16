import React from "react";

const reviews = [
  {
    id: 1,
    name: "Penjual ikan tongkol",
    review:
      "Don't waste time, just order! This is the best website to purchase fish.",
    image: "/images/review1.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Bagus Fajar",
    review:
      "Saya telah membeli bibit ikan lele. Semua ikan sangat sehat dan kualitasnya sangat baik.",
    image: "/images/review2.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Shafa Tiara",
    review:
      "Saya telah membeli bibit ikan lele. Semua ikan sangat sehat dan kualitasnya sangat baik.",
    image: "/images/review2.jpg",
    rating: 5,
  },
];

const CustomerReviews = () => {
  return (
    <section className="bg-white py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h3 className="text-blue-600 text-center mb-2">
          Berikut ulasan dari customer terbaik kami!
        </h3>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
          Ulasan
        </h2>

        {/* Reviews Container */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md w-full sm:w-80 flex flex-col items-center mb-4 md:mb-0"
            >
              <img
                src={review.image}
                alt={review.name}
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full mb-4"
              />
              <h4 className="font-bold text-center">{review.name}</h4>
              <p className="text-gray-600 text-center mt-2">{review.review}</p>
              <div className="flex mt-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} role="img" aria-label="star">
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;