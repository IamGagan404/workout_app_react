import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


function WorkoutDetail(){
    const { id } = useParams()
    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api/workouts/${id}/`)
        .then((res) => {
            setWorkout(res.data);
            setLoading(false);   
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    },[id]);


    if (loading) return <p>Loading...</p>;
  if (!workout) return <p>Workout not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Workout on {workout.date}</h2>
      <p>{workout.remark}</p>

      <h3>Exercises</h3>

      {workout.workout_exercises.map((we) => (
        <div key={we.id} style={{ marginBottom: "20px" }}>
          <strong>Order: {we.order_index}</strong>
          <p>Exercise Name: {we.exercise.name}</p>

          <ul>
            {we.sets.map((set) => (
              <li key={set.id}>
                Set {set.set_number}: {set.weight} kg × {set.reps}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default WorkoutDetail;













