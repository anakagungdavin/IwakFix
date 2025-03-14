// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HeaderCust from "../../components/Customer/headerCust";
// import FooterCust from "../../components/Customer/footerCust";

// const CheckoutPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const productData = location.state || null; // Single product purchase
//   const cartData = location.state?.cart || null; // Cart data if from CartPage

//   // Ensure correct cart items state
//   const [cartItems, setCartItems] = useState([]);

//   // Available sizes (Modify as needed)
//   const availableSizes = ["S", "M", "L", "XL", "XXL"];

//   useEffect(() => {
//     if (productData && !cartData) {
//       setCartItems([{ ...productData, quantity: productData.quantity || 1 }]);
//     } else if (cartData) {
//       setCartItems(cartData);
//     }
//   }, [productData, cartData]);

//   // Update local storage when cartItems change
//   useEffect(() => {
//     localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Function to change size
//   const handleSizeChange = (index, newSize) => {
//     const updatedCart = cartItems.map((item, i) =>
//       i === index ? { ...item, size: newSize } : item
//     );
//     setCartItems(updatedCart);
//   };

//   // Function to handle quantity change
//   const handleQuantityChange = (index, change) => {
//     const updatedCart = cartItems.map((item, i) =>
//       i === index
//         ? { ...item, quantity: Math.max(1, item.quantity + change) }
//         : item
//     );
//     setCartItems(updatedCart);
//   };

//   // Calculate total price
//   const totalPrice = cartItems.reduce(
//     (total, item) => total + (item.price || 0) * (item.quantity || 1),
//     0
//   );

//   // Function to handle payment
//   const handlePayment = () => {
//     alert("Pembayaran berhasil!");
//     localStorage.removeItem("checkoutCart"); // Clear checkout data after payment
//     if (cartData) localStorage.removeItem("cart"); // Clear cart if coming from CartPage
//     navigate("/"); // Redirect to homepage
//   };

//   return (
//     <div>
//       <HeaderCust />
//       <div className="max-w-6xl mx-auto px-6 py-10">
//         <h2 className="text-3xl font-bold text-yellow-500 mb-6">Pembayaran</h2>

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
//                   <p className="text-gray-500">{item.description}</p>
//                   <p className="font-semibold">
//                     Rp{(item.price || 0).toLocaleString()}
//                   </p>

//                   {/* Size Selector */}
//                   <div className="flex items-center mt-2">
//                     <label className="mr-2">Ukuran:</label>
//                     <select
//                       className="border px-2 py-1 rounded-md"
//                       value={item.size}
//                       onChange={(e) => handleSizeChange(index, e.target.value)}
//                     >
//                       {availableSizes.map((size) => (
//                         <option key={size} value={size}>
//                           {size}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Quantity Buttons */}
//                   <div className="flex items-center mt-2">
//                     <button
//                       className="px-2 py-1 text-sm border rounded"
//                       onClick={() => handleQuantityChange(index, -1)}
//                     >
//                       -
//                     </button>
//                     <span className="px-4">{item.quantity}</span>
//                     <button
//                       className="px-2 py-1 text-sm border rounded"
//                       onClick={() => handleQuantityChange(index, 1)}
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center">Keranjang kosong.</p>
//           )}
//         </div>

//         {/* Payment Summary */}
//         <div className="bg-gray-100 p-4 rounded-lg mt-6">
//           <h3 className="font-bold mb-2">Ringkasan</h3>
//           <p>Total: Rp{totalPrice.toLocaleString()}</p>
//           <button
//             className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
//             onClick={handlePayment}
//           >
//             Bayar Sekarang
//           </button>
//         </div>
//       </div>
//       <FooterCust />
//     </div>
//   );
// };

// export default CheckoutPage;

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HeaderCust from "../../components/Customer/headerCust";
// import FooterCust from "../../components/Customer/footerCust";

// const CheckoutPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const productData = location.state || null;
//   const cartData = location.state?.cart || null;

