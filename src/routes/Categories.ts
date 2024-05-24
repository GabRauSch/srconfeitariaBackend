import { Router } from "express";
import { CategoriesController } from "../controllers/CategoriesController";

const router = Router();

router.get('/all/:userId', CategoriesController.getAllByUserId);
router.post('/', CategoriesController.create);

export default router