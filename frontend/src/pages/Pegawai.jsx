import "../assets/admin.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Pegawai() {
  const [pegawai, setPegawai] = useState([]);
  const navigate = useNavigate();

  const getPegawai = async () => {
    const res = await fetch("http://localhost:7000/pegawai");
    const data = await res.json();
    setPegawai(data);
  };

  useEffect(() => {
    getPegawai();
  }, []);

  return (
    <div className="admin-card">
      <div className="table-header">
        <h2>Data Pegawai</h2>
        <Link to="/pegawai/tambah" className="btn-add">+ Tambah Pegawai</Link>
      </div>

      <table className="table-modern">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Pegawai</th>
            <th>No HP</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {pegawai.map((item) => (
            <tr key={item.id_pegawai}>
              <td>{item.id_pegawai}</td>
              <td>{item.nama_pegawai}</td>
              <td>{item.no_hp}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/pegawai/edit/${item.id_pegawai}`)}
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
