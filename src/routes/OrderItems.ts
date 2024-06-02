import { Router } from "express";
import { OrderItemsController } from "../controllers/OrderItemsController";

const router = Router();

router.get('/:orderId', OrderItemsController.getByOrderId)

export default router