import { useState } from "react";
import axios from "axios";

function ExerciseCard({ we, refreshWorkout }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(we.notes || "");

  const handleAddSet = async () => {
    if (!weight || !reps) {
      alert("Enter weight and reps");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/sets/",
        {
          workout_exercise: we.id,
          weight: parseFloat(weight),
          reps: parseInt(reps),
        }
      );

      setWeight("");
      setReps("");
      refreshWorkout();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleUpdateNote = async () => {
  try {
    await axios.patch(
      `http://127.0.0.1:8000/api/workout-exercises/${we.id}/`,
      { notes: noteValue }
    );
    setIsEditingNote(false);
    refreshWorkout();
  } catch (err) {
    console.error(err.response?.data || err);
  }
};

  const handleDeleteExercise = async () => {
    if (!window.confirm("Delete this exercise?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/workout-exercises/${we.id}/`
      );
      refreshWorkout();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleDeleteSet = async (setId) => {
    // if (!window.confirm("Delete this set?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/sets/${setId}/`
      );
      refreshWorkout();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "18px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ margin: 0 }}>{we.exercise.name}</h3>
        

        <button
          onClick={handleDeleteExercise}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "none",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
          }}
        >
          Delete Exercise
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
  {isEditingNote ? (
    <>
      <textarea
        value={noteValue}
        onChange={(e) => setNoteValue(e.target.value)}
        rows={2}
        style={{
          width: "100%",
          padding: "6px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          fontSize: "13px",
        }}
      />

      <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
        <button
          onClick={handleUpdateNote}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "4px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save
        </button>

        <button
          onClick={() => {
            setIsEditingNote(false);
            setNoteValue(we.notes || "");
          }}
          style={{
            background: "#e5e7eb",
            border: "none",
            padding: "4px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </>
  ) : (
    <div
      onClick={() => setIsEditingNote(true)}
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        padding: "8px 10px",
        borderRadius: "6px",
        fontSize: "13px",
        color: we.notes ? "#374151" : "#9ca3af",
        cursor: "pointer",
      }}
    >
      {we.notes || "Add notes..."}
    </div>
  )}
</div>

      {/* Sets */}
      {we.sets.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          No sets added yet.
        </p>
      ) : (
        <div style={{ marginBottom: "12px" }}>
          {we.sets.map((set) => (
            <div
              key={set.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <span>
                Set {set.set_number}: {set.weight} kg × {set.reps}
              </span>

              <button
                onClick={() => handleDeleteSet(set.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Set */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          style={{
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={handleAddSet}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add Set
        </button>
      </div>
    </div>
  );
}

export default ExerciseCard;