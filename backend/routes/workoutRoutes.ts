// routes/workout.routes.ts
import { Request, Response, Router } from "express";
import { WorkoutController, WorkingSetController } from "../controllers";
import {asyncHandler} from "../common/middleware/async-handler"

const workoutController = new WorkoutController();
const workingSetController = new WorkingSetController();
export const workoutRoutes = Router();

workoutRoutes.get(
  "/workout",
  asyncHandler(async (req: Request, res: Response) => {
    res.send(await workoutController.getAllWorkouts());
  }
));

workoutRoutes.get("/workout/:id",  asyncHandler(async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    res.send(await workoutController.getWorkoutById(id));
  }
));

workoutRoutes.get("/workout/:id/working-sets",  asyncHandler(async (req: Request, res: Response) => {
    const workoutId = Number(req.params.id);
    res.send(await workingSetController.getByWorkoutId(workoutId));
  }
));

workoutRoutes.post(
  "/workout",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    res.send(await workoutController.createWorkout(data));
  }
));

workoutRoutes.put(
  "/workout/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const data = req.body;
    res.send(await workoutController.updateWorkout(id, data));
  }
));

workoutRoutes.delete(
  "/workout/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    res.send(await workoutController.deleteWorkout(id));
  }
));
