import { userPermission } from "../mapping/userPermission";
import { PlanAttributes } from "./PlansType";

export interface UserAttributes {
    id: number,
    planId: number,
    name: string,
    email: string,
    passwordHash: string,
    active: boolean,
    phone: string,
    userPermission: userPermission,
    acceptedTerms: boolean
}