import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAccountCircle, MdLogout, MdCalendarMonth } from "react-icons/md";

export default function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");

  const [pelanggan, setPelanggan] = useState(null);
  const [booking, setBooking] = useState([]);

  // Cek login
  useEffect(() => {
    if (!token || !id) {
      navigate("/pelanggan/login");
      return;
    }

    // Ambil data pelanggan
    fetch(`http://localhost:7000/pelanggan/${id}`)
      .then((res) => res.json())
      .then((data) => setPelanggan(data))
      .catch((err) => console.error(err));

    // Ambil riwayat booking
    fetch(`http://localhost:7000/transaksi/pelanggan/${id}`)
      .then((res) => res.json())
      .then((data) => setBooking(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/pelanggan/login");
  };

  if (!pelanggan)
    return (
      <div style={{ padding: 50, fontSize: 18 }}>
        Loading dashboard...
      </div>
    );

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            <MdAccountCircle size={60} color="#3b5cff" />
          </div>
          <h3 style={styles.userName}>Hi, {pelanggan.nama_pelanggan}</h3>
        </div>

        <div style={styles.menuList}>
          <div style={styles.menuItem}>
            <MdAccountCircle size={22} />
            <span>Profile</span>
          </div>

          <div style={styles.menuItem}>
            <MdCalendarMonth size={22} />
            <span>My Bookings</span>
          </div>

          <div style={styles.menuItem} onClick={handleLogout}>
            <MdLogout size={22} color="red" />
            <span style={{ color: "red" }}>Logout</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        {/* PROFILE CARD */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>My Profile</h3>

          <div style={styles.profileGrid}>
            <p><b>Name:</b> {pelanggan.nama_pelanggan}</p>
            <p><b>Email:</b> {pelanggan.email}</p>
            <p><b>Username:</b> {pelanggan.username}</p>
            <p><b>No HP:</b> {pelanggan.no_hp}</p>
          </div>
        </section>

        {/* BOOKING TABLE */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>My Bookings</h3>

          {booking.length === 0 && (
            <p style={{ padding: "10px 0", color: "#666" }}>
              Kamu belum memiliki booking.
            </p>
          )}

          {booking.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Pegawai</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {booking.map((item) => (
                  <tr key={item.id_trans}>
                    <td>{item.tgl_trans}</td>
                    <td>{item.nama_paket}</td>
                    <td>{item.nama_pegawai}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "8px",
                          background: "#4A7DFF",
                          color: "white",
                          fontSize: "12px",
                        }}
                      >
                        Selesai
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    background: "#F6F9FF",
    minHeight: "100vh",
    fontFamily: "Poppins",
  },
  sidebar: {
    width: "280px",
    background: "white",
    padding: "30px 20px",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    height: "100vh",
    position: "sticky",
    top: 0,
  },
  profileHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#e6eaff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 10px",
  },
  userName: {
    fontSize: "18px",
    fontWeight: 600,
  },
  menuList: {
    marginTop: 20,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    cursor: "pointer",
    fontSize: "16px",
    color: "#333",
    borderRadius: "8px",
  },
  main: {
    flex: 1,
    padding: "40px",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  },
  cardTitle: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: 600,
  },
  profileGrid: {
    lineHeight: "32px",
    fontSize: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
};
