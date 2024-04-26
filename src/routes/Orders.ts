import { Router } from "express";
import { ClientsController } from "../controllers/ClientsController";

const router = Router();

router.get('/:id')
router.get('/all/:userId');
router.get('/aggregate/category/:userId');
router.post('/');
router.put('/:id')
router.delete('/:id')

export default router