import { Request, Response } from "express";
import db from "../database/connection";

export default class ConnectionsController {
  // -------- Função que lista o total de conexões feitas --------
  async index(request: Request, response: Response) {
    const totalConnections = await db("connections").count("* as total");

    const { total } = totalConnections[0];

    return response.json({ total });
  }

  // -------- Função que cria uma conexão --------
  async create(request: Request, response: Response) {
    const { user_id } = request.body;

    await db("connections").insert({
      user_id,
    });

    return response.status(201).send("Sucesso");
  }
}
