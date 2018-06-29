import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    IsUUID,
    ForeignKey, BelongsTo, HasMany
} from 'sequelize-typescript';
import { BillingSubscription } from './billing_subscription';
import { BillingTransaction } from './billing_transaction';

@Table({
    tableName: 'billing_invoice',
    underscored: true,
    timestamps: true,
    paranoid: true,
})

export class BillingInvoice extends Model<BillingInvoice> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    uuid: string;

    @ForeignKey(() => BillingSubscription)
    @IsUUID(4)
    @Column({
        field: 'subscription_id',
        type: DataType.UUID,
        allowNull: true,
    })
    subscriptionId: string;

    @BelongsTo(() => BillingSubscription) subscription: BillingSubscription;
    @HasMany(() => BillingTransaction) transactions: BillingTransaction[];
}
