// import React, { Component } from "react";
// import emailjs from "emailjs-com";

// class ResetPassword extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       step: 1,
//       email: "",
//       otp: ["", "", "", ""],
//       sentOtp: "",
//       newPassword: "",
//       confirmPassword: "",
//     };
//   }

//   // Handle perubahan input email
//   handleEmailChange = (e) => {
//     this.setState({ email: e.target.value });
//   };

//   // Menghasilkan OTP 4 digit random
//   generateOTP = () => {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   };

//   // Kirim OTP ke email
//   sendOtpToEmail = () => {
//     const { email } = this.state;
//     if (!email) {
//       alert("Please enter your email!");
//       return;
//     }

//     const otp = this.generateOTP();
//     this.setState({ sentOtp: otp });

//     const templateParams = {
//       to_email: email,
//       message: `Your OTP code is: ${otp}`,
//     };

//     emailjs
//       .send(
//         "YOUR_SERVICE_ID", // Ganti dengan EmailJS Service ID
//         "YOUR_TEMPLATE_ID", // Ganti dengan Template ID
//         templateParams,
//         "YOUR_USER_ID" // Ganti dengan Public Key
//       )
//       .then((response) => {
//         alert("OTP sent to your email!");
//         this.setState({ step: 2 });
//       })
//       .catch((error) => {
//         alert("Failed to send OTP. Try again!");
//       });
//   };

//   // Handle perubahan input OTP
//   handleOtpChange = (e, index) => {
//     const { otp } = this.state;
//     const value = e.target.value;
//     if (!isNaN(value) && value.length <= 1) {
//       otp[index] = value;
//       this.setState({ otp });
//       if (value && index < 3) {
//         document.getElementById(`otp-input-${index + 1}`).focus();
//       }
//     }
//   };

//   // Verifikasi OTP
//   verifyOtp = () => {
//     const { otp, sentOtp } = this.state;
//     if (otp.join("") === sentOtp) {
//       alert("OTP Verified!");
//       this.setState({ step: 3 });
//     } else {
//       alert("Invalid OTP. Try again!");
//     }
//   };

//   // Handle perubahan input password
//   handlePasswordChange = (e) => {
//     this.setState({ newPassword: e.target.value });
//   };

//   handleConfirmPasswordChange = (e) => {
//     this.setState({ confirmPassword: e.target.value });
//   };

//   // Reset Password
//   resetPassword = () => {
//     const { newPassword, confirmPassword } = this.state;
//     if (newPassword.length < 6) {
//       alert("Password must be at least 6 characters!");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }
//     alert("Password successfully changed!");
//     this.setState({ step: 1, email: "", otp: ["", "", "", ""], newPassword: "", confirmPassword: "" });
//   };

//   render() {
//     const { step, email, otp, newPassword, confirmPassword } = this.state;

//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//           {/* Step 1: Masukkan Email */}
//           {step === 1 && (
//             <>
//               <h2 className="text-2xl font-bold text-center text-black">Reset Password</h2>
//               <p className="text-gray-600 text-center mt-2">Enter your email to receive OTP</p>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={this.handleEmailChange}
//                 className="w-full mt-4 p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500"
//               />
//               <button
//                 onClick={this.sendOtpToEmail}
//                 className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700"
//               >
//                 Send OTP
//               </button>
//             </>
//           )}

//           {/* OTP */}
//           {step === 2 && (
//             <>
//               <h2 className="text-2xl font-bold text-center text-black">Enter OTP</h2>
//               <p className="text-gray-600 text-center mt-2">Enter the 4-digit OTP sent to {email}</p>
//               <div className="flex justify-center gap-3 mt-4">
//                 {otp.map((data, index) => (
//                   <input
//                     key={index}
//                     id={`otp-input-${index}`}
//                     type="text"
//                     value={data}
//                     onChange={(e) => this.handleOtpChange(e, index)}
//                     maxLength="1"
//                     className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg outline-none focus:border-blue-500"
//                   />
//                 ))}
//               </div>
//               <button
//                 onClick={this.verifyOtp}
//                 className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700"
//               >
//                 Verify OTP
//               </button>
//             </>
//           )}

//           {/* Ubah pass */}
//           {step === 3 && (
//             <>
//               <h2 className="text-2xl font-bold text-center text-black">Create New Password</h2>
//               <input
//                 type="password"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={this.handlePasswordChange}
//                 className="w-full mt-4 p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500"
//               />
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={this.handleConfirmPasswordChange}
//                 className="w-full mt-3 p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500"
//               />
//               <button
//                 onClick={this.resetPassword}
//                 className="w-full mt-4 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700"
//               >
//                 Reset Password
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

// export default ResetPassword;
