import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state || {}; // Get product data from navigation

  // Initialize cart with product details
  const [cartItems, setCartItems] = useState([product]);

  // Available sizes (Modify as needed)
  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  // Function to change size
  const handleSizeChange = (index, newSize) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index ? { ...item, size: newSize } : item
    );
    setCartItems(updatedCart);
  };

  // Function to remove item from cart
  const handleDelete = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  // Function to handle quantity change
  const handleQuantityChange = (index, change) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updatedCart);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <HeaderCust />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Pembayaran</h2>

        {/* Shipping Address */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="font-bold">Alamat Pengiriman</h3>
          <p>Jimin Park</p>
          <p>+628123456789</p>
          <p>Gadjah Mada University, Yogyakarta, Indonesia</p>
        </div>

        {/* Cart Items */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="flex items-center border-b pb-4 mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 mr-4"
                />
                <div className="flex-grow">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-gray-500">{item.description}</p>
                  <p className="font-semibold">
                    Rp{item.price.toLocaleString()}
                  </p>

                  {/* Size Selector + Quantity Controls */}
                  <div className="flex items-center mt-2">
                    {/* Size Dropdown */}
                    <select
                      className="border px-2 py-1 rounded-md mr-4"
                      value={item.size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                    >
                      {availableSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>

                    {/* Quantity Buttons */}
                    <button
                      className="px-2 py-0.5 text-sm border rounded"
                      onClick={() => handleQuantityChange(index, -1)}
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      className="px-2 py-0.5 text-sm border rounded"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      +
                    </button>

                    {/* Delete Button */}
                    <button
                      className="ml-4 text-red-500"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-100 p-4 rounded-lg mt-6">
          <h3 className="font-bold mb-2">Ringkasan</h3>
          <p>
            Items ({cartItems.length}): Rp{totalPrice.toLocaleString()}
          </p>
          <p>Discounts: -Rp2000</p>
          <p className="font-semibold text-lg">
            Total: Rp{(totalPrice - 2000).toLocaleString()}
          </p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">
            Bayar Sekarang
          </button>
        </div>
      </div>

      <FooterCust />
    </div>
  );
};

export default CheckoutPage;