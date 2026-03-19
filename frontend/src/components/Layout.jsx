import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      <nav
        style={{
          background: "white",
          padding: "15px 30px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold", fontSize: "18px" }}>
          Workout Tracker
        </Link>

        <Link
  to="/create"
  style={{
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "500",
    transition: "0.2s ease",
  }}
  onMouseOver={(e) =>
    (e.target.style.backgroundColor = "#1d4ed8")
  }
  onMouseOut={(e) =>
    (e.target.style.backgroundColor = "#2563eb")
  }
>
New Workout
</Link>
      </nav>

      <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;