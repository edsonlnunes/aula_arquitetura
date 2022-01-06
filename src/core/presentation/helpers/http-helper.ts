import { Response } from "express";

export const ok = (res: Response, data: any) => {
  return res.status(200).json(data);
};

export const serverError = (res: Response) => {
  return res.status(500).json({ error: "Internal Server Error" });
};
