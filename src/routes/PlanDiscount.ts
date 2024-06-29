import { Router } from "express";
import { PlanDiscountsController } from "../controllers/PlanDiscountsController";

const router = Router();

router.put('/useDiscount', PlanDiscountsController.useDiscount)

export default router