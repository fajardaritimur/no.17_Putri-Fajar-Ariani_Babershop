import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTransaksi() {
  const [formData, setFormData] = useState({
    tgl_trans: "",
    nama_pelanggan: "",
    id_paket: "",
    id_pegawai: "",
    id_pengguna: "",
  });

  const [hargaPaket, setHargaPaket] = useState(0);
  const [paketList, setPaketList] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [penggunaList, setPenggunaList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:7000/paket")
      .then((res) => res.json())
      .then(setPaketList)
      .catch(() => alert("Gagal ambil data paket"));

    fetch("http://localhost:7000/pegawai")
      .then((res) => res.json())
      .then(setPegawaiList)
      .catch(() => alert("Gagal ambil data pegawai"));

    fetch("http://localhost:7000/pengguna")
      .then((res) => res.json())
      .then(setPenggunaList)
      .catch(() => alert("Gagal ambil data pengguna"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_paket") {
      const selectedPaket = paketList.find((p) => p.id_paket == value);
      setHargaPaket(selectedPaket ? Number(selectedPaket.harga) : 0);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      tgl_trans: formData.tgl_trans,
      nama_pelanggan: formData.nama_pelanggan,
      id_paket: formData.id_paket,
      id_pegawai: formData.id_pegawai,
      id_pengguna: formData.id_pengguna,
    };

    try {
      const res = await fetch("http://localhost:7000/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Transaksi berhasil ditambahkan!");

        // 🟡 Tambahan: langsung buka halaman struk dan auto print
        navigate(`/struck/${data.id_trans}`);
        setTimeout(() => {
          window.print();
        }, 800);

      } else {
        alert(`Gagal: ${data.error || data.message || "Tidak diketahui"}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan transaksi");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tambah Transaksi</h2>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Tanggal Transaksi</label>
          <input
            type="datetime-local"
            name="tgl_trans"
            value={formData.tgl_trans}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nama Pelanggan</label>
          <input
            type="text"
            name="nama_pelanggan"
            value={formData.nama_pelanggan}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Paket</label>
          <select
            name="id_paket"
            value={formData.id_paket}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Pilih Paket --</option>
            {paketList.map((paket) => (
              <option key={paket.id_paket} value={paket.id_paket}>
                {paket.nama_paket} — Rp {Number(paket.harga).toLocaleString("id-ID")}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Pegawai</label>
          <select
            name="id_pegawai"
            value={formData.id_pegawai}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Pilih Pegawai --</option>
            {pegawaiList.map((pgw) => (
              <option key={pgw.id_pegawai} value={pgw.id_pegawai}>
                {pgw.nama_pegawai}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Pengguna</label>
          <select
            name="id_pengguna"
            value={formData.id_pengguna}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Pilih Pengguna --</option>
            {penggunaList.map((usr) => (
              <option key={usr.id_pengguna} value={usr.id_pengguna}>
                {usr.nama_pengguna}
              </option>
            ))}
          </select>
        </div>

        {/* 🟢 Fix tombol Simpan agar pakai submit */}
        <button type="submit" className="btn btn-warning btn-sm">
          Simpan
        </button>
      </form>
    </div>
  );
}