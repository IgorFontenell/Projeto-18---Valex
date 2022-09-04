import { Router } from "express";
import { createCard, activateCard } from "../controllers/cardController";




const card = Router();

card.post("/card/create", createCard);
card.post("/card/activate", activateCard);


export default card;
