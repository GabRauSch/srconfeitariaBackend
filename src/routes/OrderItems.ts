import { Router } from "express";
import { OrderItemsController } from "../controllers/OrderItemsController";
import { privateRoute } from "../config/passport";

const router = Router();
router.use(privateRoute)

router.get('/:orderId', OrderItemsController.getByOrderId)
router.put('/add/:orderId', OrderItemsController.addProductToOrder)
router.put('/:id', OrderItemsController.update)

export default router