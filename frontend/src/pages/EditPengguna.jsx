import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPengguna() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState([]); // null dulu
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:7000/pengguna/${id}`)
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
        await fetch(`http://localhost:7000/pengguna/${id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formData),
        });
        alert("Data berhasil diperbarui!");
        navigate("/user");
    };


    if (loading || !formData) {
        return <div className="container mt-4">Loading</div>;
    }

    return(
        <div className="container mt-4">
            <h2>Edit Pengguna</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Nama Pengguna</label>
                    <input
                    type="text"
                    name="nama_pengguna"
                    value={formData.nama_pengguna}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Masukan Nama"
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
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Masukan Password"
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
                <button type="submit" className="btn btn-success me-2">
                    Simpan Perubahan
                </button>
                <button
                type="button" className="btn btn-secondary" onClick={() => navigate("/user")}>
                    Batal
                </button>
            </form>
        </div>
    );
}