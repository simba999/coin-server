import { Table, Column, Model, DataType, ForeignKey, IsUUID, PrimaryKey, BelongsTo } from 'sequelize-typescript';
import { Account } from './account';
import { User } from './user';

@Table({
    tableName: 'user_accounts',
    underscored: true,
    timestamps: true,
    paranoid: true,
})
export class UserAccount extends Model<UserAccount> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    uuid: string;

    @ForeignKey(() => User)
    @IsUUID(4)
    @Column({
        field: 'user_id',
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    userId: string;

    @ForeignKey(() => Account)
    @IsUUID(4)
    @Column({
        field: 'account_id',
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    accountId: string;

    @Column({
        type: DataType.ENUM('owner', 'employee', 'shareholder', 'issuer')
    })
    role: string;

    @BelongsTo(() => User) user: User;
    @BelongsTo(() => Account) account: Account;
}
