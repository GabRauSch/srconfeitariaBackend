import { DataTypes, Model, Op, Optional, Sequelize } from "sequelize";
import sequelize from "../config/mysql";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

export interface CateogriesAttributes {
    id: number,
    userId: number
    description: string,
}

export class Categories extends Model implements CateogriesAttributes{
    public id!: number;
    public userId!: number;
    public description!: string;

    static async findByUserId(userId: number): Promise<Categories[] | CustomError> {
        try {
            const categories = await Categories.findAll({ 
                where: { userId }, 
                attributes: ['id', 'description'] 
            });
            if (!categories) 
                return PatternResponses.createError('noRegister', ['user']);

            return categories;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}


Categories.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Categories',
    tableName: 'categories',
    timestamps: true
});
Categories.beforeCreate(async (category, options) => {
    const existingCategory = await Categories.findOne({
        where: {
            userId: category.userId,
            description: category.description
        }
    });
    if (existingCategory) {
        throw new Error('alreadyExists');
    }
});

Categories.beforeUpdate(async (category, options) => {
    const existingCategory = await Categories.findOne({
        where: {
            userId: category.userId,
            description: category.description,
            id: { [Op.not]: category.id }
        }
    });
    if (existingCategory) {
        throw new Error('alreadyExists');
    }
});

export default Categories;
