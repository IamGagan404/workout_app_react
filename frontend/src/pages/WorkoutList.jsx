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
        <div style={{padding: "20px"}}>
            <h1>Workouts</h1>

            {workouts.length === 0 && <p>No wotkouts to display.</p>}

            <ul>
                {workouts.map((workout) =>(
                    <li key={workout.id}>
                        <Link to={`/workouts/${workout.id}`}>
                            {workout.date}
                        </Link>
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default WorkoutList;



