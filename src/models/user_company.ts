import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user';
import { Company } from './company';

@Table({
    tableName: 'users_companies',
    underscored: true,
})
export class UserCompany extends Model<UserCompany> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    userId: number;

    @Column({
        type: DataType.ENUM('owner', 'shareholder')
    }) role: string;

    @ForeignKey(() => Company)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    companyId: number;
}
