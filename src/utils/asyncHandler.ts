import { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError";

const asyncHandler =
  (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err: any) {
      if (err instanceof ApiError) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        const errorResponse = {
          success: false,
          message: message,
        };

        res.status(statusCode).json(errorResponse);
      }
    }
  };

export default asyncHandler;
