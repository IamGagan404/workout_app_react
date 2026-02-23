import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ExerciseCard from "../componenets/ExerciseCard";
import { useNavigate } from "react-router-dom";


function WorkoutDetail(){
    const { id } = useParams()
    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);

    const [exercises, setExercises] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState("")
    const [notes,setNotes] = useState("")

    const navigate = useNavigate();

    const fetchWorkout = ()=>{
        axios.get(`http://127.0.0.1:8000/api/workouts/${id}/`)
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
      axios
        .get("http://127.0.0.1:8000/api/exercises/")
        .then((res) => setExercises(res.data))
        .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
      fetchWorkout();
    }, [id]);

    const handleAddExercise = async () => {
    if (!selectedExercise) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/workout-exercises/",
        {
          workout: Number(id),
          exercise_id: parseInt(selectedExercise),
          order_index: workout.workout_exercises.length + 1,
          notes: notes,
        }
      );
      console.log(workout);

      setSelectedExercise("");
      setNotes("");

      fetchWorkout(); // refresh state
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };


  if (loading) return <p>Loading...</p>;
  if (!workout) return <p>Workout not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Workout on {workout.date}</h2>
      <p>{workout.remark}</p>

      <h3>Focus</h3>
      
      <ul>
        {workout.focus_body_parts.map((bp) => (
          <li key={bp.id}>{bp.name}</li>
        ))}
      </ul>

      <hr />

      <h3>Add Exercise</h3>

      <select
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
      >
        <option value="">Select exercise</option>
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleAddExercise}>
        Add Exercise
      </button>

      <button style={{ marginTop: "20px" }}
      onClick={()=> navigate(`/workouts/${id}/summary`)}>
        Done
      </button>

      <hr />

      <h3>Exercises</h3>

      {workout.workout_exercises.length === 0 && (
        <p>No exercises added yet.</p>
      )}

      {workout.workout_exercises.map((we) => (
        <ExerciseCard
          key={we.id}
          we={we}
          refreshWorkout={fetchWorkout}
        />
      ))}

    </div>
  );
}

export default WorkoutDetail;