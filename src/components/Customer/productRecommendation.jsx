import React from "react";
import { useNavigate } from "react-router-dom";

const recommendations = [
  { id: 1, name: "Gurame", price: 10000, image: "https://t4.ftcdn.net/jpg/02/53/61/69/360_F_253616948_za22DUrpvoM6aBDyPZxXDXf1OVNZFhL4.jpg" },
  { id: 2, name: "Mas", price: 25000, image: "https://t4.ftcdn.net/jpg/02/53/61/69/360_F_253616948_za22DUrpvoM6aBDyPZxXDXf1OVNZFhL4.jpg" },
  { id: 3, name: "Gabus", price: 30000, image: "https://t4.ftcdn.net/jpg/02/53/61/69/360_F_253616948_za22DUrpvoM6aBDyPZxXDXf1OVNZFhL4.jpg" }
];

const ProductRecommendations = () => {
  const navigate = useNavigate();

  const handleShowMore = () => {
    navigate("/shop");
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto">
      <h3 className="text-blue-600 text-m text-center mb-1">Temukan bibit ikanmu.</h3>
      <h3 className="text-lg font-bold text-center mb-4">Bibit Ikan Terfavorit</h3>
      <div className="flex justify-center gap-8">
        {recommendations.map(item => (
          <div key={item.id} className="border p-4 rounded-lg w-1/4 cursor-pointer shadow-lg hover:shadow-xl" onClick={() => navigate(`/product/${item.id}`) }>
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-full h-auto rounded-lg" />
              <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">🛒</div>
            </div>
            <h4 className="font-bold mt-2 text-center">{item.name}</h4>
            <div className="text-center">
              <span className="text-green-600 font-bold ml-2">Rp{item.price}/kg</span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button 
          className="border px-6 py-2 rounded-lg hover:bg-gray-200 transition"
          onClick={handleShowMore}
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default ProductRecommendations;
