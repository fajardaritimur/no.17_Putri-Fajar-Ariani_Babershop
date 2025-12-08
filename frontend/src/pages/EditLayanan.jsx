import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditLayanan() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:7000/layanan/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData(data[0]); // ambil data pertama
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:7000/layanan/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        alert("Layanan berhasil diperbarui!");
        navigate("/layanan");
    };

    if (loading || !formData) {
        return <div className="container mt-4">Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Edit Layanan</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Nama Layanan</label>
                    <input
                        type="text"
                        name="nama_layanan"
                        value={formData.nama_layanan}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukkan nama layanan"
                    />
                </div>

                <button type="submit" className="btn btn-success me-2">
                    Simpan Perubahan
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/layanan")}
                >
                    Batal
                </button>
            </form>
        </div>
    );
}
