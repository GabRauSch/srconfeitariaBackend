import { Router } from "express";
import { ClientsController } from "../controllers/ClientsController";
import { OrderPaymentsController } from "../controllers/OrderPaymentsController";
import { privateRoute } from "../config/passport";

const router = Router();
router.use(privateRoute)

router.get('/:orderId', OrderPaymentsController.getByOrderId)
router.get('/user/:userId', OrderPaymentsController.getByUserId)
router.post('/', OrderPaymentsController.create)
router.delete('/:orderId', OrderPaymentsController.delete)


export default router