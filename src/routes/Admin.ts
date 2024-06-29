import { Router } from "express"
import { privateRoute } from "../config/passport";
import AdminController from "../controllers/AdminController";

const router = Router();

router.delete('/cleanUserData', privateRoute, AdminController.cleanUserData)

export default router