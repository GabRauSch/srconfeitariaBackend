import { Router } from "express";
import { ClientsController } from "../controllers/ClientsController";

const router = Router();

router.get('/all/:userId')
router.get('/:id');
router.post('/')
router.put('/:id')
router.delete('/:id')


export default router