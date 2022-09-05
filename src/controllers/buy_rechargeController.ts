import { Request, Response } from "express";
import { buyingService, rechargeCardService } from "../services/buy_rechargeService";


export async function rechargeCard(request: Request, response: Response) {
    const API_KEY: any = request.headers["x-api-key"]; // Getting the API key
    const rechargeInfo = request.body;

    await rechargeCardService(API_KEY, rechargeInfo);

    response.status(200).send(`Card recharged with ${request.body.amount}`);
}

export async function buyingController(request: Request, response: Response) {
    const buyingInfo = request.body;

    await buyingService(buyingInfo);

    response.status(200).send(`Your buying was ${request.body.amount}`);
}