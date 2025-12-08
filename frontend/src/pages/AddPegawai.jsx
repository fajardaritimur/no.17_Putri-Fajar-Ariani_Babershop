import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPegawai() {
    const [formData, setFormData] = useState({
        id_pegawai: "",
        nama_pegawai: "",
        no_hp: ""
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
            const res = await fetch("http://localhost:7000/pegawai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                alert("pegawai berhasil ditambahkan!")
                setFormData({ id_pegawai: "", nama_pegawai: "", no_hp: "" }) //reset form
                navigate("/pegawai") // redirect ke halaman daftar pengguna 
            } else {
                alert("Gagal menambah pegawai")
            }
            } catch (err) {
                console.error("Error:", err)
                alert("Terjadi kesalahan saat menambah pegawai")
            }
        }

        return (
            <div className="container mt-4">
                <h2 className="mb-3">Tambah Pegawai</h2>
                <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

                    <div className="mb-3">
                        <label className="form-label">Nama Pegawai</label>
                        <input 
                        type="text"
                        name="nama_pegawai"
                        value={formData.nama_pegawai}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan Nama Pegawai"
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