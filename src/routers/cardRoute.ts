import { Router } from "express";
import { createCard, activateCard, cardBalance, blockCard, unBlockCard } from "../controllers/cardController";




const card = Router();

card.post("/card/create", createCard);
card.post("/card/activate", activateCard);
card.get("/card/balance/:number", cardBalance);
card.post("/card/block", blockCard);
card.post("/card/unblock", unBlockCard);

export default card;
