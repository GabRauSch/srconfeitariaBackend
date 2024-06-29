import {NextFunction, Request, Response } from 'express';
import PatternResponses from '../utils/PatternResponses'
import { generateToken, generateHash } from '../config/passport';
import { sendEmail } from '../config/email';
import { confirmRedefinePasswordValidation, confirmRegisterValidation, loginValidation, redefinePassowrdValidation, registerValidation } from '../validation/AuthValidation';
import Users from '../models/Users';
import sequelize from '../config/mysql';
import { idValidation } from '../validation/GlobalValidation';
import { Sequelize } from 'sequelize';
import { generateConfirmationCode } from '../utils/generator';
import PlanPayments from '../models/PlanPayments';
import { addMonths } from 'date-fns';
import Plans from '../models/Plans';
import Products from '../models/Products';
import Orders from '../models/Orders';
import Clients from '../models/Clients';
class AdminController {    
    static async cleanUserData(req: Request, res: Response, next: NextFunction) {
        const user = req.user as any;
        const data = req.body;
      
        const transaction = await sequelize.transaction();
        let deletedOrders, deletedClients, deletedProducts;
      
        try {
          if (data.orders) {
            const deleted = await Orders.destroy({ where: { userId: user.id }, transaction });
            if (deleted === 0) {
              await transaction.rollback();
              return next(PatternResponses.createError('notDeleted', ['orders']));
            }
            deletedOrders = true
          }
        } catch (error) {
            console.error(error);
            await transaction.rollback();
            return next(PatternResponses.createError('databaseError'));
        }
        
        if(deletedOrders){
            try {
                if (data.clients) {
                  const deleted = await Clients.destroy({ where: { userId: user.id }, transaction });
                  if (deleted === 0) {
                    await transaction.rollback();
                    return next(PatternResponses.createError('notDeleted', ['orders']));
                  }
                  deletedOrders = true
                }
              } catch (error) {
                  console.error(error);
                  await transaction.rollback();
                  return next(PatternResponses.createError('databaseError'));
              }
        }



      }

    
}

export default AdminController