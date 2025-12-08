import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPaket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_paket: "",
    gambar: null,
    gambar_lama: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:7000/paket/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const paket = data[0];

        setFormData({
          nama_paket: paket.nama_paket,
          gambar: null, // file baru
          gambar_lama: paket.gambar // simpan file lama
        });

        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "gambar") {
      setFormData({
        ...formData,
        gambar: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("nama_paket", formData.nama_paket);

    // Jika user upload gambar baru → kirim gambar baru
    if (formData.gambar) {
      form.append("gambar", formData.gambar);
    }

    const res = await fetch(`http://localhost:7000/paket/${id}`, {
      method: "PUT",
      body: form
    });

    if (res.ok) {
      alert("Data berhasil diperbarui!");
      navigate("/paket");
    } else {
      alert("Gagal memperbarui paket");
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Edit Paket</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

        <div className="mb-3">
          <label className="form-label">Nama Paket</label>
          <input
            type="text"
            name="nama_paket"
            value={formData.nama_paket}
            onChange={handleChange}
            className="form-control"
            placeholder="Masukkan nama paket"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gambar Sekarang</label>
          <br />
          <img
            src={`http://localhost:7000/uploads/${formData.gambar_lama}`}
            alt="gambar paket"
            width="150"
            className="rounded mb-2"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ganti Gambar (opsional)</label>
          <input
            type="file"
            name="gambar"
            accept="image/*"
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-success me-2">
          Simpan Perubahan
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/paket")}
        >
          Batal
        </button>

      </form>
    </div>
  );
}
