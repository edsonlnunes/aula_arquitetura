import { Response } from "express";

/**
 * Este arquivo contém funções helpers que vão auxiliar e facilitar
 * a leitura e a nossa aplicação.
 *
 * Aqui vamos definir, basicamente os tipos de retornos que vamos ter nos controllers
 */

export const ok = (res: Response, data: any) => {
  return res.status(200).json(data);
};

export const serverError = (res: Response) => {
  return res.status(500).json({ error: "Internal Server Error" });
};

export const notFound = (res: Response) => {
  return res.status(404).json({ error: "Data not found" });
};
