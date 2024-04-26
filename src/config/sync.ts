import Clients from "../models/Clients";
import OrderItems from "../models/OrderItems";
import Users from "../models/Users";
import OrderPayments from "../models/OrderPayments";
import Orders from "../models/Orders";
import PlanPayments from "../models/PlanPayments";
import Plans from "../models/Plans";
import Products from "../models/Products";
import Configs  from "../models/Configs";
import Categories from "../models/Categories";

export const syncDatabases = ()=>{
    Plans.sync();
    Users.sync();
    Categories.sync();
    Clients.sync();
    Configs.sync();
    Products.sync()
    Orders.sync();
    OrderItems.sync();
    OrderPayments.sync();
    PlanPayments.sync();
}