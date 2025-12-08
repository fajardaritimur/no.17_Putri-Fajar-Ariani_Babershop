import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Booking() {
    const navigate = useNavigate();
    const { id_paket } = useParams();


    const [paket, setPaket] = useState(null);
    const [layanan, setLayanan] = useState([]);
    const [selectedLayanan, setSelectedLayanan] = useState("");
    const [tanggal, setTanggal] = useState("");


    const [pelanggan, setPelanggan] = useState({
        nama: "",
        email: "",
        no_hp: "",
    });

    // ======================
    // FETCH PAKET
    // ======================
    const getPaket = async () => {
        const res = await fetch(`http://localhost:7000/paket/${id_paket}`);
        const data = await res.json();
        setPaket(data);
    };

    // ======================
    // FETCH LAYANAN BERDASARKAN PAKET
    // ======================
    const getLayanan = async () => {
        const res = await fetch(`http://localhost:7000/layanan/paket/${id_paket}`);
        const data = await res.json();
        setLayanan(data);
    };

    // ======================
    // FETCH DATA PELANGGAN LOGIN
    // ======================
    useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("pelanggan"));
    if (!profile) return navigate("/pelanggan/login");

    setPelanggan({
        nama: profile.nama_pelanggan,   // perbaikan paling penting
        email: profile.email,
        no_hp: profile.no_hp,
        id_pelanggan: profile.id_pelanggan
    });
}, []);


    useEffect(() => {
        if (id_paket) {
            getPaket();
            getLayanan();
        }
    }, [id_paket]);

    // ======================
    // HANDLE SUBMIT BOOKING
    // ======================
const handleBooking = async () => {
    if (!selectedLayanan || !tanggal) {
        alert("Lengkapi semua field!");
        return;
    }

    const body = {
        id_pelanggan: pelanggan.id_pelanggan,   // WAJIB
        id_paket: id_paket,                     // WAJIB
        id_layanan: selectedLayanan,            // WAJIB
        tanggal: tanggal                        // WAJIB
    };

    console.log("KIRIM:", body);

    const res = await fetch("http://localhost:7000/transaksi/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const result = await res.json();

    if (!res.ok) {
        alert("Gagal booking: " + result.message);
        return;
    }

    alert("Booking berhasil!");
    navigate("/pelanggan");
};

    return (
        <div style={styles.container}>

            {/* LEFT (PAKET IMAGE) */}
            <div style={styles.left}>
                <img
                    src={
                        paket?.image
                            ? `http://localhost:7000/uploads/${paket.image}`
                            : "/fallback.jpg" // gambar default
                    }
                    style={styles.serviceImage}
                />


                <h2 style={styles.serviceTitle}>{paket?.nama_paket}</h2>
            </div>

            {/* RIGHT (BOOKING FORM) */}
            <div style={styles.right}>
                <h2 style={styles.formTitle}>Booking Layanan</h2>

                <label style={styles.label}>Nama</label>
                <input
                    type="text"
                    value={pelanggan.nama}
                    onChange={(e) =>
                        setPelanggan({ ...pelanggan, nama: e.target.value })
                    }
                    style={styles.input}
                />

                <label style={styles.label}>Email</label>
                <input
                    type="text"
                    value={pelanggan.email}
                    onChange={(e) =>
                        setPelanggan({ ...pelanggan, email: e.target.value })
                    }
                    style={styles.input}
                />

                <label style={styles.label}>No HP</label>
                <input
                    type="text"
                    value={pelanggan.no_hp}
                    onChange={(e) =>
                        setPelanggan({ ...pelanggan, no_hp: e.target.value })
                    }
                    style={styles.input}
                />

                <label style={styles.label}>Paket</label>
                <input
                    type="text"
                    value={paket?.nama_paket}
                    readOnly     // ❌ Tidak bisa diedit
                    style={styles.input}
                />


                <label style={styles.label}>Pilih Layanan</label>
                <select
                    style={styles.input}
                    value={selectedLayanan}
                    onChange={(e) => setSelectedLayanan(e.target.value)}
                >
                    <option value="">-- pilih layanan --</option>
                    {layanan.map((item) => (
                        <option key={item.id_layanan} value={item.id_layanan}>
                            {item.nama_layanan}
                        </option>
                    ))}
                </select>

                <label style={styles.label}>Tanggal Booking</label>
                <input
                    type="date"
                    style={styles.input}
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                />

                <button style={styles.bookingBtn} onClick={handleBooking}>
                    Booking Sekarang
                </button>
            </div>

        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        minHeight: "100vh",
        padding: "50px",
        display: "flex",
        gap: "40px",
        background: "#F2F4F7",
        position: "relative",
    },

    left: {
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    serviceImage: {
        width: "90%",
        height: "350px",
        borderRadius: "12px",
        objectFit: "cover",
        background: "#ddd",
    },

    serviceTitle: {
        marginTop: "20px",
        fontSize: "26px",
        fontWeight: "600",
    },

    right: {
        width: "50%",
        padding: "20px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },

    formTitle: {
        fontSize: "24px",
        marginBottom: "20px",
        fontWeight: "600",
    },

    label: {
        marginTop: "10px",
        fontSize: "16px",
        display: "block",
    },

    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "4px",
        marginBottom: "10px",
    },

    bookingBtn: {
        width: "100%",
        padding: "14px",
        background: "#C7A560",
        color: "black",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "10px",
    },

    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#d9d9d9",
        padding: "25px 0",
        textAlign: "center",
    },

    footerText: {
        fontSize: "30px",
        fontWeight: "700",
    },
};
