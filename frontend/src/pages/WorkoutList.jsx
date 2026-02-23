import axios from "axios"
import {useEffect,useState} from "react"
import {Link} from 'react-router-dom'


function WorkoutList(){
    const [workouts, setWorkouts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
            axios.get('http://127.0.0.1:8000/api/workouts')
            .then((res)=>{
                setWorkouts(res.data);
                setLoading(false);
            })
            .catch((err)=>{
                console.log(err);
                setLoading(false);
            });
        },[]);
    
    if (loading) return <p> Loading </p>
    
    return(
        <div>
        <Link to="/create/">
            <button> Create Workout </button>
        </Link>

        <div style={{padding: "20px"}}>
            <h1>Workouts</h1>

            {workouts.length === 0 && <p>No wotkouts to display.</p>}

            <ul>
                {workouts.map((workout) =>(
                    <li key={workout.id}>
                        <div><Link to={`/workouts/${workout.id}`}>
                            {workout.date}
                        </Link>
                        <p style={{ alignItems: "flex-start"}} >{workout.remark}</p>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
        </div>
    )
}

export default WorkoutList;



