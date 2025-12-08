import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPaket() {
  const [formData, setFormData] = useState({
    nama_paket: "",
    gambar: null
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "gambar") {
      setFormData({ ...formData, gambar: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("nama_paket", formData.nama_paket);
    form.append("gambar", formData.gambar);

    const res = await fetch("http://localhost:7000/paket", {
      method: "POST",
      body: form
    });

    if (res.ok) {
      alert("Paket berhasil ditambahkan!");
      navigate("/paket");
    } else {
      alert("Gagal menambah paket");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tambah Paket</h2>
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
          <label className="form-label">Upload Gambar Paket</label>
          <input
            type="file"
            name="gambar"
            accept="image/*"
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Simpan</button>
      </form>
    </div>
  );
}
