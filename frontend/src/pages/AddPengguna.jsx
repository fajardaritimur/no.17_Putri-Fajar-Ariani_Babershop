import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPengguna() {
    const [formData, setFormData] = useState({
        nama_pengguna: "",
        email: "",
        password: "",
        role: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:7000/pengguna", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                alert("Pengguna berhasil ditambahkan!")
                setFormData({ nama_pengguna: "", email: "", password: "", role: "" }) //reset form
                navigate("/user") // redirect ke halaman daftar pengguna 
            } else {
                alert("Gagal menambah pengguna")
            }
        } catch (err) {
            console.error("Error:", err)
            alert("Terjadi kesalahan saat menambah pengguna")
        }
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Tambah Pengguna</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Nama Pengguna</label>
                    <input
                        type="text"
                        name="nama_pengguna"
                        value={formData.nama_pengguna}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan Nama"
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
                    <label className="form-label">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Pilih Role</option>
                        <option value="owner">Owner</option>
                        <option value="kasir">Kasir</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-success">
                    Simpan
                </button>
            </form>
        </div>
    )
}