import { Router } from "express";
import { rechargeCard } from "../controllers/buy_rechargeController";

const recharge = Router();

recharge.post("/recharge", rechargeCard);


export default recharge;
