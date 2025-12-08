import salonImage from "../../assets/salon.jpeg";
import beautyImg from "../../assets/beauty.jpg";
import hairImg from "../../assets/hairtreatment.jpg";
import handImg from "../../assets/handtreatment.jpg";
import permImg from "../../assets/perm.jpg";
import coloringImg from "../../assets/coloring.jpg";
import haircutImg from "../../assets/haircut.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import limaPersen from "../../assets/limapersen.jpg";



export default function Pelanggan() {
  const navigate = useNavigate();
  const [paket, setPaket] = useState([]);
  const pelanggan = JSON.parse(localStorage.getItem("pelanggan"));

  useEffect(() => {
    fetch("http://localhost:7000/paket")
      .then((res) => res.json())
      .then((data) => setPaket(data))
      .catch((err) => console.error("Error fetch paket:", err));
  }, []);

  const services = [
    { id: 1, name: "Beauty", image: beautyImg },
    { id: 2, name: "Hair Treatment", image: hairImg },
    { id: 3, name: "Hand & Treatments", image: handImg },
    { id: 4, name: "Perm & Texture", image: permImg },
    { id: 5, name: "Coloring", image: coloringImg },
    { id: 6, name: "Haircut", image: haircutImg }
  ];


  const promoList = [
    { id: 1, title: "Gift Voucher 5%", desc: "Jika sudah berlanggan selama 1 bulan", image: limaPersen },
    { id: 2, title: "Gift Voucher 10%", desc: "Untuk pembelian paket smoothing", image: "/assets/salon.jpeg" },
    { id: 3, title: "New Year Voucher", desc: "Perawatan kuku premium", image: "/assets/salon.jpeg" },
    { id: 4, title: "Promo Valentine", desc: "Cerah & glowing dalam 1x perawatan", image: "/assets/salon.jpeg" },
    { id: 5, title: "Birthday Promo", desc: "Harga spesial minggu ini", image: "/assets/salon.jpeg" },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div style={styles.container}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>Edward Salon</h2>

        <ul style={styles.navList}>
          <li style={styles.navItem} onClick={() => scrollToSection("homeSection")}>Home</li>
          <li style={styles.navItem} onClick={() => scrollToSection("serviceSection")}>Service</li>
          <li style={styles.navItem} onClick={() => scrollToSection("promoSection")}>Promo</li>
          <li style={styles.navItem} onClick={() => scrollToSection("bookingSection")}>Booking</li>

          {/* Jika belum login → tampil tombol Masuk */}
          {!pelanggan && (
            <li
              style={{ ...styles.navItem, fontWeight: "700", cursor: "pointer" }}
              onClick={() => navigate("/pelanggan/login")}
            >
              Masuk
            </li>
          )}

          {/* Jika sudah login → tampil icon akun */}
          {pelanggan && (
            <li style={styles.iconAccount}>
              <MdAccountCircle
                size={36}
                onClick={() => navigate("/pelanggan/dashboard")}
                style={{ cursor: "pointer" }}
              />
            </li>
          )}

        </ul>
      </nav>


      {/* HOME SECTION */}
      <section
        id="homeSection"
        style={{
          ...styles.heroContainer,
          backgroundImage: `url(${salonImage})`
        }}
      >
        <div style={styles.heroBlur}></div>

        <h1 style={styles.headline}>Perawatan Salon Premium Untuk Kamu</h1>

        <div style={styles.heroContent}>
          <div style={styles.heroImage}></div>
        </div>
      </section>


      {/* PAKET SECTION */}
      <section id="paketSection">
        <section style={styles.carouselSection}>
          <h2 style={styles.sectionTitle}>Paket Kami</h2>

          <div style={styles.carouselContainer}>
            {paket.map((item) => (
              <div
                key={item.id_paket}
                style={styles.serviceCard}
                onClick={() => navigate(`/pelanggan/booking/${item.id_paket}`)}
              >
                <img
                  src={`http://localhost:7000/uploads/${item.image}`}
                  style={styles.serviceImage}
                />
                <p style={styles.serviceName}>{item.nama_paket}</p>
              </div>
            ))}
          </div>
        </section>
      </section>


      {/* PROMO SECTION */}
      <section id="promoSection">
        <section style={styles.promoSection}>
          <h2 style={styles.sectionTitle}>Promo Spesial</h2>

          <div style={styles.promoCarousel}>
            {promoList.map((promo) => (
              <div key={promo.id} style={styles.promoCard}>

                {/* GAMBAR DIPERBESAR */}
                <img src={promo.image} style={styles.promoImage} />

                <h3 style={styles.promoTitle}>{promo.title}</h3>
                <p style={styles.promoDesc}>{promo.desc}</p>

                {/* TOMBOL KLAIM */}
                <button
                  style={styles.ctaBtn}
                  onClick={() => alert("Promo berhasil diklaim!")}
                >
                  Klaim Promo
                </button>
              </div>
            ))}
          </div>

        </section>
      </section>

      {/* BOOKING SECTION (NEW LAYOUT LIKE MAYMAY) */}
      <section
        id="bookingSection"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "120px 60px",
          background: "#FFFFFF",
        }}
      >
        {/* LEFT TEXT */}
        <div style={{ width: "45%" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "10px" }}>
            Booking
          </h2>

          <div style={{
            width: "60px",
            height: "4px",
            background: "#C7A560",
            marginBottom: "25px"
          }} />

          <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "30px" }}>
            Kami buka setiap hari. Silakan lakukan booking agar kamu bisa
            mendapatkan slot dengan stylist atau terapis pilihanmu.
            Pilih cabang dan waktu yang sesuai untukmu.
          </p>

          <button
            onClick={() => navigate("/pelanggan/booking/:id_paket")}
            style={{
              padding: "14px 28px",
              border: "2px solid #C7A560",
              background: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              borderRadius: "8px",
              transition: "0.3s",
            }}
          >
            Booking Sekarang
          </button>

        </div>

        {/* RIGHT IMAGES */}
        <div
          style={{
            width: "50%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <img src={salonImage} style={styles.bookingImg} />
          <img src={beautyImg} style={styles.bookingImg} />
          <img src={hairImg} style={styles.bookingImg} />
          <img src={handImg} style={styles.bookingImg} />
        </div>
      </section>

      {/* FORM BOOKING SECTION */}
      <section
        id="formBooking"
        style={{
          padding: "100px 20px",
          textAlign: "center",
          background: "#F6F9FF"
        }}
      >
      </section>


    </div>
  );
}

