import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkoutList from "./pages/WorkoutList";
import WorkoutDetail from "./pages/WorkoutDetail";
import CreateWorkout from "./pages/CreateWorkout";
import WorkoutSummary from "./pages/WorkoutSummary";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkoutList />} />
        <Route path="/workouts/:id" element={<WorkoutDetail />} />
        <Route path="/create" element={<CreateWorkout />} />
        <Route path="workouts/:id/summary" element={<WorkoutSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;