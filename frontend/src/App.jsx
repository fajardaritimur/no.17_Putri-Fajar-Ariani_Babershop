import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layouts";

// ADMIN PAGES
import Home from "./pages/Home";
import Pengguna from "./pages/Pengguna";
import Paket from "./pages/Paket";
import Pegawai from "./pages/Pegawai";
import AddPengguna from "./pages/AddPengguna";
import EditPengguna from "./pages/EditPengguna";
import AddPaket from "./pages/AddPaket";
import EditPaket from "./pages/EditPaket";
import EditPegawai from "./pages/EditPegawai";
import AddPegawai from "./pages/AddPegawai";
import Transaksi from "./pages/Transaksi";
import AddTransaksi from "./pages/AddTransaksi";
import Struck from "./pages/Struck";
import AdminPelanggan from "./pages/AdminPelanggan";
import AddPelanggan from "./pages/AddPelanggan";
import Layanan from "./pages/Layanan";
import AddLayanan from "./pages/AddLayanan";
import EditLayanan from "./pages/EditLayanan";
import Dashboard from "./pages/pelanggan/Dashboard";


// AUTH
import Login from "./pages/Login";

// PELANGGAN PAGES
import LoginPelanggan from "./pages/pelanggan/LoginPelanggan";
import Register from "./pages/pelanggan/Register";
import Pelanggan from "./pages/pelanggan/Pelanggan";
import Booking from "./pages/pelanggan/Booking";
// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children;
}

function ProtectedPelanggan({ children }) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    return <Navigate to="/pelanggan/login" replace />;
  }
  return children;
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========== LOGIN ADMIN (PUBLIC) ========== */}
        <Route path="/login" element={<Login />} />

        {/* ========== LOGIN + REGISTER PELANGGAN (PUBLIC) ========== */}
        <Route path="/pelanggan/login" element={<LoginPelanggan />} />
        <Route path="/pelanggan/register" element={<Register />} />

        {/* ========== HALAMAN PELANGGAN (TANPA SIDEBAR) ========== */}
        <Route path="/pelanggan" element={<Pelanggan />} />
        <Route path="/pelanggan/booking/:id_paket" element={<Booking />} />
        <Route
          path="/pelanggan/dashboard"
          element={
            <ProtectedPelanggan>
              <Dashboard />
            </ProtectedPelanggan>
          }
        />

        {/* ========== ADMIN PANEL (ADA SIDEBAR) ========== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />

          <Route path="user" element={<Pengguna />} />
          <Route path="paket" element={<Paket />} />
          <Route path="pegawai" element={<Pegawai />} />
          <Route path="transaksi" element={<Transaksi />} />

          <Route path="struck/:id" element={<Struck />} />

          <Route path="pengguna/tambah" element={<AddPengguna />} />
          <Route path="pengguna/edit/:id" element={<EditPengguna />} />

          <Route path="paket/tambah" element={<AddPaket />} />
          <Route path="paket/edit/:id" element={<EditPaket />} />

          <Route path="pegawai/tambah" element={<AddPegawai />} />
          <Route path="pegawai/edit/:id" element={<EditPegawai />} />

          <Route path="transaksi/tambah" element={<AddTransaksi />} />
          <Route path="adminpelanggan" element={<AdminPelanggan />} />
          <Route path="adminpelanggan/tambah" element={<AddPelanggan />} />

          <Route path="layanan" element={<Layanan />} />

          <Route path="layanan/tambah" element={<AddLayanan />} />
          <Route path="layanan/edit/:id" element={<EditLayanan />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}
