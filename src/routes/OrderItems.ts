import { Router } from "express";
import { OrderItemsController } from "../controllers/OrderItemsController";

const router = Router();

router.get('/:orderId', OrderItemsController.getByOrderId);
router.put('/add/:orderId', OrderItemsController.addProductToOrder);
router.put('/:id', OrderItemsController.update)

export default router