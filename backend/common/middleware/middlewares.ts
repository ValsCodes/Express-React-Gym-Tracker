import {NextFunction, Request, Response} from "express";

export const currentDateOfExecution = (req: Request, res: Response, next: NextFunction) => {
    const date = new Date().toLocaleDateString();
    console.log(`The current date of execution of api ${req.path} is: ${date}`);
    next();
}