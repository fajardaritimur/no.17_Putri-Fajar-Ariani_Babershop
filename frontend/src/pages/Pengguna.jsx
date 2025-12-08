import "../assets/admin.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Pengguna() {
  const [pengguna, setPengguna] = useState([]);
  const navigate = useNavigate();

  const getPengguna = async () => {
    const res = await fetch("http://localhost:7000/pengguna");
    const data = await res.json();
    setPengguna(data);
  };

  useEffect(() => {
    getPengguna();
  }, []);

  
  return (
    <div className="admin-card">
      <div className="table-header">
        <h2>Data Pengguna</h2>
        <Link to="/pengguna/tambah" className="btn-add">+ Tambah Pengguna</Link>
      </div>

      <table className="table-modern">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {pengguna.map((item) => (
            <tr key={item.id_pengguna}>
              <td>{item.id_pengguna}</td>
              <td>{item.nama_pengguna}</td>
              <td>{item.email}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/pengguna/edit/${item.id_pengguna}`)}
                >
                  Edit
                </button>

                <button className="btn-delete">Hapus</button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
