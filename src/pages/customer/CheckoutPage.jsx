import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const productData = location.state || null; // Single product purchase
  const cartData = location.state?.cart || null; // Cart data if from CartPage

  // Ensure correct cart items state
  const [cartItems, setCartItems] = useState([]);

  // Available sizes (Modify as needed)
  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    if (productData && !cartData) {
      setCartItems([{ ...productData, quantity: productData.quantity || 1 }]);
    } else if (cartData) {
      setCartItems(cartData);
    }
  }, [productData, cartData]);

  // Update local storage when cartItems change
  useEffect(() => {
    localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to change size
  const handleSizeChange = (index, newSize) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index ? { ...item, size: newSize } : item
    );
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
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Function to handle payment
  const handlePayment = () => {
    alert("Pembayaran berhasil!");
    localStorage.removeItem("checkoutCart"); // Clear checkout data after payment
    if (cartData) localStorage.removeItem("cart"); // Clear cart if coming from CartPage
    navigate("/"); // Redirect to homepage
  };

  return (
    <div>
      <HeaderCust />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Pembayaran</h2>

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
                    Rp{(item.price || 0).toLocaleString()}
                  </p>

                  {/* Size Selector */}
                  <div className="flex items-center mt-2">
                    <label className="mr-2">Ukuran:</label>
                    <select
                      className="border px-2 py-1 rounded-md"
                      value={item.size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                    >
                      {availableSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Buttons */}
                  <div className="flex items-center mt-2">
                    <button
                      className="px-2 py-1 text-sm border rounded"
                      onClick={() => handleQuantityChange(index, -1)}
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      className="px-2 py-1 text-sm border rounded"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Keranjang kosong.</p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-100 p-4 rounded-lg mt-6">
          <h3 className="font-bold mb-2">Ringkasan</h3>
          <p>Total: Rp{totalPrice.toLocaleString()}</p>
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
            onClick={handlePayment}
          >
            Bayar Sekarang
          </button>
        </div>
      </div>
      <FooterCust />
    </div>
  );
};

export default CheckoutPage;