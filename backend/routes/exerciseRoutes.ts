import {Request, Response, Router} from "express";
import {ExerciseController} from "../controllers";

const exerciseGroupController = new ExerciseController();
export const exerciseRoutes = Router();


exerciseRoutes.get("/exercise", async (req: Request, res: Response) => {
    res.send(await exerciseGroupController.getAllExercises());
})

exerciseRoutes.get("/exercise/:id", async (req: Request, res: Response) => {
    const id:number = Number(req.params.id);
    res.send(await exerciseGroupController.getExerciseById(id));
})

exerciseRoutes.post("/exercise", async (req: Request, res: Response) => {
    const data = req.body;
    res.send(await exerciseGroupController.createExercise(data));
})

exerciseRoutes.put("/exercise/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    res.send(exerciseGroupController.updateExercise(id, data));
})

exerciseRoutes.delete("/exercise/:id", async (req: Request, res: Response) => {
    const id:number = Number(req.params.id);
    res.send(await exerciseGroupController.deleteExercise(id));
})
