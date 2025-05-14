// routes/working-set.routes.ts
import { Request, Response, Router } from "express";
import { WorkingSetController } from "../controllers";

const workingSetController = new WorkingSetController();
export const workingSetRoutes = Router();

workingSetRoutes.get(
  "/working-set",
  async (req: Request, res: Response) => {
    res.send(await workingSetController.getAllWorkingSets());
  }
);

workingSetRoutes.get(
  "/working-set/:id",
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    res.send(await workingSetController.getWorkingSetById(id));
  }
);

workingSetRoutes.post(
  "/working-set",
  async (req: Request, res: Response) => {
    const data = req.body;
    res.send(await workingSetController.createWorkingSet(data));
  }
);

workingSetRoutes.put(
  "/working-set/:id",
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const data = req.body;
    res.send(await workingSetController.updateWorkingSet(id, data));
  }
);

workingSetRoutes.delete(
  "/working-set/:id",
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    res.send(await workingSetController.deleteWorkingSet(id));
  }
);
