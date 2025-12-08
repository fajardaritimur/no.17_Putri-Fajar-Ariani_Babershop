import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPegawai() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState([]); // null dulu
    const [loading, setLoading] = useState(false);

    useEffect (() => {
        fetch(`http://localhost:7000/pegawai/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setFormData(data[0]); // ambil data pertama
            setLoading(false);
        })
        .catch((err) => console.error(err));
    }, [id] );
    console.log(formData);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            await fetch(`http://localhost:7000/pegawai/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });
            alert("data behasil diperbarui!");
            navigate("/pegawai");
            };


            if (loading || !formData) {
                return <div className="container mt-4">loading...</div>
            }

            return (
                <div className="container mt-4">
                    <h2>edit paket</h2>
                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="mb-3">
                            <label className="form-label">nama pegawai</label>
                            <input
                                type="text"
                                name="nama_pegawai"
                                value={formData.nama_pegawai}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="masukkan nama pegawai"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">no hp</label>
                            <input
                                type="text"
                                name="no_hp"
                                value={formData.no_hp}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="masukkan no hp"
                            />
                        </div>

                        <button type="submit" className="btn btn-success me-2">
                            simpan perubahan
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/pegawai")}>
                            batal
                        </button>
                    </form>
                </div>
            );
        }