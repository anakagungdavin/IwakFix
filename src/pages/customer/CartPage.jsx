// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiTrash2 } from "react-icons/fi";
// import HeaderCust from "../../components/Customer/headerCust";
// import FooterCust from "../../components/Customer/footerCust";

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartItems(storedCart);
//   }, []);

//   useEffect(() => {
//     if (cartItems.length > 0) {
//       localStorage.setItem("cart", JSON.stringify(cartItems));
//     }
//   }, [cartItems]);

//   const handleDelete = (index) => {
//     const updatedCart = cartItems.filter((_, i) => i !== index);
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const handleQuantityChange = (index, change) => {
//     const updatedCart = cartItems.map((item, i) =>
//       i === index 
//         ? { ...item, quantity: Math.max(1, item.quantity + change) } 
//         : item
//     );
//     setCartItems(updatedCart);
//   };

//   const handleSizeChange = (index, newSize) => {
//     const updatedCart = cartItems.map((item, i) =>
//       i === index ? { ...item, size: newSize } : item
//     );
//     setCartItems(updatedCart);
//   };

//   const handleColorChange = (index, newColor) => {
//     const updatedCart = cartItems.map((item, i) =>
//       i === index ? { ...item, color: newColor } : item
//     );
//     setCartItems(updatedCart);
//   };

//   const handleCheckout = () => {
//     if (cartItems.length === 0) return;
//     navigate("/checkout", { state: { cart: cartItems } });
//   };

//   const totalPrice = cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
//   const discount = 7000;
//   const finalTotal = totalPrice - discount;

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <HeaderCust />
//       <div className="max-w-6xl mx-auto px-6 py-10">
//         <h2 className="text-4xl font-bold text-yellow-500 mb-6">Keranjang</h2>

//         <div className="flex flex-col lg:flex-row gap-6">
//           <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
//             {cartItems.length > 0 ? (
//               <div className="flex flex-col lg:flex-row gap-6">
//                 <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
//                   {cartItems.map((item, index) => (
//                     <div key={index} className="flex items-center border-b py-4 last:border-b-0">
//                       <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
//                       <div className="flex-grow">
//                         <h4 className="text-lg font-semibold">{item.name}</h4>
//                         <p className="text-gray-500">{item.description || "Deskripsi produk"}</p>
//                         <p className="text-lg font-bold text-gray-900 mt-1">Rp{(item.price || 0).toLocaleString()}</p>

                        // <div className="flex items-center mt-2 space-x-4">
                        //   <select
                        //     value={item.size}
                        //     onChange={(e) => handleSizeChange(index, e.target.value)}
                        //     className="border rounded-md px-3 py-1"
                        //   >
                        //     <option value="S">S</option>
                        //     <option value="M">M</option>
                        //     <option value="L">L</option>
                        //     <option value="XL">XL</option>
                        //   </select>

                        //   <select
                        //     value={item.color}
                        //     onChange={(e) => handleColorChange(index, e.target.value)}
                        //     className="border rounded-md px-3 py-1"
                        //   >
                        //     <option value="Red">Red</option>
                        //     <option value="Blue">Blue</option>
                        //     <option value="Green">Green</option>
                        //     <option value="Black">Black</option>
                        //   </select>

                        //   <div className="flex items-center border rounded-md">
                        //     <button className="px-3 py-1 text-lg" onClick={() => handleQuantityChange(index, -1)}>-</button>
                        //     <span className="px-4 text-lg">{item.quantity}</span>
                        //     <button className="px-3 py-1 text-lg" onClick={() => handleQuantityChange(index, 1)}>+</button>
                        //   </div>
                        // </div>
//                       </div>
//                       <div className="flex flex-col items-end space-y-2">
//                         <button className="flex items-center text-red-500 hover:text-red-700" onClick={() => handleDelete(index)}>
//                           <FiTrash2 className="mr-1" /> Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
//                   <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan</h3>
//                   <div className="flex justify-between text-gray-600 mb-2">
//                     <span>Items ({cartItems.length})</span>
//                     <span>Rp{totalPrice.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600 mb-4">
//                     <span>Discounts</span>
//                     <span className="text-red-500">-Rp{discount.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
//                     <span>Total</span>
//                     <span>Rp{finalTotal.toLocaleString()}</span>
//                   </div>

//                   <button
//                     className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
//                     onClick={handleCheckout}
//                     disabled={cartItems.length === 0}
//                   >
//                     Proses Pembayaran ({cartItems.length})
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center text-center mt-20">
//                 <img src="src/images/20943865.jpg" alt="Keranjang Kosong" className="w-64 h-64 object-cover" />
//                 <p className="text-lg font-bold mt-4">Keranjang kamu kosong!</p>
//                 <p className="text-gray-600 mt-2">Daripada dianggurin, isi saja dengan ikan - ikan menarik.<br />Lihat-lihat dulu, siapa tahu ada yang kamu butuhkan!</p>
//                 <button
//                   className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
//                   onClick={() => navigate("/shop")}
//                 >
//                   Mulai Belanja
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <FooterCust />
//     </div>
//   );
// };

// export default CartPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleDelete = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (index, change) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index 
        ? { ...item, quantity: Math.max(1, item.quantity + change) } 
        : item
    );
    setCartItems(updatedCart);
  };

  const handleSizeChange = (index, newSize) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index ? { ...item, size: newSize } : item
    );
    setCartItems(updatedCart);
  };

  const handleColorChange = (index, newColor) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index ? { ...item, color: newColor } : item
    );
    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout", { state: { cart: cartItems } });
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  const discount = 2000;
  const finalTotal = totalPrice - discount;

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeaderCust />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-yellow-500 mb-6">Keranjang</h2>
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center border-b py-4 last:border-b-0 relative">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-gray-500">{item.description || "Deskripsi produk"}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">Rp{(item.price || 0).toLocaleString()}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <select
                        value={item.size}
                        onChange={(e) => handleSizeChange(index, e.target.value)}
                        className="border rounded-md px-3 py-1"
                      >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                      <select
                        value={item.color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="border rounded-md px-3 py-1"
                      >
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                        <option value="Black">Black</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center border rounded-md">
                      <button className="px-3 py-1 text-lg" onClick={() => handleQuantityChange(index, -1)}>-</button>
                      <span className="px-5 text-lg">{item.quantity}</span>
                      <button className="px-3 py-1 text-lg" onClick={() => handleQuantityChange(index, 1)}>+</button>
                    </div>
                    <button className="text-red-500 hover:text-red-700 flex items-center" onClick={() => handleDelete(index)}>
                      <FiTrash2 className="mr-1" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan</h3>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Items ({cartItems.length})</span>
                <span>Rp{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-4">
                <span>Discounts</span>
                <span className="text-red-500">-Rp{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                <span>Total</span>
                <span>Rp{finalTotal.toLocaleString()}</span>
              </div>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proses Pembayaran ({cartItems.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col bg-white rounded-md items-center text-center mt-20 p-12">
            <img src="src/images/20943865.jpg" alt="Keranjang Kosong" className="w-64 h-64 object-cover" />
            <p className="text-lg font-bold mt-4">Keranjang kamu kosong!</p>
            <p className="text-gray-600 mt-2">Daripada dianggurin, isi saja dengan ikan - ikan menarik.<br />Lihat-lihat dulu, siapa tahu ada yang kamu butuhkan!</p>
            <button
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              onClick={() => navigate("/shop")}
            >
              Mulai Belanja
            </button>
          </div>
        )}
      </div>
      <FooterCust />
    </div>
  );
};

export default CartPage;