//   const [cartItems, setCartItems] = useState([]);
//   const [paymentMethod, setPaymentMethod] = useState("BCA Virtual Account");

//   useEffect(() => {
//     if (productData && !cartData) {
//       setCartItems([{ ...productData, quantity: productData.quantity || 1 }]);
//     } else if (cartData) {
//       setCartItems(cartData);
//     }
//   }, [productData, cartData]);

//   useEffect(() => {
//     localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const handleQuantityChange = (index, change) => {
//     const updatedCart = cartItems.map((item, i) =>
//       i === index
//         ? { ...item, quantity: Math.max(1, item.quantity + change) }
//         : item
//     );
//     setCartItems(updatedCart);
//   };

//   const totalPrice = cartItems.reduce(
//     (total, item) => total + (item.price || 0) * (item.quantity || 1),
//     0
//   );

//   const handlePayment = () => {
//     alert("Pembayaran berhasil!");
//     localStorage.removeItem("checkoutCart");
//     if (cartData) localStorage.removeItem("cart");
//     navigate("/customer-dashboard");
//   };

//   return (
//     <div>
//       <HeaderCust />
//       <div className="bg-gray-100 min-h-screen">
//         <div className="max-w-6xl mx-auto px-6 py-10">
          // <h2 className="text-3xl font-bold text-yellow-500 mb-6">Pembayaran</h2>
          // <div className="bg-white p-6 rounded-lg shadow-lg">
          //   <h3 className="font-bold text-lg">Alamat Pengiriman</h3>
          //   <p className="text-gray-700 font-semibold">Jimin Park</p>
          //   <p className="text-gray-500 text-sm">+6281234567890</p>
          //   <p className="text-gray-500 text-sm">
          //     Gadjah Mada University, Perpustakaan UGM, Jl Tri Darma No.2, Karang Malang, Caturtunggal,
          //     Kec. Depok, Kabupaten Sleman, DIY 55281
          //   </p>
          //   <button className="mt-2 text-blue-600">Ganti Alamat</button>
          // </div>
//           <div className="mt-6">
//             {cartItems.map((item, index) => (
//               <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-lg flex items-center">
//                 <img src={item.image} alt={item.name} className="w-24 h-24 mr-4" />
//                 <div className="flex-grow">
//                   <h4 className="font-bold text-lg">{item.name}</h4>
//                   <p className="text-gray-500 text-sm">{item.description}</p>
//                   <p className="font-semibold text-lg">Rp{(item.price || 0).toLocaleString()}</p>
//                   <div className="flex items-center mt-2">
//                     <span className="mr-2">XL</span>
//                     <button className="px-3 py-1 border rounded" onClick={() => handleQuantityChange(index, -1)}>-</button>
//                     <span className="mx-2">{item.quantity}</span>
//                     <button className="px-3 py-1 border rounded" onClick={() => handleQuantityChange(index, 1)}>+</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
//             <h3 className="font-bold text-lg mb-2">Metode Pembayaran</h3>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="BCA Virtual Account"
//                 checked={paymentMethod === "BCA Virtual Account"}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="mr-2"
//               />
//               BCA Virtual Account
//             </label>
//             <label className="flex items-center mt-2">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="QRIS"
//                 checked={paymentMethod === "QRIS"}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="mr-2"
//               />
//               QRIS
//             </label>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
//             <h3 className="font-bold text-lg">Ringkasan</h3>
//             <p className="flex justify-between"><span>Items ({cartItems.length})</span> <span>Rp{totalPrice.toLocaleString()}</span></p>
//             <p className="flex justify-between text-red-500"><span>Discounts</span> <span>-Rp2.000</span></p>
//             <p className="flex justify-between font-bold text-lg mt-2"><span>Total</span> <span>Rp{(totalPrice - 2000).toLocaleString()}</span></p>
//             <button
//               className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
//               onClick={handlePayment}
//             >
//               Bayar Sekarang ({cartItems.length})
//             </button>
//           </div>
//         </div>
//         <FooterCust />
//       </div>
//     </div>

