import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuItems = [
    { path: "/transaksi", label: "Transaksi" },
    { path: "/paket", label: "Paket" },
    { path: "/pegawai", label: "Pegawai" },
     { path: "/layanan", label: "Layanan" },
    { path: "/user", label: "Pengguna" },
    { path: "/adminpelanggan", label: "adminpelanggan"},
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>FINESHYT</h2>

      <ul style={styles.menu}>
        {menuItems.map((item, i) => (
          <li key={i}>
            <Link
              to={item.path}
              style={{
                ...styles.link,
                ...(pathname.startsWith(item.path) ? styles.activeLink : {}),
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={styles.bottom}>
        <Link to="/" style={styles.homeBtn}>🏠 Home</Link>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "230px",
    height: "100vh",
    backgroundColor: "#ffffff",
    padding: "25px 20px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    borderRight: "1px solid #e5e5e5",
    boxShadow: "2px 0px 10px rgba(0,0,0,0.05)",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "40px",
    textAlign: "center",
    color: "#5A4AE3",
  },

  menu: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  link: {
    textDecoration: "none",
    fontSize: "17px",
    padding: "12px 15px",
    borderRadius: "10px",
    color: "#444",
    display: "block",
    transition: "0.3s",
  },

  activeLink: {
    backgroundColor: "#5A4AE3",
    color: "white",
    fontWeight: "600",
  },

  bottom: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  homeBtn: {
    padding: "10px",
    textAlign: "center",
    borderRadius: "8px",
    background: "#f3f3f3",
    textDecoration: "none",
    color: "#555",
    transition: "0.3s",
  },

  logoutBtn: {
    padding: "10px",
    background: "#ff4d4d",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
