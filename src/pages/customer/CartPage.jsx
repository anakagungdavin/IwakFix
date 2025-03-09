// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import HeaderCust from "../../components/Customer/headerCust";
// import FooterCust from "../../components/Customer/footerCust";

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);

//   // Load cart from local storage when component mounts
//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartItems(storedCart);
//   }, []);

//   // Update local storage whenever cart changes
//   useEffect(() => {
//     if (cartItems.length > 0) {
//       localStorage.setItem("cart", JSON.stringify(cartItems));
//     }
//   }, [cartItems]);

//   // Function to remove item from cart
//   const handleDelete = (index) => {
//     const updatedCart = cartItems.filter((_, i) => i !== index);
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   // Function to update quantity
//   const handleQuantityChange = (index, change) => {
//     const updatedCart = cartItems.map((item, i) =>
//       i === index
//         ? { ...item, quantity: Math.max(1, item.quantity + change) }
//         : item
//     );
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   // Function to update size
//   const handleSizeChange = (index, newSize) => {
//     const updatedCart = cartItems.map((item, i) =>
//       i === index ? { ...item, size: newSize } : item
//     );
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   // Function to handle checkout
//   const handleCheckout = () => {
//     if (cartItems.length === 0) return;
//     navigate("/checkout", { state: { cart: cartItems } });
//   };

//   return (
//     <div>
//       <HeaderCust />
//       <div className="max-w-6xl mx-auto px-6 py-10">
//         <h2 className="text-3xl font-bold text-yellow-500 mb-6">Keranjang</h2>

//         {/* Cart Items */}
//         <div className="bg-white p-4 rounded-lg shadow-lg">
//           {cartItems.length > 0 ? (
//             cartItems.map((item, index) => (
//               <div key={index} className="flex items-center border-b pb-4 mb-4">
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-20 h-20 mr-4"
//                 />
//                 <div className="flex-grow">
//                   <h4 className="font-bold">{item.name}</h4>
//                   <p className="font-semibold">
//                     Rp{(item.price || 0).toLocaleString()}
//                   </p>

//                   {/* Size Selection */}
//                   <div className="mt-2">
//                     <label className="font-semibold mr-2">Ukuran:</label>
//                     <select
//                       value={item.size}
//                       onChange={(e) => handleSizeChange(index, e.target.value)}
//                       className="border p-1 rounded"
//                     >
//                       <option value="S">S</option>
//                       <option value="M">M</option>
//                       <option value="L">L</option>
//                       <option value="XL">XL</option>
//                     </select>
//                   </div>

//                   {/* Quantity Controls */}
//                   <div className="flex items-center mt-2">
//                     <button
//                       className="px-2 py-1 border rounded bg-gray-200"
//                       onClick={() => handleQuantityChange(index, -1)}
//                     >
//                       -
//                     </button>
//                     <span className="px-4">{item.quantity}</span>
//                     <button
//                       className="px-2 py-1 border rounded bg-gray-200"
//                       onClick={() => handleQuantityChange(index, 1)}
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//                 <button
//                   className="text-red-500 ml-4"
//                   onClick={() => handleDelete(index)}
//                 >
//                   ❌
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center">Keranjang kosong.</p>
//           )}
//         </div>

//         {/* Payment Summary */}
//         <div className="bg-gray-100 p-4 rounded-lg mt-6">
//           <h3 className="font-bold mb-2">Ringkasan</h3>
//           <p>
//             Total: Rp
//             {cartItems
//               .reduce(
//                 (total, item) =>
//                   total + (item.price || 0) * (item.quantity || 1),
//                 0
//               )
//               .toLocaleString()}
//           </p>
//           <button
//             className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
//             onClick={handleCheckout}
//             disabled={cartItems.length === 0}
//           >
//             Proses Pembayaran ({cartItems.length})
//           </button>
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

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={index} className="flex items-center border-b py-4 last:border-b-0">
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

                      <div className="flex items-center border rounded-md">
                        <button className="px-3 py-1 text-lg" onClick={() => handleQuantityChange(index, -1)}>-</button>
                        <span className="px-4 text-lg">{item.quantity}</span>
                        <button className="px-3 py-1 text-lg" onClick={() => handleQuantityChange(index, 1)}>+</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <button className="flex items-center text-red-500 hover:text-red-700" onClick={() => handleDelete(index)}>
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Keranjang kosong.</p>
            )}
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
      </div>
      <FooterCust />
    </div>
  );
};

export default CartPage;
