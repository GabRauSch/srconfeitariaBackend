import { Router } from "express";
import { ClientsController } from "../controllers/ClientsController";
import { OrderPaymentsController } from "../controllers/OrderPaymentsController";

const router = Router();

router.get('/:orderId', OrderPaymentsController.getByOrderId);
router.post('/', OrderPaymentsController.create)
router.delete('/:orderId', OrderPaymentsController.delete)


export default router