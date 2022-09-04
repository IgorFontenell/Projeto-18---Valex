import { Request, Response } from "express";
import { creatCardService, activateCardService } from "../services/cardService";

export async function createCard(request: Request, response: Response) {
    const API_KEY: any = request.headers["x-api-key"]; // Getting the API key
    await creatCardService(API_KEY, request.body);
    

    response.status(201).send("Card registered successfully");
};

export async function activateCard (request: Request, response: Response) {
    await activateCardService(request.body);

    response.status(202).send("Card activated successfully");
}