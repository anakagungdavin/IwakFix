import React, { useState } from "react";

const TwoStepVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = () => {
    alert(`Kode OTP yang dimasukkan: ${otp.join("")}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-black">Verify Your Account</h2>
        <p className="text-gray-600 text-center mt-2">
          Enter the 4 digit code sent to the registered email id.
        </p>

        <div className="flex justify-center gap-3 mt-4">
          {otp.map((data, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={data}
              onChange={(e) => handleChange(e, index)}
              maxLength="1"
              className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg outline-none focus:border-blue-500"
            />
          ))}
        </div>

        <p className="text-center text-gray-600 mt-3">
          Did not receive a code?
          <span className="text-blue-600 cursor-pointer ml-1">Resend</span>
        </p>

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700"
        >
          Verify
        </button>

        {/* Peringatan */}
        <p className="text-center text-red-500 text-sm mt-3">
          Jangan bagikan kode ini dengan orang lain
        </p>
      </div>
    </div>
  );
};

export default TwoStepVerification;
