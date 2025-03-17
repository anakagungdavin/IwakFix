import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CancelModal from "../../modal/modalCancel";
import SimpanModal from "../../modal/modalBerhasilSimpan";

const EditProfileCust = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null); // Simpan file untuk upload
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Lainnya");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSimpanModal, setShowSimpanModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const apiUrl =
          import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
        const response = await fetch(`${apiUrl}/api/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${text}`);
        }

        const result = await response.json();
        const userData = result.data;
        setName(userData.name || "");
        setPhone(userData.phoneNumber || "");
        setEmail(userData.email || "");
        setGender(userData.gender || "Lainnya");
        setAvatar(userData.avatar || null); // URL dari Uploadcare
      } catch (err) {
        setError(err.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file); // Simpan file untuk upload
      setAvatar(URL.createObjectURL(file)); // Preview lokal
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!passwordMatch) {
      alert("Konfirmasi kata sandi tidak sesuai!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

      // Upload avatar jika ada file baru
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarResponse = await fetch(
          `${apiUrl}/api/users/profile/avatar`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!avatarResponse.ok) {
          const text = await avatarResponse.text();
          throw new Error(
            `Upload avatar failed! status: ${avatarResponse.status} - ${text}`
          );
        }

        const avatarResult = await avatarResponse.json();
        setAvatar(avatarResult.avatar); // Update avatar dari respons
      }

      // Update profil lainnya
      const updatedData = {
        name,
        phoneNumber: phone,
        email,
        gender,
      };

      if (password) {
        updatedData.password = password;
      }

      const response = await fetch(`${apiUrl}/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${text}`);
      }

      setShowSimpanModal(true);
    } catch (err) {
      setError(err.message);
      alert("Gagal menyimpan perubahan: " + err.message);
    }
  };

  const handleBack = () => {
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        <div className="relative w-24 h-24 mx-auto">
          <img
            // src={avatar || "https://via.placeholder.com/80"}
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
            <label className="block text-gray-700 font-medium">
              No Telepon
            </label>
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
            <label className="block text-gray-700 font-medium">
              Jenis Kelamin
            </label>
            <select
              value={gender}
              onChange={handleGenderChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Masukkan kata sandi baru (kosongkan jika tidak diubah)"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${
                passwordMatch
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
              placeholder="Ulangi kata sandi baru"
            />
            {!passwordMatch && (
              <p className="text-red-500 text-sm mt-1">
                Konfirmasi kata sandi tidak cocok.
              </p>
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
