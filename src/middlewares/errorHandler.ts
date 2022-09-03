import { NextFunction, Request, Response } from "express";

export default function errorHandler (error: any, req: Request, res: Response, next: NextFunction) {
  
  if (error.type === "not_found") return res.status(404).send(error.message);
  if (error.type === "bad_request") return res.status(400).send(error.message);
  if (error.type === "not_acceptable") return res.status(406).send(error.message);
  
  
  res.sendStatus(500); // internal server error
}