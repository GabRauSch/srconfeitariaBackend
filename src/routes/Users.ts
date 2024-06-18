import { Router } from "express";
import { privateRoute } from "../config/passport";
import { UserController } from "../controllers/UserController";

const router = Router();
router.use(privateRoute)

router.get('/:userId', UserController.getById)
router.put('/:userId', UserController.update)


export default router