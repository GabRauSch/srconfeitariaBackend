import { DataTypes, Model, Optional, QueryTypes } from "sequelize";
import sequelize from "../config/mysql";

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    cpf: string;
    location: any; 
    passwordHash: string;
    confirmationCode: string;
    temporaryUser: number;
    birthday: Date;
    role: string;
    storeId: number,
    createdAt: Date;
}

interface UserCreationAttributes {email: string, passwordHash: string, confirmationCode: string}

class Users extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public passwordHash!: string;
    public confirmationCode!: string;
    public cpf!: string;
    public location!: any;
    public temporaryUser!: number;
    public birthday!: Date;
    public role!: string;
    public storeId!: number;
    public createdAt!: Date;

    static async userByName(name: string): Promise<Users | null>{
        try {
            const user = Users.findOne({
                where: { name }
            })
            return user
        } catch (e) {
            console.error(e);
            return null
        }
    }
    static async findClientsOverView(storeId: number): Promise<any | null>{
        try {
            const rawQuery = 
            `SELECT 
                COUNT(DISTINCT userId) AS clientsCount,
                AVG(totalValue) AS avaragePurchase,
                MAX(totalValue) AS greaterPurhase,
                (SELECT u.name
                    FROM purchases ps
                    INNER JOIN users u ON ps.userId = u.id
                    WHERE ps.totalValue = (SELECT MAX(totalValue) FROM purchases)
                ) AS bestClient
            FROM purchases ps
            JOIN products p ON p.id = ps.productId
            WHERE p.storeId = :storeId;`

            const clientsOverView = await sequelize.query(rawQuery, {
                replacements: {storeId},
                type: QueryTypes.SELECT
            }) 
            return clientsOverView[0]            
        } catch (error) {
            console.error(error);
            return null
        }
    }
    static async findClients(storeId: number): Promise<any[] | null>{
        try {
            const rawQuery = 
            `WITH RankedPurchases AS (
                SELECT 
                    u.id AS id,
                    u.name AS userName, 
                    COUNT(ps.id) AS purchaseAmount,
                    TIMESTAMPDIFF(DAY, MIN(ps.createdAt), NOW()) AS firstPurchase,
                    TIMESTAMPDIFF(DAY, MAX(ps.createdAt), NOW()) AS lastPurchase,
                    CONCAT('R$', REPLACE(FORMAT(SUM(ps.totalValue), 2, 'de_DE'), '.', '')) AS totalValue, 
                    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY MAX(ps.createdAt) DESC) AS row_num
                FROM purchases ps
                JOIN users u ON u.id = ps.userId
                GROUP BY u.id, u.name
            )
            SELECT 
                id, userName, purchaseAmount, firstPurchase, lastPurchase, totalValue
            FROM 
                RankedPurchases
            WHERE 
                row_num = :storeId;`

            const clients: any[] = await sequelize.query(rawQuery, {
                replacements: {storeId},
                type: QueryTypes.SELECT
            })

            return clients
        } catch (error) {
            console.error(error);
            return null
        }
    }   

    // static async GetUserInfo(userId: number): Promise<any | null>{
    //     try {
    //         const rawQuery = `
    //             SELECT id, customName, TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age,
    //                 description, gender, photo, targetAgeRange, targetGender, targetDistanceRange 
    //             FROM users
    //             WHERE id = :userId`;

    //         const user = await sequelize.query(rawQuery, {
    //             replacements: {userId},
    //             type: QueryTypes.SELECT
    //         })

    //         return user[0]

    //     } catch (e) {
    //         console.error(e);
    //         return null
    //     }
    // }
    static async userByConfirmationCode(userToken: string): Promise<Users | null>{
        try {
            const user = await Users.findOne({
                where: {
                    confirmationCode: userToken
                }
            });
            return user
        } catch (e) {
            console.error(e);
            return null
        }
    }
    static async confirmCreation(userUpdate: Users, name: string): Promise<any | null>{
        try {
            
            const updatedUser = await userUpdate.update({
                confirmationCode: '',
                name: name
            });
            
            const data = {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                passwordHash: updatedUser.passwordHash,
                confirmationCode: updatedUser.confirmationCode,
                cpf: updatedUser.cpf,
                location: updatedUser.location,
                temporaryUser: updatedUser.temporaryUser,
                birthday: updatedUser.birthday,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt
            }

            return data
        } catch (e) {
            console.error(e);
            return null
        }
    }

    static async userByEmail(email: string): Promise<Users | null>{
        try {
            const user = Users.findOne({
                where: {
                    email
                }
            })
            return user
        } catch (e) {
            console.error(e);
            return null
        }
    }
    static async createTemporaryUser(email: string, passwordHash: string, confirmationCode: string): Promise<number | null> {
        try {
            const creation = await Users.create({
                email, 
                passwordHash,
                confirmationCode
            }, {
                returning: true
            })
            return creation.id || null
        } catch(e) {
            console.log(e)
            return null
        }
    }
    static async getUserByEmailAndPasswordHash(email: string, passwordHash: string): Promise<Users | null>{
        try {
            const user = Users.findOne({
                where: {
                    email, passwordHash
                }
            })
            return user
        } catch (e) {
            console.error(e);
            return null
        }
    }
    // static async UpdateUserInfo(userId: number, data: UserUpdateData): Promise<boolean>{
    //     try {
    //         const columns = Object.keys(data);
    //         const values = Object.values(data);

    //         const setClause = columns.map((col, index) => `${col} = ?`).join(', ');
    //         console.log(setClause)
    //         const rawQuery = `
    //         UPDATE users 
    //         SET ${setClause} 
    //         WHERE id = ?
    //         `;

    //         const userUpdate = await sequelize.query(rawQuery, {
    //         replacements: [...values, userId],
    //         type: QueryTypes.UPDATE
    //         });



    //         return userUpdate ? true : false
    //     } catch (e) {
    //         console.error(e);
    //         return false
    //     }
    // }

    // static async UsersExist(usersIds: number[]): Promise<Boolean>{
    //     try{
    //         const user = await Users.findAll({
    //             where: {
    //                 id: {
    //                     [Op.in]: {
    //                         ...usersIds
    //                     }
    //                 }
    //             }
    //         })

    //         return user ? true : false
    //     } catch(e){
    //         console.error(e);
    //         return false;
    //     }
    // }
    // static async GetUsersThatLiked(userIdTo: number, alreadyRetrievedIds: number[]): Promise<Users[] | null>{
    //     try {
    //         alreadyRetrievedIds.length == 0 ? alreadyRetrievedIds = [0] : null;

    //         const rawQuery = `
    //         SELECT 
    //             u.customName,
    //             u.description,
    //             u.id, TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age,
    //             u.photo 
    //         FROM users u 
    //             JOIN interactions i ON u.id = i.userIdFrom 
    //                 WHERE i.userIdTo = :userIdTo
    //                     AND i.matched = 0
    //                     AND i.interactionType = 'like'
    //                     AND i.userIdTo NOT IN (:alreadyRetrievedIds);           
    //         `
    //         const users: Users[] = await sequelize.query(rawQuery, {
    //             replacements: {userIdTo, alreadyRetrievedIds},
    //             type: QueryTypes.SELECT
    //         })

    //         return users
            
    //     } catch (e) {
    //         console.error(e);
    //         return null
    //     }
    // }
    // static async findMatches(userId: number): Promise<Users[] | null>{
    //     try {
    //         const rawQuery = `
    //         SELECT
    //         u.id,
    //         i.userIdTo,
    //         u.customName,
    //         u.photo
    //     FROM interactions i 
    //         JOIN users u ON i.userIdTo = u.id
    //         LEFT JOIN messages m ON ((u.id = m.userIdFrom AND :userId = m.userIdTO) OR (u.id = m.userIdTo AND :userId = m.userIdFrom))
    //     WHERE i.matched = 1
    //         AND i.userIdFrom = :userId
    //         AND m.id IS NULL
        
    //     `;
    //         const matches: Users[] = await sequelize.query(rawQuery, {
    //             type: QueryTypes.SELECT,
    //             replacements: {userId}
    //         })
    //         return matches

    //     } catch (e) {
    //         console.error(e);
    //         return null
    //     }
    // }
    // static async GetUserLikes(userIdFrom: number, alreadyRetrievedIds: number[]): Promise<Users[] | null>{
    //     try {
    //         alreadyRetrievedIds.length == 0 ? alreadyRetrievedIds = [0] : null
    //         const rawQuery = `
    //             SELECT 
    //                 u.id, 
    //                 u.customName, 
    //                 TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age, 
    //                 u.photo,
    //                 i.interactionType AS interactionType,
    //                 CASE 
    //                     WHEN i2.interactionType IS NOT NULL THEN i2.interactionType
    //                     ELSE 'none'
    //                 END AS interactionResponse
    //             FROM 
    //                 users u
    //                 LEFT JOIN interactions i ON u.id = i.userIdTo AND i.userIdFrom = :userIdFrom
    //                 LEFT JOIN interactions i2 ON u.id = i2.userIdFrom AND i2.userIdTo = :userIdFrom
    //             WHERE 
    //                 i.interactionType IN ('like')
    //                 AND i.userIdTo NOT IN (:alreadyRetrievedIds)
    //             ORDER BY 
    //                 FIELD(interactionResponse, 'like', 'none', 'dislike');
    //         `;

    //         const users: Users[] = await sequelize.query(rawQuery, {
    //             replacements: { userIdFrom, alreadyRetrievedIds },
    //             type: QueryTypes.SELECT
    //         });
    //         return users
    //     } catch (e) {
    //         console.error(e);
    //         return null
    //     }
    // }
    // static async GetUsersThatYouDisliked(userIdFrom: number, alreadyRetrievedIds: number[]): Promise<Users[] | null>{
    //     try {
    //         alreadyRetrievedIds.length == 0 ? alreadyRetrievedIds = [0] : null
    //         const rawQuery = `
    //         SELECT 
    //             u.id, 
    //             u.customName, 
    //             TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age, 
    //             u.photo,
    //             CASE 
    //                 WHEN i2.interactionType IS NOT NULL THEN i2.interactionType
    //                 ELSE 'none'
    //             END AS interactionResponse
    //         FROM 
    //             users u 
    //         LEFT JOIN 
    //             interactions i ON u.id = i.userIdTo
    //         LEFT JOIN 
    //             interactions i2 ON u.id = i2.userIdFrom AND i2.userIdTo = :userIdFrom
    //         WHERE 
    //             i.userIdFrom = :userIdFrom 
    //             AND i.interactionType = 'dislike'
    //             AND (i2.interactionType IN ('like', 'none') OR i2.interactionType IS NULL)
    //             AND i.userIdTo NOT IN (:alreadyRetrievedIds);`

    //         const users: Users[] = await sequelize.query(rawQuery, {
    //             replacements: {userIdFrom, alreadyRetrievedIds},
    //             type: QueryTypes.SELECT
    //         })
    //         return users
    //     } catch (e) {
    //         console.log(e);
    //         return null;
    //     }
    // }
    // static async RetrieveUsersList(data: FullRetrieveData): Promise<Users[] | null>{
    //     try{
    //         const {ageRange: [minAge, maxAge], location: {latitude, longitude}, rangeInMeters, userId, gender, idsRetrieved} = data;
            
    //         const rawQuery = `
    //             SELECT 
    //                 u.id,
    //                 u.customName,
    //                 u.description,
    //                 u.photo,
    //                 TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age
    //             FROM users u
    //             LEFT JOIN Interactions i ON u.id = i.userIdTo AND i.userIdFrom = :userId
    //             WHERE 
    //                 DATEDIFF(CURDATE(), u.birthday) / 365.25 BETWEEN :minAge AND :maxAge
    //                 AND u.gender = :gender
    //                 AND u.id NOT IN (:userId, ${idsRetrieved.length == 0 ? 0 : idsRetrieved.join(',')})
    //                 AND i.userIdTo IS NULL
    //                 AND ST_Distance_Sphere(
    //                     POINT(:longitude, :latitude),
    //                     u.currentLocation
    //                 ) <= :rangeInMeters
    //             LIMIT 10;
    //         `;
            
    //         const users: Users[] = await sequelize.query(rawQuery, {
    //             replacements: {userId, minAge, maxAge, gender, longitude, latitude, rangeInMeters},
    //             type: QueryTypes.SELECT
    //         });
            
    //         if (!users) {
    //             return null;
    //         }
            
    //         return users;
    //     } catch(e){
    //         console.error(e);
    //         return null;
    //     }
    // }
    // static async SetUserCurrentLocation(userId: number, {latitude, longitude}: Location): Promise<Boolean> {
    //     try {
    //         const encodedLongitude = longitude;
    //         const encodedLatitude = latitude;
            
    //         const userCurrentLocation = await Users.update({
    //             currentLocation: sequelize.literal(`POINT(${encodedLongitude}, ${encodedLatitude})`),
    //         }, {
    //             where: { id: userId }
    //         });

    //         return userCurrentLocation ? true : false;
    //     } catch (e) {
    //         console.error(e);
    //         return false;
    //     }
    // }
    // static async GetUserByLocationRange({latitude, longitude}: Location, rangeInMeters: number): Promise<Users[] | null>{
    //     try {
    //         const encodedLongitude = longitude;
    //         const encodedLatitude = latitude;
            
    //         const userCurrentLocation = await Users.findAll({
    //             where: sequelize.where(
    //                 sequelize.fn(
    //                     'ST_Distance_Sphere',
    //                     sequelize.literal(`POINT(${encodedLongitude}, ${encodedLatitude})`),
    //                     sequelize.col('currentLocation')
    //                 ),
    //                 {
    //                     [Op.lte]: rangeInMeters
    //                 }
    //             )
    //         });

    //         return userCurrentLocation;
    //     } catch (e) {
    //         console.error(e);
    //         return null;
    //     }
    // }
    // static async GetUserByAgeRange(minAge: number, maxAge: number): Promise<Users[] | null> {
    //     try {
    //         const maxBirthdate = subYears(new Date(), minAge);
    //         const minBirthdate = subYears(new Date(), maxAge);
    
    //         console.log(maxBirthdate, minBirthdate);
    //         const user = await Users.findAll({
    //             where: {
    //                 birthday: {
    //                     [Op.between]: [minBirthdate, maxBirthdate],
    //                 },
    //             },
    //         });
    
    //         return user || null;
    //     } catch (e) {
    //         console.error(e);
    //         return null;
    //     }
    // }
    // static async setUserImage(userId: number, photo: string): Promise<Boolean>{
    //     try {
    //         const update = await Users.update({
    //             photo
    //         }, {
    //             where: {
    //                 id: userId
    //             }
    //         })

    //         return update ? true : false

    //     } catch (e) {
    //         console.error(e);
    //         return false
    //     }
    // }
    // static async setUserName(userId: number, customName: string): Promise<Boolean>{
    //     try {
    //         const update = await Users.update({
    //             customName
    //         }, {
    //             where: {
    //                 id: userId
    //             }
    //         })

    //         return update ? true : false

    //     } catch (e) {
    //         console.error(e);
    //         return false
    //     }
    // }
}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmationCode: {
        type: DataTypes.STRING,
    },
    temporaryUser: {
        type: DataTypes.INTEGER,
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    storeId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
});

export default Users;
