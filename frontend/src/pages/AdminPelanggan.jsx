import "../assets/admin.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminPelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  const navigate = useNavigate();

  const getPelanggan = async () => {
    try {
      const res = await fetch("http://localhost:7000/pelanggan");
      const data = await res.json();
      setPelanggan(data);
    } catch (error) {
      console.error("Gagal memuat data pelanggan");
    }
  };

  useEffect(() => {
    getPelanggan();
  }, []);

  // 🔥 FUNGSI DELETE
  const handleDelete = async (id) => {
    if (!confirm("Hapus pelanggan ini?")) return;

    try {
      const res = await fetch(`http://localhost:7000/pelanggan/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Gagal menghapus pelanggan");
        return;
      }

      alert("Pelanggan berhasil dihapus!");

      // Refresh tabel
      getPelanggan();
    } catch (error) {
      console.error(error);
      alert("Error server");
    }
  };

  return (
    <div className="admin-card">
      <div className="table-header">
        <h2>Data Pelanggan</h2>

        <Link to="/adminpelanggan/tambah" className="btn-add">
          + Tambah Pelanggan
        </Link>
      </div>

      <table className="table-modern">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Username</th>
            <th>Email</th>
            <th>No HP</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {pelanggan.map((item) => (
            <tr key={item.id_pelanggan}>
              <td>{item.id_pelanggan}</td>

              {/* field nama_pelanggan */}
              <td>{item.nama_pelanggan}</td>

              <td>{item.username ? `@${item.username}` : "-"}</td>
              <td>{item.email}</td>
              <td>{item.no_hp}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/adminpelanggan/edit/${item.id_pelanggan}`)}
                >
                  Edit
                </button>

                <button
                  className="btn-delete"
                  onClick={() => handleDelete(item.id_pelanggan)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
