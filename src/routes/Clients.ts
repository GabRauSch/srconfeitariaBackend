import { Router } from "express";
import { ClientsController } from "../controllers/ClientsController";
import { privateRoute } from "../config/passport";

const router = Router();
router.use(privateRoute)

router.get('/:id', ClientsController.getById)
router.get('/all/:userId', ClientsController.getAllByUserId)
router.post('/', ClientsController.create)
router.put('/:id', ClientsController.update)
router.delete('/:id', ClientsController.delete)


export default router