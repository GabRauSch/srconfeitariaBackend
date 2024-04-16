import { Router, Response, Request } from "express";
import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/auth/checkEmailAvailability', AuthController.checkEmailAvailability)
router.post('/auth/register', AuthController.register);
router.post('/auth/registerConfirmation', AuthController.registerConfirmation);
router.post('/auth/login', AuthController.login);

export default router