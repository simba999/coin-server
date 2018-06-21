import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { UserCompany } from './user_company';
import { User } from './user';

@Table({
    tableName: 'companies',
    timestamps: true,
    underscored: true,
    paranoid: true,
})
export class Company extends Model<Company> {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    uuid: string;

    @Column name: string;

    @BelongsToMany(() => User, () => UserCompany)
    users: User[];
}
