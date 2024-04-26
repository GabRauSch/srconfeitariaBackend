import { Router } from "express";
import { ClientsController } from "../controllers/ClientsController";
import { ProductsController } from "../controllers/ProductsController";

const router = Router();

router.get('/all/:userId', ProductsController.getAllByUserId)
router.get('/:id', ProductsController.getById);
router.post('/', ProductsController.create)
router.put('/:id', ProductsController.update)
router.delete('/:id', ProductsController.delete)


export default router