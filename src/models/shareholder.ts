import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    BelongsTo,
    ForeignKey,
    BelongsToMany,
    PrimaryKey, IsUUID
} from 'sequelize-typescript';
import { methodNotAllowed, notFound, unauthorized } from 'boom';
import { SecurityTransaction } from './security_transaction';
import { User } from './user';
import { Account } from './account';
import { ShareholderAccount } from './shareholder_account';

@Table({
    tableName: 'shareholders',
    underscored: true,
    timestamps: true,
    paranoid: true,
})

export class Shareholder extends Model<Shareholder> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    uuid: string;

    @ForeignKey(() => User)
    @IsUUID(4)
    @Column({
        field: 'user_id',
        type: DataType.UUID,
        allowNull: true,
    })
    userId: string;

    @Column({
        field: 'invited_at',
    })
    invitedAt: Date;

    @Column({
        field: 'invited_email',
    })
    invitedEmail: string;

    @BelongsTo(() => User) user: User;
    @BelongsToMany(() => Account, () => ShareholderAccount) companies: Account[];
    @HasMany(() => SecurityTransaction) securityTransactions: SecurityTransaction[];
}
