import { Router } from "express";
import card from "./cardRoute";
import recharge from "./buyingRoute";
import buying from "./buyingRoute";


const router = Router();

router.use(card);
router.use(recharge);
router.use(buying);

export default router;