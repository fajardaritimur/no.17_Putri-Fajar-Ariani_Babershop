import { Link } from "react-router-dom";

export default function Home() {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body bg-light p-4">
          <h2 className="fw-bold text-primary mb-2">
            ✂️ FINESHYT SALON
          </h2>
          <h5 className="fw-semibold text-dark mb-3">
            Where your hair levels up, and your confidence goes max power 🚀
          </h5>

          <p className="mb-1">
            📅 Today: <strong>{today}</strong>
          </p>
          <hr />
          <p className="text-muted">
            Choose a menu below and start managing data like a boss.
          </p>
        </div>
      </div>

      {/* MENU */}
      <div className="row g-4">

        {/* CARD COMPONENT */}
        {[
          { title: "Transaksi", text: "View and manage all transactions.", link: "/transaksi", color: "primary", icon: "💵" },
          { title: "Paket", text: "Manage available service packages.", link: "/paket", color: "success", icon: "📦" },
          { title: "Pegawai", text: "Registered barbers & staff list.", link: "/pegawai", color: "warning", icon: "🧑‍🔧" },
          { title: "Pengguna", text: "Manage system user accounts.", link: "/user", color: "info", icon: "👤" },

          // ⭐ CARD PELANGGAN ADMIN BARU
          {
            title: "Pelanggan",
            text: "Manage registered salon customers.",
            link: "/adminpelanggan",
            color: "secondary",       // Warna ungu (Bootstrap 'secondary')
            icon: "🧑‍🤝‍🧑"
          }
        ].map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className={`card text-center shadow-sm border-${item.color} menu-card h-100`}>
              <div className="card-body">
                <div className="display-6">{item.icon}</div>
                <h5 className="card-title fw-bold mt-2">{item.title}</h5>
                <p className="card-text small text-muted">{item.text}</p>
                <Link to={item.link} className={`btn btn-${item.color} mt-2 text-white`}>
                  Open
                </Link>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* SMALL STYLE BOOST */}
      <style>{`
        .menu-card {
          transition: 0.25s ease-in-out;
          cursor: pointer;
        }
        .menu-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
