import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { path: "/transaksi", label: "📒 Transaksi" },
    { path: "/paket", label: "📦 Paket" },
    { path: "/pegawai", label: "👨‍🔧 Pegawai" },
    { path: "/user", label: "👤 Pengguna" },
  ];

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
        <Link to="/" style={styles.homeBtn}>Home</Link>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    backgroundColor: "#1e1e1e",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    boxShadow: "3px 0 10px rgba(0,0,0,0.3)",
  },

  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "35px",
    textAlign: "center",
    color: "#4da6ff",
    letterSpacing: "1px",
  },

  menu: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  link: {
    color: "#cccccc",
    textDecoration: "none",
    fontSize: "18px",
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "0.25s",
    display: "block",
  },

  activeLink: {
    backgroundColor: "#333333",
    color: "#4da6ff",
    fontWeight: "bold",
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
    border: "1px solid white",
    textDecoration: "none",
    color: "white",
    transition: "0.3s",
  },

  logoutBtn: {
    padding: "10px",
    background: "#d9534f",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
};
