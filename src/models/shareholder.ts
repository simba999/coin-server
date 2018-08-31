import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    ForeignKey,
    PrimaryKey, IsUUID
} from 'sequelize-typescript';
import { methodNotAllowed, notFound, unauthorized } from 'boom';
import { SecurityTransaction } from './security_transaction';
import { User } from './user';

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
        type: DataType.ENUM('individual', 'non-individual')
    })
    type: string;

    @Column({
        field: 'invited_email',
    })
    invitedEmail: string;

    @Column address: string;

    @ForeignKey(() => User)
    @IsUUID(4)
    @Column({
        field: 'user_id',
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    userId: string;

    @Column({
        field: 'invite_token',
    })
    inviteToken: string;

    @Column({
        type: DataType.DATE,
        field: 'created_at',
    })
    createdAt: boolean;

    @Column({
        type: DataType.DATE,
        field: 'deleted_at',
    })
    deletedAt: boolean;

    @BelongsTo(() => User) user: User;
    // @HasMany(() => SecurityTransaction) securityTransactions: SecurityTransaction[];
}
