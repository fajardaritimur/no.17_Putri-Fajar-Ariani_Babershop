import "../assets/admin.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Transaksi() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getTransaksi = async () => {
    try {
      const res = await fetch("http://localhost:7000/transaksi");
      const data = await res.json();

      // Pastikan data adalah array
      if (Array.isArray(data)) {
        setTransaksi(data);
      } else {
        setTransaksi([]);
      }
    } catch (error) {
      console.error("Gagal fetch transaksi:", error);
      setTransaksi([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    getTransaksi();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus transaksi ini?")) return;

    try {
      await fetch(`http://localhost:7000/transaksi/${id}`, {
        method: "DELETE",
      });

      // Refresh data setelah hapus
      getTransaksi();
    } catch (error) {
      console.error("Gagal hapus:", error);
    }
  };

  return (
    <div className="admin-card">
      <div className="table-header">
        <h2>Daftar Transaksi</h2>
        <Link to="/transaksi/tambah" className="btn-add">
          + Tambah Transaksi
        </Link>
      </div>

      {/* LOADING */}
      {loading && <p className="loading">Memuat data...</p>}

      {/* TIDAK ADA DATA */}
      {!loading && transaksi.length === 0 && (
        <p className="no-data">Tidak ada transaksi.</p>
      )}

      {/* TABLE */}
      {transaksi.length > 0 && (
        <table className="table-modern">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tanggal</th>
              <th>Pelanggan</th>
              <th>Paket</th>
              <th>Pegawai</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {transaksi.map((item) => (
              <tr key={item.id_trans}>
                <td>{item.id_trans}</td>
                <td>{item.tgl_trans}</td>
                <td>{item.nama_pelanggan || "-"}</td>
                <td>{item.nama_paket}</td>
                <td>{item.nama_pegawai || "-"}</td>

                <td>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/struck/${item.id_trans}`)}
                  >
                    Print
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id_trans)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
