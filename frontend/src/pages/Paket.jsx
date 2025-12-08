import "../assets/admin.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Paket() {
  const [paket, setPaket] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getPaket = async () => {
    try {
      const res = await fetch("http://localhost:7000/paket");
      const data = await res.json();
      setPaket(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaket();
  }, []);

  return (
    <div className="admin-card">
      <div className="table-header">
        <h2>Daftar Paket</h2>
        <Link to="/paket/tambah" className="btn-add">+ Tambah Paket</Link>
      </div>

      <table className="table-modern">
        <thead>
          <tr>
            <th>ID</th>
            <th>Gambar</th>
            <th>Nama Paket</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {paket.map((item) => (
            <tr key={item.id_paket}>
              <td>{item.id_paket}</td>

              {/* Gambar Paket */}
              <td>
                <img 
                  src={`http://localhost:7000/${item.gambar}`} 
                  alt={item.nama_paket}
                  style={{ width: "80px", borderRadius: "8px" }}
                />
              </td>

              <td>{item.nama_paket}</td>

              <td>
                <button 
                  className="btn-edit"
                  onClick={() => navigate(`/paket/edit/${item.id_paket}`)}
                >
                  Edit
                </button>

                <button 
                  className="btn-delete"
                  onClick={() => navigate(`/paket/delete/${item.id_paket}`)}
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
