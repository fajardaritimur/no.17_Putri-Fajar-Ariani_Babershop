import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddLayanan() {
    const [formData, setFormData] = useState({
        nama_layanan: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:7000/layanan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("Layanan berhasil ditambahkan!");
                setFormData({ nama_layanan: "" }); // reset form
                navigate("/layanan"); // redirect ke halaman daftar layanan
            } else {
                alert("Gagal menambah layanan");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Terjadi kesalahan saat menambah layanan");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Tambah Layanan</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

                <div className="mb-3">
                    <label className="form-label">Nama Layanan</label>
                    <input
                        type="text"
                        name="nama_layanan"
                        value={formData.nama_layanan}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukkan Nama Layanan"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success">
                    Simpan
                </button>
            </form>
        </div>
    );
}
