// routes/workout.routes.ts
import { Request, Response, Router } from "express";
import { WorkoutController } from "../controllers";

const workoutController = new WorkoutController();
export const workoutRoutes = Router();

workoutRoutes.get(
  "/workout",
  async (req: Request, res: Response) => {
    res.send(await workoutController.getAllWorkouts());
  }
);

workoutRoutes.get("/workout/:id",  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    res.send(await workoutController.getWorkoutById(id));
  }
);

workoutRoutes.post(
  "/workout",
  async (req: Request, res: Response) => {
    const data = req.body;
    res.send(await workoutController.createWorkout(data));
  }
);

workoutRoutes.put(
  "/workout/:id",
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const data = req.body;
    res.send(await workoutController.updateWorkout(id, data));
  }
);

workoutRoutes.delete(
  "/workout/:id",
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    res.send(await workoutController.deleteWorkout(id));
  }
);