//   );
// };

// export default CheckoutPage;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state || null;
  const cartData = location.state?.cart || null;
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("BCA Virtual Account");

  useEffect(() => {
    if (productData && !cartData) {
      setCartItems([{ ...productData, quantity: productData.quantity || 1 }]);
    } else if (cartData) {
      setCartItems(cartData);
    }
  }, [productData, cartData]);

  useEffect(() => {
    localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handlePayment = () => {
    alert("Pembayaran berhasil!");
    localStorage.removeItem("checkoutCart");
    if (cartData) localStorage.removeItem("cart");
    navigate("/customer-dashboard");
    scrollTo(0,0)
  };

  return (
    <div>
      <HeaderCust />
      <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-yellow-500 mb-6">Pembayaran</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg">Alamat Pengiriman</h3>
            <p className="text-gray-700 font-semibold">Jimin Park</p>
            <p className="text-gray-500 text-sm">+6281234567890</p>
            <p className="text-gray-500 text-sm">
              Gadjah Mada University, Perpustakaan UGM, Jl Tri Darma No.2, Karang Malang, Caturtunggal,
              Kec. Depok, Kabupaten Sleman, DIY 55281
            </p>
            <button className="mt-2 text-blue-600">Ganti Alamat</button>
          </div>
        {/* Cart Items */}
        <div className="bg-white p-4 mt-6 rounded-lg shadow-lg">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="flex items-center border-b pb-4 mb-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 mr-4" />
                <div className="flex-grow">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-gray-500">{item.description}</p>
                  <p className="font-semibold">Rp{(item.price || 0).toLocaleString()}</p>
                  <p className="mt-2 font-bold">Warna: <span className="font-normal">{item.color}</span></p>
                  <p className="font-bold">Ukuran: <span className="font-normal">{item.size}</span></p>
                  <p className="font-bold">Jumlah: <span className="font-normal">{item.quantity}</span></p>
                  {/* <div className="flex items-center mt-2">
                    <button className="px-2 py-1 text-sm border rounded" onClick={() => setCartItems(prev => prev.map((el, i) => i === index ? { ...el, quantity: Math.max(1, el.quantity - 1) } : el))}>
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button className="px-2 py-1 text-sm border rounded" onClick={() => setCartItems(prev => prev.map((el, i) => i === index ? { ...el, quantity: el.quantity + 1 } : el))}>
                      +
                    </button>
                  </div> */}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Keranjang kosong.</p>
          )}
        </div>

        {/* Payment Summary & Method */}
        <div className="bg-gray-100 p-4 rounded-lg mt-6">
          <h3 className="font-bold mb-2">Metode Pembayaran</h3>
          <div className="flex flex-col space-y-2 border-b pb-4">
            <label className="flex items-center">
              <input type="radio" name="payment" value="BCA Virtual Account" checked={paymentMethod === "BCA Virtual Account"} onChange={() => setPaymentMethod("BCA Virtual Account")} className="mr-2" />
              BCA Virtual Account
            </label>
            <label className="flex items-center">
              <input type="radio" name="payment" value="QRIS" checked={paymentMethod === "QRIS"} onChange={() => setPaymentMethod("QRIS")} className="mr-2" />
              QRIS
            </label>
          </div>
          <h3 className="font-bold mt-4">Ringkasan</h3>
          <p>Items ({cartItems.length}): Rp{totalPrice.toLocaleString()}</p>
          <p>Discounts: <span className="text-red-500">-Rp2.000</span></p>
          <p className="font-bold text-lg mt-2">Total: Rp{(totalPrice - 2000).toLocaleString()}</p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg" onClick={handlePayment}>
            Bayar Sekarang ({cartItems.length})
          </button>
        </div>
      </div>
      <FooterCust />
    </div>
  );
};

export default CheckoutPage;
