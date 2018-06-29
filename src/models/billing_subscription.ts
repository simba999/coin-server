import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    IsUUID,
    ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { User } from './user';
import { BillingPlan } from './billing_plan';

@Table({
    tableName: 'billing_subscriptions',
    underscored: true,
    timestamps: true,
    paranoid: true,
})

export class BillingSubscription extends Model<BillingSubscription> {
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

    @ForeignKey(() => BillingPlan)
    @IsUUID(4)
    @Column({
        field: 'plan_id',
        type: DataType.UUID,
        allowNull: true,
    })
    planId: string;

    @BelongsTo(() => User) user: User;
    @BelongsTo(() => BillingPlan) plan: BillingPlan;
}
