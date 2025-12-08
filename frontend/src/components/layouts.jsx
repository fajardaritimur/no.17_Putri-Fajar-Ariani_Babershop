import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div
            className="layout-container"
            style={{
                display: "flex",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#f4f6fb",
                overflow: "hidden",
            }}
        >
            {/* SIDEBAR */}
            <div
                style={{
                    width: "260px",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 10,
                    background: "#fff",
                    borderRight: "1px solid #e5e7eb",
                }}
            >
                <Sidebar />
            </div>

            {/* AREA KONTEN */}
            <div
                className="content-area"
                style={{
                    flex: 1,
                    marginLeft: "260px", // ⬅ WAJIB BIAR GA KETINDIH
                    padding: "30px",
                    overflowY: "auto",
                }}
            >
                <div
                    className="content-card"
                    style={{
                        background: "white",
                        borderRadius: "18px",
                        padding: "25px",
                        minHeight: "100%",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
