import "../assets/admin.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPelanggan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_pelanggan: "",
    username: "",
    email: "",
    password: "",
    no_hp: "",
    alamat: ""
  });

  useEffect(() => {
    fetch(`http://localhost:7000/pelanggan/${id}`)
      .then(res => res.json())
      .then(data => setForm(data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:7000/adminpelanggan/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Pelanggan berhasil diupdate!");
      navigate("/pelanggan/admin");
    } else {
      alert("Gagal update pelanggan");
    }
  };

  return (
    <div className="admin-card">
      <h2>Edit Pelanggan</h2>

      <form onSubmit={handleSubmit} className="form-admin">

        <label>Nama</label>
        <input type="text" name="nama_pelanggan" value={form.nama_pelanggan} onChange={handleChange} />

        <label>Username</label>
        <input type="text" name="username" value={form.username} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />

        <label>No HP</label>
        <input type="text" name="no_hp" value={form.no_hp} onChange={handleChange} />

        <label>Alamat</label>
        <textarea name="alamat" value={form.alamat} onChange={handleChange}></textarea>

        <button className="btn-save">Simpan</button>
      </form>
    </div>
  );
}
