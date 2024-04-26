import { Router, Response, Request } from "express";
import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/register', AuthController.register);
router.post('/registerConfirmation', AuthController.registerConfirmation);
router.post('/login', AuthController.login);

// NOT IMPLEMENTED
router.put('/redefinePassword');
router.post('/confirmRedefinePassword')
router.put('/changePlan');
router.delete('/:id')

export default router