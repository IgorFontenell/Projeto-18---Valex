import { Router } from "express";
import { createCard } from "../controllers/cardController";




const card = Router();

card.post("/card/create", createCard);


export default card;
