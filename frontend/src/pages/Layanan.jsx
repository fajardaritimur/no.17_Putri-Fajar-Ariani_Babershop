import "../assets/admin.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Layanan() {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getLayanan = async () => {
    try {
      const res = await fetch("http://localhost:7000/layanan");
      const data = await res.json();
      setLayanan(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLayanan();
  }, []);

  if (loading) return <div className="admin-card">Loading...</div>;
  const handleDelete = async (id) => {
  if (!window.confirm("Yakin ingin menghapus layanan ini?")) return;

  try {
    const res = await fetch(`http://localhost:7000/layanan/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);

    // refresh list
    getLayanan();

  } catch (err) {
    alert("Gagal menghapus layanan");
  }
};


  return (
    <div className="admin-card">
      <div className="table-header">
        <h2>Daftar Layanan</h2>
        <Link to="/layanan/tambah" className="btn-add">+ Tambah Layanan</Link>
      </div>

      <table className="table-modern">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Layanan</th>
            <th>Paket</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {layanan.map((item) => (
            <tr key={item.id_layanan}>
              <td>{item.id_layanan}</td>
              <td>{item.nama_layanan}</td>
              <td>{item.nama_paket}</td> 
              <td>Rp {Number(item.harga).toLocaleString("id-ID")}</td>


              <td>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/layanan/edit/${item.id_layanan}`)}
                >
                  Edit
                </button>

                <button
  className="btn-delete"
  onClick={() => handleDelete(item.id_layanan)}
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
