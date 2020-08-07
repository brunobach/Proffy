"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
class ConnectionsController {
    // -------- Função que lista o total de conexões feitas --------
    async index(request, response) {
        const totalConnections = await connection_1.default("connections").count("* as total");
        const { total } = totalConnections[0];
        return response.json({ total });
    }
    // -------- Função que cria uma conexão --------
    async create(request, response) {
        const { user_id } = request.body;
        await connection_1.default("connections").insert({
            user_id,
        });
        return response.status(201).send("Sucesso");
    }
}
exports.default = ConnectionsController;
