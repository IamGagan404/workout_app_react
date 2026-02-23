import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WorkoutSummary() {
  const { id } = useParams();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
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
    <div style={{ padding: "20px", maxWidth: "800px" }}>
        

      
      <h2>Workout Summary</h2>
      <button style={{ marginTop: "20px" }}
            onClick={()=> navigate(`/`)}>
        All
      </button>

      <p><strong>Date:</strong> {workout.date}</p>
      <p><strong>Remark:</strong> {workout.remark}</p>

      <h3>Focus</h3>
      {workout.focus_body_parts.length === 0 && (
        <p>No focus specified</p>
      )}

      <ul>
        {workout.focus_body_parts.map((bp) => (
          <li key={bp.id}>{bp.name}</li>
        ))}
      </ul>

      <hr />

      <h3>Exercises</h3>

      {workout.workout_exercises.map((we) => (
        <div key={we.id} style={{ marginBottom: "20px" }}>
          <strong>{we.exercise.name}</strong>

          <ul>
            {we.sets.map((set) => (
              <li key={set.id}>
                Set {set.set_number}: {set.weight} kg × {set.reps}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <hr />

      <h3>Totals</h3>
      <p>Total Sets: {totalSets}</p>
      <p>Total Volume: {totalVolume} kg</p>
    </div>
  );
}

export default WorkoutSummary;