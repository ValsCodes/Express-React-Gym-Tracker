import {Request, Response, Router} from "express";
import {WorkoutController} from "../controllers";

const workoutController = new WorkoutController();
export const workoutRoutes = Router();


workoutRoutes.get("/workout", async (req: Request, res: Response) => {
    res.send(await workoutController.getAllWorkingSets());
})

workoutRoutes.get("/workout/:id", async (req: Request, res: Response) => {
    const id:number = Number(req.params.id);
    res.send(await workoutController.getWorkingSetById(id));
})

workoutRoutes.post("/workout", async (req: Request, res: Response) => {
    const data = req.body;
    res.send(await workoutController.createWorkingSet(data));
})

workoutRoutes.put("/workout/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    res.send(workoutController.updateWorkingSet(id, data));
})

workoutRoutes.delete("/workout/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    res.send(await workoutController.deleteWorkingSet(id));
})
