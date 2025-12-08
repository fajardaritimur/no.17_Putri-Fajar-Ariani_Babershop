import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditGaleri() {
    const { id } = useParams(); // id_foto
    const navigate = useNavigate();

    const [judul, setJudul] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [kategori, setKategori] = useState([]);
    const [kategoriId, setKategoriId] = useState("");
    const [namaFileLama, setNamaFileLama] = useState("");
    const [namaFileBaru, setNamaFileBaru] = useState(null);

    // Fetch kategori untuk dropdown
    useEffect(() => {
        fetch("http://localhost:3000/kategori")
            .then((res) => res.json())
            .then((data) => setKategori(data))
            .catch((err) => console.error("Gagal load kategori:", err));
    }, []);

    // Ambil userId dari localStorage
    const userId = localStorage.getItem("userId");
    // Fetch data galeri lama
    useEffect(() => {
        fetch(`http://localhost:3000/foto/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setJudul(data.judul);
                setDeskripsi(data.deskripsi);
                setKategoriId(data.id_kategori);
                setNamaFileLama(data.nama_file);
            })
            .catch((err) => console.error("Gagal load galeri:", err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("judul", judul);
        formData.append("deskripsi", deskripsi);
        formData.append("id_kategori", kategoriId);
        formData.append("id_pengguna", userId); // otomatis dari localStorage
        // hanya upload jika ada file baru
        if (namaFileBaru) {
            formData.append("file", namaFileBaru);
        }

        try {
            const res = await fetch(`http://localhost:3000/foto/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                alert("Galeri berhasil diperbarui!");
                navigate("/galeri");
            } else {
                alert("Gagal memperbarui galeri.");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat update galeri.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Edit Galeri</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Judul</label>
                    <input
                        type="text"
                        className="form-control"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                        className="form-control"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Kategori</label>
                    <select
                        className="form-select"
                        value={kategoriId}
                        onChange={(e) => setKategoriId(e.target.value)}
                        required
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {kategori.map((item) => (
                            <option key={item.id_kategori} value={item.id_kategori}>
                                {item.nama_kategori}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Foto Lama</label>
                    <div>
                        {namaFileLama ? (
                            <img
                                src={`http://localhost:3000/uploads/${namaFileLama}`}
                                alt="Foto Lama"
                                style={{ width: "150px", borderRadius: "8px" }}
                            />
                        ) : (
                            <p>Tidak ada foto</p>
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Ganti Foto (opsional)</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setNamaFileBaru(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Update
                </button>
            </form>
        </div>
    );
}    