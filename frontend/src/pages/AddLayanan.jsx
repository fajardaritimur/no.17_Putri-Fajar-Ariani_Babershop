import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddLayanan() {
    const [formData, setFormData] = useState({
        nama_layanan: "",
        harga: "",
        id_paket: ""
    });

    const [paketList, setPaketList] = useState([]);
    const navigate = useNavigate();

    // Ambil paket untuk dropdown
    const getPaket = async () => {
        const res = await fetch("http://localhost:7000/paket");
        const data = await res.json();
        setPaketList(data);
    };

    useEffect(() => {
        getPaket();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:7000/layanan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            alert("Layanan berhasil ditambahkan!");
            navigate("/layanan");
        } else {
            alert("Gagal menambah layanan");
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
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Harga</label>
                    <input
                        type="number"
                        name="harga"
                        value={formData.harga}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Pilih Paket</label>
                    <select
                        className="form-control"
                        name="id_paket"
                        value={formData.id_paket}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- pilih paket --</option>
                        {paketList.map((p) => (
                            <option key={p.id_paket} value={p.id_paket}>
                                {p.nama_paket}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-success">
                    Simpan
                </button>
            </form>
        </div>
    );
}
