import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    IsUUID,
    ForeignKey, BelongsTo, HasMany
} from 'sequelize-typescript';
import { User } from './user';
import { BillingTransaction } from './billing_transaction';

@Table({
    tableName: 'billing_cards',
    underscored: true,
    timestamps: true,
    paranoid: true,
})

export class BillingCard extends Model<BillingCard> {
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

    @BelongsTo(() => User) user: User;
    @HasMany(() => BillingTransaction) transactions: BillingTransaction[];
}
