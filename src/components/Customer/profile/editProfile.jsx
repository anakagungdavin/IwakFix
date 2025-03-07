import { useState } from "react";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CancelModal from "../../modal/modalCancel";
import SimpanModal from "../../modal/modalBerhasilSimpan";

const EditProfileCust = () => {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState("/path-to-your-image.png");
    const [name, setName] = useState("Jimin Park");
    const [phone, setPhone] = useState("000000000000000");
    const [email, setEmail] = useState("robertfox@example.com");
    const [password, setPassword] = useState("password");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSimpanModal, setShowSimpanModal] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === password);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!passwordMatch) {
            alert("Konfirmasi kata sandi tidak sesuai!");
            return;
        }
        setShowSimpanModal(true);
    };

    const handleBack = () => {
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

                <div className="relative w-24 h-24 mx-auto">
                    <img
                        src={avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        id="avatarUpload"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <label
                        htmlFor="avatarUpload"
                        className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full border border-white cursor-pointer hover:bg-gray-600 transition"
                    >
                        <Pencil size={16} color="white" />
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Nama</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">No Telepon</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Kata Sandi</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Konfirmasi Kata Sandi</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${passwordMatch ? "border-gray-300 focus:ring-blue-500" : "border-red-500 focus:ring-red-500"}`}
                        />
                        {!passwordMatch && (
                            <p className="text-red-500 text-sm mt-1">Konfirmasi kata sandi tidak cocok.</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                            Kembali
                        </button>
                        <button
                            type="submit"
                            className="bg-[#003D47] text-white px-6 py-2 rounded-lg hover:bg-[#4a6265] transition"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
            
            {showModal && (
                <CancelModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={() => navigate("/profile")}
                    title="Konfirmasi"
                    message="Apakah Anda yakin ingin kembali tanpa menyimpan perubahan?"
                    confirmText="Ya, Kembali"
                    cancelText="Batal"
                />
            )}

            {showSimpanModal && (
                <SimpanModal
                    isOpen={showSimpanModal}
                    onClose={() => {
                        setShowSimpanModal(false);
                        navigate("/profile");
                    }}
                    title="Berhasil"
                    message="Profile berhasil diperbarui!"
                    confirmText="OK"
                />
            )}
        </div>
    );
};

export default EditProfileCust;
