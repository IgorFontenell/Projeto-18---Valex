import { Router } from "express";
import { buyingController } from "../controllers/buy_rechargeController";

const buying = Router();

buying.post("/buying", buyingController);


export default buying;
