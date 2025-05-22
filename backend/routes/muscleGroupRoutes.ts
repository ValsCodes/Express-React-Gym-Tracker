import {Request, Response, Router} from "express";
import {MuscleGroupController} from "../controllers";
import {asyncHandler} from "../common/middleware/async-handler"

const muscleGroupController = new MuscleGroupController();
export const muscleGroupRoutes = Router();


muscleGroupRoutes.get("/muscle-group", asyncHandler(async (req: Request, res: Response) => {
    res.send(await muscleGroupController.getAllMuscleGroups());
}))

muscleGroupRoutes.get("/muscle-group/:id", asyncHandler(async (req: Request, res: Response) => {
    const id:number = Number(req.params.id);
    res.send(await muscleGroupController.getMuscleGroupById(id));
}))

muscleGroupRoutes.post("/muscle-group", asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    res.send(await muscleGroupController.createMuscleGroup(data));
}))

muscleGroupRoutes.put("/muscle-group/:id", asyncHandler(async (req: Request, res: Response) => {
    const id:number = Number(req.params.id);
    const data = req.body;
    res.send(await muscleGroupController.updateMuscleGroup(id, data));
}))

muscleGroupRoutes.delete("/muscle-group/:id", asyncHandler(async (req: Request, res: Response) => {
    const id:number = Number(req.params.id);
    res.send(await muscleGroupController.deleteMuscleGroup(id));
}))
