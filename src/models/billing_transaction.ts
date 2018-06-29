import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    IsUUID,
    ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { BillingInvoice } from './billing_invoice';
import { BillingCard } from './billing_card';

@Table({
    tableName: 'billing_transaction',
    underscored: true,
    timestamps: true,
    paranoid: true,
})

export class BillingTransaction extends Model<BillingTransaction> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    uuid: string;

    @ForeignKey(() => BillingInvoice)
    @IsUUID(4)
    @Column({
        field: 'invoice_id',
        type: DataType.UUID,
        allowNull: true,
    })
    invoiceId: string;

    @ForeignKey(() => BillingCard)
    @IsUUID(4)
    @Column({
        field: 'card_id',
        type: DataType.UUID,
        allowNull: true,
    })
    cardId: string;

    @BelongsTo(() => BillingInvoice) invoice: BillingInvoice;
    @BelongsTo(() => BillingCard) card: BillingCard;
}
