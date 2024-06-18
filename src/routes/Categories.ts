import { Router } from "express";
import { CategoriesController } from "../controllers/CategoriesController";
import { privateRoute } from "../config/passport";

const router = Router();
router.use(privateRoute)

router.get('/all/:userId', CategoriesController.getAllByUserId);
router.post('/', CategoriesController.create);

export default router