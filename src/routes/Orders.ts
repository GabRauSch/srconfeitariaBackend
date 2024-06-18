import { Router } from "express";
import { ClientsController } from "../controllers/ClientsController";
import { OrdersController } from "../controllers/OrdersController";
import { privateRoute } from "../config/passport";

const router = Router();
router.use(privateRoute)

router.get('/:id', OrdersController.getById);
router.get('/all/:userId', OrdersController.getAllByUserId);
router.get('/aggregate/category/:userId', OrdersController.getAggregateProduct);
router.post('/', OrdersController.create);
router.put('/:id', OrdersController.update);
router.delete('/:id', OrdersController.delete);

export default router