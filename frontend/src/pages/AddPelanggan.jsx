import "../assets/admin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPelanggan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_pelanggan: "",
    username: "",
    email: "",
    password: "",
    no_hp: "",
    alamat: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:7000/pelanggan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                alert("Pelanggan berhasil ditambahkan!")
                setFormData({ id_pelanggan: "", nama_pelanggan: "", username: "", no_hp: "" }) //reset form
                navigate("/adminpelanggan") // redirect ke halaman daftar pengguna 
            } else {
                alert("Gagal menambah pelanggan")
            }
            } catch (err) {
                console.error("Error:", err)
                alert("Terjadi kesalahan saat menambah pelanggan")
            }
        }

  return (
        <div className="container mt-4">
            <h2 className="mb-3">Tambah Pelanggan</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Nama Pelanggan</label>
                    <input
                        type="text"
                        name="nama_pelanggan"
                        value={formData.nama_pelanggan}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan Nama"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan username"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan email"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan password"
                        required
                    />
                </div>

                <div className="mb-3">
                        <label className="form-label">No Hp</label>
                        <input 
                        type="text"
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan No Hp"
                        required
                        />
                    </div>

                <button type="submit" className="btn btn-success">
                    Simpan
                </button>
            </form>
        </div>
    )
}