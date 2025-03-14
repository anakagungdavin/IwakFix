// import React from "react";
// import { useNavigate } from "react-router-dom";

// const recommendations = [
//   { id: 1, name: "Gurame", price: 10000, image: "https://t4.ftcdn.net/jpg/02/53/61/69/360_F_253616948_za22DUrpvoM6aBDyPZxXDXf1OVNZFhL4.jpg" },
//   { id: 2, name: "Mas", price: 25000, image: "https://t4.ftcdn.net/jpg/02/53/61/69/360_F_253616948_za22DUrpvoM6aBDyPZxXDXf1OVNZFhL4.jpg" },
//   { id: 3, name: "Gabus", price: 30000, image: "https://t4.ftcdn.net/jpg/02/53/61/69/360_F_253616948_za22DUrpvoM6aBDyPZxXDXf1OVNZFhL4.jpg" }
// ];

// const ProductRecommendations = () => {
//   const navigate = useNavigate();

//   const handleShowMore = () => {
//     navigate("/shop");
//     window.scrollTo(0, 0);
//   };

//   return (
//     <div className="container mx-auto">
//       <h3 className="text-blue-600 text-m text-center mb-1">Temukan bibit ikanmu.</h3>
//       <h3 className="text-lg font-bold text-center mb-4">Bibit Ikan Terfavorit</h3>
//       <div className="flex justify-center gap-8">
//         {recommendations.map(item => (
//           <div key={item.id} className="border p-4 rounded-lg w-1/4 cursor-pointer shadow-lg hover:shadow-xl" onClick={() => navigate(`/product/${item.id}`) }>
//             <div className="relative">
//               <img src={item.image} alt={item.name} className="w-full h-auto rounded-lg" />
//               <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">🛒</div>
//             </div>
//             <h4 className="font-bold mt-2 text-center">{item.name}</h4>
//             <div className="text-center">
//               <span className="text-green-600 font-bold ml-2">Rp{item.price}/kg</span>
//             </div>
//           </div>
//         ))}
//       </div>
      // <div className="text-center mt-4">
      //   <button 
      //     className="border px-6 py-2 rounded-lg hover:bg-gray-200 transition"
      //     onClick={handleShowMore}
      //   >
      //     Show More
      //   </button>
      // </div>
//     </div>
//   );
// };

// export default ProductRecommendations;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";

const recommendations = [
  { id: 1, name: "Gurame", price: 10000, originalPrice: 15000, image: "https://upload.wikimedia.org/wikipedia/commons/3/38/Osteochilus_hasseltii.jpg" },
  { id: 2, name: "Mas", price: 25000, originalPrice: 30000, image: "https://upload.wikimedia.org/wikipedia/commons/5/52/Common_carp.jpg" },
  { id: 3, name: "Gabus", price: 30000, originalPrice: 35000, image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Channa_striata_Thailand.JPG" }
];

const ProductRecommendations = () => {
  const navigate = useNavigate();
  const handleShowMore = () => {
    navigate("/shop");
    window.scrollTo(0,0);
  }
  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
    window.scrollTo(0,0);
  }
  const calculateDiscount = (originalPrice, price) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  return (
    <div className="container mx-auto px-4">
      <h3 className="text-blue-600 text-sm text-center mb-1">Temukan bibit ikanmu.</h3>
      <h3 className="text-lg font-bold text-center mb-4">Bibit Ikan Terfavorit</h3>
      <div className="flex justify-center gap-6">
        {recommendations.map((item) => (
          <div 
            key={item.id} 
            className="relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl w-64 cursor-pointer"
            onClick={() => handleNavigate(item.id)}
          >
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-full h-40 object-contain" />
              {/* <div className="absolute top-2 right-2 bg-blue-600 p-2 rounded-full shadow-md text-white">
                <ShoppingCart size={20} />
              </div> */}
            </div>
            <h4 className="font-bold mt-2 text-center text-lg">{item.name}</h4>
            {/* <div className="flex justify-center my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-500" />
              ))}
            </div> */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-2">
                <p className="text-gray-500 line-through text-sm mr-2">Rp{item.originalPrice.toLocaleString()}</p>
                <span className="text-red-500 text-sm">-{calculateDiscount(item.originalPrice, item.price)}%</span>
              </div>
              <p className="text-black font-bold text-lg">Rp{item.price.toLocaleString()}/kg</p>
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

