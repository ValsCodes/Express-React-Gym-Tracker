import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigation } from "./components";
import {
  ExerciseManager,
  Home,
  MuscleGroupManager,
  NotFound,
  WorkingSetManager,
  WorkoutManager,
} from "./pages";

import "./App.scss";

import "@shoelace-style/shoelace/dist/themes/light.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/"
);

function App() {

  return (
    <BrowserRouter>
      <Navigation />
      <div id="container">
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/exercise"} element={<ExerciseManager/>} />
          <Route path={"/workout"} element={<WorkoutManager />} />
          <Route path={"/muscle-group"} element={<MuscleGroupManager />} />
          <Route path={"/workout/:id/working-set"} element={<WorkingSetManager />} />
          <Route path={"*"} element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