/* ==========================
   INLINE STYLES (PREMIUM SALON THEME)
=========================== */
const styles = {
  container: {
    width: "100%",
    margin: 0,
    padding: 0,
    fontFamily: "Poppins, sans-serif",
    background: "#F6F9FF", // soft blue background
    color: "#1A1A1A",
  },

  navbar: {
    width: "100%",
    padding: "18px 50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottom: "3px solid #C7A560",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    color: "#1A1A1A",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "'Poppins', sans-serif",   // <— FONT BARU
    fontWeight: "600",                     // <— BIAR TEBAL ELEGAN
    letterSpacing: "0.5px",                // <— KESAN RAPI DAN MEWAH
  },

  logo: {
    fontSize: "26px",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#1A1A1A",
  },

  navList: {
    display: "flex",
    gap: "35px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },

  navItem: {
    cursor: "pointer",
    fontSize: "18px",
    color: "#1A1A1A",
    transition: "0.3s",
  },

  /* HERO */
  hero: {
    textAlign: "center",
    padding: "120px 20px 60px",
  },

  headline: {
    fontSize: "32px",
    marginBottom: "30px",
    fontWeight: "600",
    color: "#1A1A1A",
    zIndex: 2,        // ⭐ WAJIB BIAR MUNCUL DI DEPAN BLUR
  },

  heroContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
  },


  heroContainer: {
    position: "relative",
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingTop: "90px",

  },

  heroBlur: {
    position: "absolute",
    inset: 0,
    backdropFilter: "blur(14px)",
    background: "rgba(255, 255, 255, 0.20)",
    zIndex: 1,
  },

  heroImage: {
    width: "500px",
    height: "320px",
    backgroundImage: `url(${salonImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "14px",
    border: "4px solid #C7A560",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    zIndex: 2,
    marginBottom: "22px",
  },


  heroBtn: {
    background: "#C7A560",
    padding: "12px 25px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
    zIndex: 2,
  },

  /* SERVICE */
  carouselSection: {
    padding: "50px 20px",
    textAlign: "center",
    background: "#F6F9FF",
  },

  sectionTitle: {
    fontSize: "28px",
    marginBottom: "25px",
    color: "#1A1A1A",
    fontWeight: "600",
  },

  carouselContainer: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "20px",
    scrollBehavior: "smooth",
  },

  serviceCard: {
    minWidth: "300px",     // sebelumnya 260px
    height: "360px",       // sebelumnya 330px
    background: "#FFFFFF",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "15px",
    color: "#1A1A1A",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    border: "2px solid #E9E9E9",
    transition: "0.3s",
  },


  serviceImage: {
    width: "260px",        // lebih besar
    height: "240px",       // lebih besar
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "15px",
    border: "2px solid #C7A560",
  },


  serviceName: {
    fontSize: "18px",
    fontWeight: "600",
  },

  /* PROMO */
  promoSection: {
    padding: "50px 20px",
    background: "#F6F9FF",
    textAlign: "center",
  },

  promoCarousel: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "20px",
    scrollBehavior: "smooth",
  },

  promoCard: {
    minWidth: "260px",
    background: "white",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    border: "2px solid #E9E9E9",
  },

  promoImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  promoTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#C7A560",
  },

  promoDesc: {
    fontSize: "14px",
    opacity: 0.8,
    marginBottom: "15px",
  },

  ctaBtn: {
    background: "#C7A560",
    color: "#1A1A1A",
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
  bookingImg: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  iconAccount: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },


};
