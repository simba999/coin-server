import { Table, Column, Model, DataType, ForeignKey, IsUUID, PrimaryKey } from 'sequelize-typescript';
import { Account } from './account';
import { Shareholder } from './shareholder';

@Table({
    tableName: 'shareholders_accounts',
    underscored: true,
    timestamps: true,
    paranoid: true,
})
export class ShareholderAccount extends Model<ShareholderAccount> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    uuid: string;

    @ForeignKey(() => Shareholder)
    @IsUUID(4)
    @Column({
        field: 'shareholder_id',
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    shareholderId: string;

    @ForeignKey(() => Account)
    @IsUUID(4)
    @Column({
        field: 'account_id',
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    accountId: string;

    @Column({
        type: DataType.ENUM('owner', 'employee', 'shareholder')
    })
    role: string;
}
