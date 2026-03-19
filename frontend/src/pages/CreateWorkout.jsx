import {useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateWorkout(){
    const [date,setDate] = useState("");
    const [remark,setRemark] = useState("");
    const [bodyParts,setBodyParts] = useState([]);
    const [selectedParts,setSelectedParts] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const navigate = useNavigate();

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios
            .get(`${API}/api/body-parts/`)
            .then((res) => {
            setBodyParts(res.data);
            })
        .catch((err) => {
            console.error(err);
            setError("Failed to load body parts");
            });
        }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null)

        try{
            // console.log(selectedParts);
            const res = await axios.post(
                `${API}/api/workouts/`,
                {
                    date,
                    remark,
                    focus_body_part_ids:selectedParts,
                }
            );

            navigate(`/workouts/${res.data.id}`);    
        } catch (err) {
            console.error(err.response?.data || err );
            setError("Failed to create workout.")
            setLoading(false)
        }
    };


return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Create Workout</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Date */}
        <div style={{ marginBottom: "15px" }}>
          <label>Date:</label>
          <br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        {/* Remark */}
        <div style={{ marginBottom: "15px" }}>
          <label>Remark:</label>
          <br />
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows="3"
            style={{ width: "100%" }}
          />
        </div>

        {/* Focus Body Parts */}
        <div style={{ marginBottom: "15px" }}>
  <label>Focus Body Parts:</label>

  <div style={{ marginTop: "8px" }}>
    {bodyParts.map((bp) => (
      <div key={bp.id}>
        <label>
          <input
            type="checkbox"
            value={bp.id}
            checked={selectedParts.includes(bp.id)}
            onChange={(e) => {
              const id = bp.id;

              if (e.target.checked) {
                setSelectedParts([...selectedParts, id]);
              } else {
                setSelectedParts(
                  selectedParts.filter((x) => x !== id)
                );
              }
            }}
          />
          {" "}
          {bp.name}
        </label>
      </div>
    ))}
  </div>
</div>
        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Workout"}
        </button>
      </form>
    </div>
)

};


export default CreateWorkout;


