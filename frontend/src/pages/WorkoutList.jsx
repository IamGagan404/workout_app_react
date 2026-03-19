import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFocusBodyParts = (wk) => {
    return wk.focus_body_parts.map(bp => bp.name).join(" • ");
  };

  const API = import.meta.env.VITE_APP_URL

  const colorMap = {
  Chest: "#fecaca",
  Back: "#bfdbfe",
  Legs: "#bbf7d0",
  Shoulders: "#fde68a",
  Arms: "#ddd6fe",
};
  const fetchWorkouts = () => {
    axios
      .get(`${API}/api/workouts/`)
      .then((res) => {
        setWorkouts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Workouts</h2>

      {workouts.length === 0 && <p>No workouts yet.</p>}

      {workouts.map((workout) => (
        <div
          key={workout.id}
          style={{
            background: "white",
            padding: "16px 20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side */}
          <div>
            <Link
              to={`/workouts/${workout.id}`}
              style={{
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                color: "#111827",
              }}
            >
              {workout.date}
            </Link>

              <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
  {workout.focus_body_parts.map((bp) => (
    <span
      key={bp.id}
      style={{
        background: colorMap[bp.name] || "#e5e7eb",
        color: "#374151",
        fontSize: "12px",
        padding: "4px 8px",
        borderRadius: "999px",
        fontWeight: "500",
      }}
    >
      {bp.name}
    </span>
  ))}
</div>


            <p
              style={{
                margin: "4px 0 0 0",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              {workout.remark || "No remark"}
            </p>
          </div>

          {/* Right side */}
          <button
            onClick={async () => {
              if (!window.confirm("Delete this workout?")) return;

              try {
                await axios.delete(
                  `${API}/api/workouts/${workout.id}/`
                );
                fetchWorkouts();
              } catch (err) {
                console.error(err.response?.data || err);
              }
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default WorkoutList;