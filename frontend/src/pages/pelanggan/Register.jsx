import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_pelanggan: "",
    email: "",
    password: "",
    no_hp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:7000/pelanggan/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Gagal mendaftar");
        return;
      }

      alert("Registrasi berhasil! Silakan login.");
      navigate("/pelanggan");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Please enter your details to register.</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleRegister} style={styles.form}>

          <div className="mb-3">
                    <label className="form-label">Nama Pelanggan</label>
                    <input
                        type="text"
                        name="nama_pelanggan"
                        value={formData.nama_pelanggan}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan Nama"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan username"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan email"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan password"
                        required
                    />
                </div>

                <div className="mb-3">
                        <label className="form-label">No Hp</label>
                        <input 
                        type="text"
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukan No Hp"
                        required
                        />
                    </div>


          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Registering..." : "Daftar"}
          </button>

          <p style={styles.bottomText}>
            Sudah punya akun?{" "}
            <a href="/pelanggan/login" style={styles.link}>
              Login di sini
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  background: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background:
      "linear-gradient(135deg, rgba(110,159,255,0.95), rgba(171,206,255,0.95), rgba(198,174,255,0.95))",
  },

  card: {
    width: "100%",
    maxWidth: "600px",           // ❗ CARD DILEBARKAN
    background: "#ffffff",
    padding: "26px 32px",        // ❗ PADDING DIPERKECIL
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
    textAlign: "left",

    transform: "scale(0.85)",    // ❗ CARD DIPERKECIL (INI KUNCI NYA)
    transformOrigin: "top center",
  },

  title: {
    textAlign: "center",
    fontSize: "20px",            // ❗ DIPERKECIL
    fontWeight: "700",
    marginBottom: "4px",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    fontSize: "13px",            // ❗ DIPERKECIL
    marginBottom: "18px",
  },

  label: {
    fontSize: "13px",            // ❗ DIPERKECIL
    marginBottom: "3px",
    marginTop: "6px",
    color: "#333",
    display: "block",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  input: {
    padding: "10px 12px",         // ❗ INPUT DIPERKECIL
    marginBottom: "4px",
    borderRadius: "10px",
    border: "1px solid #e5e5e5",
    fontSize: "14px",             // ❗ FONT DIPERKECIL
    background: "#fafafa",
    height: "38px",               // ❗ LEBIH TIPIS
  },

  button: {
    padding: "10px",              // ❗ DIPERKECIL
    background: "#5A67F2",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",             // ❗ DIPERKECIL
    marginTop: "14px",
    height: "42px",               // ❗ TOMBOL TIDAK GEDE
  },

  bottomText: {
    textAlign: "center",
    marginTop: "16px",
    color: "#666",
    fontSize: "13px",             // ❗ DIPERKECIL
  },

  link: {
    color: "#5A67F2",
    fontWeight: "600",
    textDecoration: "none",
    fontSize: "13px",             // ❗ DIPERKECIL
  },

  error: {
    padding: "8px",
    background: "#ffe5e5",
    color: "#cc0000",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "13px",             // ❗ DIPERKECIL
    textAlign: "center",
  },
};
