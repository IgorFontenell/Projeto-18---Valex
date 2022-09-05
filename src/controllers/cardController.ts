import { Request, Response } from "express";
import { creatCardService, activateCardService, showBalanceService, blockCardService, unBlockCardService } from "../services/cardService";

export async function createCard(request: Request, response: Response) {
    const API_KEY: any = request.headers["x-api-key"]; // Getting the API key
    await creatCardService(API_KEY, request.body);
    

    response.status(201).send("Card registered successfully");
};

export async function activateCard (request: Request, response: Response) {
    await activateCardService(request.body);

    response.status(202).send("Card activated successfully");
}

export async function cardBalance(request: Request, response: Response) {
    const number: string = request.params.number;
    const resume = await showBalanceService(number);

    response.status(200).send(resume);
}

export async function blockCard(request: Request, response: Response) {
    const cardInfo = request.body;
    await blockCardService(cardInfo);

    response.status(200).send("ok");
}

export async function unBlockCard(request: Request, response: Response) {
    const cardInfo = request.body;
    await unBlockCardService(cardInfo);

    response.status(200).send("ok");
}



