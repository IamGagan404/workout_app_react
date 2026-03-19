import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function WorkoutSummary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/workouts/${id}/`)
      .then((res) => {
        setWorkout(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!workout) return <p>Workout not found</p>;

  // Compute totals
  let totalSets = 0;
  let totalVolume = 0;

  workout.workout_exercises.forEach((we) => {
    we.sets.forEach((set) => {
      totalSets += 1;
      totalVolume += set.weight * set.reps;
    });
  });

  return (
    <div>
      {/* Header Card */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          Workout Summary — {workout.date}
        </h2>

        <p style={{ color: "#6b7280" }}>
          {workout.remark || "No remark"}
        </p>

        {/* Focus Tags */}
        <div style={{ marginTop: "12px" }}>
          {workout.focus_body_parts.map((bp) => (
            <span
              key={bp.id}
              style={{
                background: "#e0f2fe",
                color: "#0369a1",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                marginRight: "6px",
              }}
            >
              {bp.name}
            </span>
          ))}
        </div>

        {/* Totals */}
        <div style={{ marginTop: "16px" }}>
          <strong>Total Sets:</strong> {totalSets}
          <br />
          <strong>Total Volume:</strong> {totalVolume} kg
        </div>
        <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
            <button
            onClick={() => navigate(`/workouts/${id}`)}
            style={{
            marginTop: "16px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
          >
          Edit Workout
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          Back to Workouts
        </button>
        </div>
      </div>

      {/* Exercises Summary */}
      <h3 style={{ marginBottom: "12px" }}>Exercises</h3>

      {workout.workout_exercises.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          No exercises added.
        </p>
      ) : (
        workout.workout_exercises.map((we) => (
          <div
            key={we.id}
            style={{
              background: "white",
              padding: "18px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              marginBottom: "16px",
            }}
          >
            <h4 style={{ marginBottom: "6px" }}>
              {we.exercise.name}
            </h4>

            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "13px",
                color: we.notes ? "#374151" : "#9ca3af",
                marginBottom: "10px",
              }}
            >
              {we.notes || "No notes"}
            </div>

            {we.sets.length === 0 ? (
              <p style={{ color: "#6b7280" }}>
                No sets recorded.
              </p>
            ) : (
              <ul style={{ paddingLeft: "18px" }}>
                {we.sets.map((set) => (
                  <li key={set.id}>
                    Set {set.set_number}: {set.weight} kg × {set.reps}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default WorkoutSummary;