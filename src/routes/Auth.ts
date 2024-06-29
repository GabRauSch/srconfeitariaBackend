import { Router, Response, Request } from "express";
import AuthController from '../controllers/AuthController';
import { privateRoute } from "../config/passport";

const router = Router();

router.post('/register', AuthController.register);
router.post('/confirmRegister', AuthController.registerConfirmation);
router.post('/login', AuthController.login);

// NOT IMPLEMENTED
router.put('/redefinePassword/:userId', AuthController.redefinePassowrd);
router.post('/confirmRedefinePassword/:userId', AuthController.confirmRedefinePassword)
// router.put('/changePlan', AuthController.changePlane);
router.put('/toggleActivation/:userId', AuthController.toggleUserActivation)

export default router