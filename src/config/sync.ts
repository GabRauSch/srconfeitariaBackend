import Clients from "../models/Clients";
import Users from "../models/Users"

export const syncDatabases = ()=>{
    Users.sync();
    Clients.sync();
}