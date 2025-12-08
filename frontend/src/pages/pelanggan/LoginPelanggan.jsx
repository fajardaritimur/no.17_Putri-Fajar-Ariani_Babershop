import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPelanggan() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            alert("Email dan password harus diisi");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:7000/loginpelanggan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);

                // simpan data pelanggan lengkap
                localStorage.setItem("pelanggan", JSON.stringify(data.pelanggan));

                // ‼ BAGIAN PALING PENTING ‼
                localStorage.setItem("userId", data.pelanggan.id_pelanggan);

                alert("Login berhasil!");
                navigate("/pelanggan");
            } else {
                alert(data.message || "Login gagal!");
            }

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan server");
        }
        setLoading(false);
    };

    return (
        <>
            <style>{`
                body {
                    background: linear-gradient(to bottom, #b7e2ff, #eaf7ff);
                    height: 100vh;
                    margin: 0;
                    font-family: 'Segoe UI', sans-serif;
                }

                .login-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    padding: 20px;
                }

                .login-card {
                    width: 380px;
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                    padding: 30px;
                    border-radius: 18px;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                    text-align: center;
                }

                .login-icon {
                    background: white;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto 15px;
                    border-radius: 16px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    font-size: 24px;
                }

                .input-field {
                    width: 100%;
                    padding: 12px 14px;
                    margin-top: 12px;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                    outline: none;
                    font-size: 15px;
                    transition: 0.2s;
                }

                .input-field:focus {
                    border-color: #4a8bff;
                    box-shadow: 0 0 4px rgba(74,139,255,0.4);
                }

                .login-btn {
                    background: #257CFF;
                    border: none;
                    width: 100%;
                    margin-top: 18px;
                    padding: 12px;
                    color: white;
                    font-size: 16px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: 0.2s;
                }

                .login-btn:hover {
                    background: #0b6aff;
                }

                .copyright {
                    margin-top: 20px;
                    color: #555;
                    font-size: 14px;
                }
            `}</style>

            <div className="login-wrapper">
                <div className="login-card">

                    <div className="login-icon">🔐</div>

                    <h2>Login</h2>
                    <p>Please login to continue</p>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="input-field"
                            onChange={handleChange}
                            value={formData.email}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="input-field"
                            onChange={handleChange}
                            value={formData.password}
                        />

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "Loading..." : "Sign In"}
                        </button>
                    </form>

                    <div className="copyright">
                        © 2017–2025 FINESHYT
                    </div>
                    <p style={{ marginTop: "15px" }}>
                        Belum punya akun?
                        <span
                            onClick={() => navigate("/pelanggan/register")}
                            style={{ color: "#0b6aff", cursor: "pointer", fontWeight: "600" }}
                        >
                            &nbsp;Daftar di sini
                        </span>
                    </p>

                </div>
            </div>
        </>
    );
}
