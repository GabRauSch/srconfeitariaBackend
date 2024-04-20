import { Router } from "express";
import { ClientsController } from "../controllers/ClientsController";

const router = Router();

router.get('/:storeId', ClientsController.getAllByStoreId);

export default router