import {Request, Response, Router} from "express";
import {MuscleGroupController} from "../controllers";

const muscleGroupController = new MuscleGroupController();
export const muscleGroupRoutes = Router();


muscleGroupRoutes.get("/muscle-group", async (req: Request, res: Response) => {
    res.send(await muscleGroupController.getAllMuscleGroups());
})

muscleGroupRoutes.get("/muscle-group/:id", async (req: Request, res: Response) => {
    const id:number = Number(req.params.id);
    res.send(await muscleGroupController.getMuscleGroupById(id));
})

muscleGroupRoutes.post("/muscle-group", async (req: Request, res: Response) => {
    const data = req.body;
    res.send(await muscleGroupController.createMuscleGroup(data));
})

muscleGroupRoutes.put("/muscle-group/:id", async (req: Request, res: Response) => {
    const id:number = Number(req.params.id);
    const data = req.body;
    res.send(await muscleGroupController.updateMuscleGroup(id, data));
})

muscleGroupRoutes.delete("/muscle-group/:id", async (req: Request, res: Response) => {
    const id:number = Number(req.params.id);
    res.send(await muscleGroupController.deleteMuscleGroup(id));
})
