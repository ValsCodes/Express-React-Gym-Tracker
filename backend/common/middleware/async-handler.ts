import { Request, RequestHandler, Response} from "express";

export type AsyncRouteHandler = (
    req: Request,
    res: Response
) => Promise<any>;

export const asyncHandler = (fn: AsyncRouteHandler): RequestHandler => {
    return (req: Request, res: Response) => {
        Promise.resolve(fn(req, res)).catch(error => {
            const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

            res.status(statusCode).send({
                success: false,
                message: errorMessage
            });
        });
    };
}