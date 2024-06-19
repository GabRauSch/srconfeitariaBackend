import { Router } from "express";
import AnalyticsController from "../controllers/AnalyticsController";

const router = Router();

router.get('/:userId', AnalyticsController.getResults)

export default router