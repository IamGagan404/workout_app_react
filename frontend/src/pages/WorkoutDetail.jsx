import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ExerciseCard from "../components/ExerciseCard";

function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [notes, setNotes] = useState("");

  const fetchWorkout = () => {
    axios
      .get(`http://127.0.0.1:8000/api/workouts/${id}/`)
      .then((res) => {
        setWorkout(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWorkout();

    axios
      .get("http://127.0.0.1:8000/api/exercises/")
      .then((res) => setExercises(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddExercise = async () => {
    if (!selectedExercise) {
      alert("Select an exercise");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/workout-exercises/",
        {
          workout: Number(id),
          exercise_id: parseInt(selectedExercise),
          order_index: workout.workout_exercises.length + 1,
          notes,
        }
      );

      setSelectedExercise("");
      setNotes("");
      fetchWorkout();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!workout) return <p>Workout not found</p>;

  return (
    <div>
      {/* Header */}
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
          Workout on {workout.date}
        </h2>

        <p style={{ color: "#6b7280" }}>
          {workout.remark || "No remark"}
        </p>

        {/* Focus Body Parts */}
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

        <button
          onClick={() => navigate(`/workouts/${id}/summary`)}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          Done
        </button>
      </div>

      {/* Add Exercise Card */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginBottom: "12px" }}>Add Exercise</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              flex: 1,
            }}
          >
            <option value="">Select exercise</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              flex: 2,
            }}
          />

          <button
            onClick={handleAddExercise}
            style={{
              padding: "6px 14px",
              borderRadius: "4px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Exercises */}
      <h3 style={{ marginBottom: "10px" }}>Exercises</h3>

      {workout.workout_exercises.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          No exercises added yet.
        </p>
      ) : (
        workout.workout_exercises.map((we) => (
          <ExerciseCard
            key={we.id}
            we={we}
            refreshWorkout={fetchWorkout}
          />
        ))
      )}
    </div>
  );
}

export default WorkoutDetail;