import { Router } from "express";
import { ClientsController } from "../controllers/ClientsController";
import { ProductsController } from "../controllers/ProductsController";
import { privateRoute } from "../config/passport";

const router = Router();
router.use(privateRoute)

router.get('/all/:userId', ProductsController.getAllByUserId)
router.get('/:id', ProductsController.getById)
router.post('/', ProductsController.create)
router.put('/:id', ProductsController.update)
router.delete('/:id', ProductsController.delete)


export default router