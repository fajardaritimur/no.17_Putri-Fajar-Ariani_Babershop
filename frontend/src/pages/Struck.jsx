import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Struck() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaksi, setTransaksi] = useState(null);
  const [total, setTotal] = useState(0);
  const [bayar, setBayar] = useState(0);
  const kembali = bayar - total;

  const rupiah = (n) => `Rp ${Number(n).toLocaleString("id-ID")}`;

  useEffect(() => {
    fetch(`http://localhost:7000/transaksi/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTransaksi(data);
        setTotal((Number(data.harga) || 0) * 1000);
      })
      .catch((err) => console.error("Gagal fetch transaksi:", err));
  }, [id]);

  if (!transaksi) return <p style={{ textAlign: "center" }}>Memuat data...</p>;

  const handlePrint = () => window.print();
  const handleCancel = () => navigate(-1);

  return (
    <div
      className="print-area"
      style={{
        textAlign: "center",
        fontFamily: "monospace",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "350px",
          margin: "0 auto",
          border: "1px dashed #000",
          padding: "15px 20px",
          backgroundColor: "white",
          borderRadius: "6px",
        }}
      >
        <h2
          style={{
            fontWeight: "bold",
            marginBottom: "5px",
            letterSpacing: "1px",
          }}
        >
          FINESHYT BABERSHOP
        </h2>
        <p style={{ margin: 0 }}>New York, United Stated</p>
        <p style={{ margin: 0 }}>0821-1234-5678</p>

        <hr style={{ border: "1px dashed #000", margin: "10px 0" }} />

        {/* INFORMASI UTAMA */}
        <div
          style={{
            textAlign: "left",
            fontSize: "14px",
            lineHeight: "1.6em",
          }}
        >
          <div>
            <strong>Tanggal</strong>
            <span style={{ float: "right" }}>
              {new Date(transaksi.tgl_trans).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>

          <div>
            <strong>Waktu</strong>
            <span style={{ float: "right" }}>
              {new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>

          <div>
            <strong>Pegawai</strong>
            <span style={{ float: "right" }}>{transaksi.nama_pegawai}</span>
          </div>

          <div>
            <strong>Pelanggan</strong>
            <span style={{ float: "right" }}>{transaksi.nama_pelanggan}</span>
          </div>
        </div>

        <hr style={{ border: "1px dashed #000", margin: "10px 0" }} />

        {/* ITEM PAKET + LAYANAN */}
        <div
          style={{
            textAlign: "left",
            fontSize: "14px",
            lineHeight: "1.8em",
            marginBottom: "10px",
          }}
        >
          <div>
            {transaksi.nama_paket}
            <span style={{ float: "right" }}>
              {rupiah(Number(transaksi.harga) * 1000)}
            </span>
          </div>

          <div>Layanan: {transaksi.nama_layanan}</div>
        </div>

        <hr style={{ border: "1px dashed #000", margin: "10px 0" }} />

        {/* TOTAL BAYAR KEMBALI */}
        <div
          style={{
            textAlign: "left",
            fontSize: "14px",
            lineHeight: "2em",
          }}
        >
          <div>
            <strong>Total</strong>
            <span style={{ float: "right", fontWeight: "bold" }}>
              {rupiah(total)}
            </span>
          </div>

          <div>
            <strong>Bayar</strong>
            <span style={{ float: "right" }}>
              Rp{" "}
              <input
                type="number"
                placeholder="0"
                value={bayar}
                onChange={(e) => setBayar(Number(e.target.value))}
                style={{
                  width: "90px",
                  textAlign: "right",
                  fontFamily: "monospace",
                  border: "none",
                  borderBottom: "1px solid #ccc",
                  outline: "none",
                }}
              />
            </span>
          </div>

          <div>
            <strong>Kembali</strong>
            <span style={{ float: "right" }}>
              {rupiah(isNaN(kembali) ? 0 : kembali)}
            </span>
          </div>
        </div>

        <hr style={{ border: "1px dashed #000", margin: "10px 0" }} />

        {/* FOOTER */}
        <p style={{ fontSize: "13px", margin: "10px 0", textAlign: "center" }}>
          Terima kasih atas kunjungannya!
          <br />
          Instagram: @fineshytbitch
          <br />
          Dicetak pada {new Date().toLocaleString()}
        </p>
      </div>

      {/* BUTTON NON-PRINT */}
      <div className="no-print" style={{ marginTop: "20px" }}>
        <button
          onClick={handleCancel}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "8px 20px",
            borderRadius: "6px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Batal
        </button>
        <button
          onClick={handlePrint}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "8px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Print
        </button>
      </div>

      {/* CSS UNTUK PRINT */}
      <style>
        {`@media print {
          body * {
            visibility: hidden !important;
          }
          .print-area, .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 80mm !important;
            margin: 0 auto !important;
            background: white !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          input {
            border: none !important;
          }
        }`}
      </style>
    </div>
  );
}
