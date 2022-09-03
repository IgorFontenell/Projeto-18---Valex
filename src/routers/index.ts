import { Router } from "express";
import card from "./cardRoute";


const router = Router();

router.use(card);

export default router;