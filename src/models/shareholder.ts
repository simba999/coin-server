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

    @Column name: string;

    @Column({
        type: DataType.ENUM('employee', 'none_empl_individual', 'none_empl_institution', 'founder', 'board_member')
    })
    type: string;

    @Column({
        field: 'invited_email',
    })
    invitedEmail: string;

    @Column address: string;

    // @BelongsTo(() => User) user: User;
    @BelongsToMany(() => Account, () => ShareholderAccount) companies: Account[];
    // @HasMany(() => SecurityTransaction) securityTransactions: SecurityTransaction[];
}
