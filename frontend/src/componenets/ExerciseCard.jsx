import { useState } from "react";
import axios from "axios";


function ExerciseCard({ we, refreshWorkout }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const handleAddSet = async () => {
    if (!weight || !reps) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/sets/",
        {
          workout_exercise: we.id,
          weight: parseFloat(weight),
          reps: parseInt(reps),
        }
      );

      refreshWorkout();
      setWeight("");
      setReps("");
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <strong>{we.exercise.name}</strong>
      <p>{we.notes}</p>

      <ul>
        {we.sets.map((set) => (
          <li key={set.id}>
            Set {set.set_number}: {set.weight} kg × {set.reps}
          </li>
        ))}
      </ul>

      <input
        type="number"
        placeholder="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />

      <button onClick={handleAddSet}>
        Add Set
      </button>
    </div>
  );
}

export default ExerciseCard;