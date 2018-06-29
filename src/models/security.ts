import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    BelongsTo,
    ForeignKey,
    PrimaryKey,
    IsUUID
} from 'sequelize-typescript';
import { SecurityTransaction } from './security_transaction';
import { Account } from './account';

@Table({
    tableName: 'securities',
    underscored: true,
    timestamps: true,
    paranoid: true,
})
export class Security extends Model<Security> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    uuid: string;

    @Column name: string;

    /** If security is a warrnt or option it should have link to security and parent will be 'preferred stock', 'common stock' */
    @Column({
        type: DataType.ENUM('warrant', 'preferred_stock', 'common_stock', 'option')
    })
    type: string;

    @ForeignKey(() => Security)
    @IsUUID(4)
    @Column({
        field: 'underlying_security',
        type: DataType.UUID,
    })
    underlyingSecurity: string;

    @ForeignKey(() => Account)
    @IsUUID(4)
    @Column({
        field: 'account_id',
        type: DataType.UUID
    })
    accountId: string;

    @Column({
        field: 'security_class',
    })
    securityClass: string;

    @Column authorized: number;
    @Column issued: number;
    @Column tokenized: string;

    @HasMany(() => SecurityTransaction) securityTransactions: SecurityTransaction[];
    @BelongsTo(() => Account) account: Account;
    @BelongsTo(() => Security) security: Security;
}