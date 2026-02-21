import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkoutList from "./pages/WorkoutList";
import WorkoutDetail from "./pages/WorkoutDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkoutList />} />
        <Route path="/workouts/:id" element={<WorkoutDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;